const Configuration = require("./Configuration");
const env = require("./res/env");
const fs = require("fs");
const Logger = require("./Logger");
const MqttController = require("./mqtt/MqttController");
const NTPClient = require("./NTPClient");
const os = require("os");
const path = require("path");
const Tools = require("./utils/Tools");
const v8 = require("v8");
const ValetudoEventStore = require("./ValetudoEventStore");
const Webserver = require("./webserver/WebServer");

const NetworkAdvertisementManager = require("./NetworkAdvertisementManager");
const NetworkConnectionStabilizer = require("./NetworkConnectionStabilizer");
const Scheduler = require("./scheduler/Scheduler");
const Updater = require("./updater/Updater");
const ValetudoEventHandlerFactory = require("./valetudo_events/ValetudoEventHandlerFactory");
const ValetudoHelper = require("./utils/ValetudoHelper");
const ValetudoRobotFactory = require("./core/ValetudoRobotFactory");

class Valetudo {
    constructor() {
        this.config = new Configuration();

        try {
            Logger.setLogLevel(this.config.get("logLevel"));
            Logger.setLogFilePath(process.env[env.LogPath] ?? path.join(os.tmpdir(), "valetudo.log"));
        } catch (e) {
            Logger.error("Initialising Logger: " + e);
        }

        this.valetudoEventStore = new ValetudoEventStore({});

        try {
            const robotImplementation = ValetudoRobotFactory.getRobotImplementation(this.config);

            // noinspection JSValidateTypes
            this.robot = new robotImplementation({
                config: this.config,
                valetudoEventStore: this.valetudoEventStore
            });
        } catch (e) {
            Logger.error("Error while initializing robot implementation. Shutting down ", e);

            return process.exit(1);
        }

        this.valetudoEventStore.setEventHandlerFactory(new ValetudoEventHandlerFactory({robot: this.robot}));
        this.valetudoHelper = new ValetudoHelper({config: this.config, robot: this.robot});


        Logger.info(`Starting Valetudo ${Tools.GET_VALETUDO_VERSION()}`);
        Logger.info(`Commit ID: ${Tools.GET_COMMIT_ID()}`);
        Logger.info(`Configuration file: ${this.config.location}`);
        Logger.info(`Logfile: ${Logger.getLogFilePath()}`);
        Logger.info(`Robot: ${this.robot.getManufacturer()} ${this.robot.getModelName()} (${this.robot.constructor.name})`);
        Logger.info(`JS Runtime Version: ${process.version}`);
        Logger.info(`Arch: ${process.arch}`);
        Logger.info(`Max Heap Size: ${v8.getHeapStatistics().heap_size_limit / 1024 / 1024} MiB`);
        Logger.info(`Node Flags: ${process.execArgv.join(" ")}`);
        Logger.info(`Autogenerated System ID: ${Tools.GET_HUMAN_READABLE_SYSTEM_ID()}`);


        this.ntpClient = new NTPClient({
            config: this.config
        });

        this.robot.startup();

        this.updater = new Updater({
            config: this.config,
            robot: this.robot
        });

        this.mqttController = new MqttController({
            config: this.config,
            robot: this.robot,
            valetudoEventStore: this.valetudoEventStore,
            valetudoHelper: this.valetudoHelper
        });

        this.networkAdvertisementManager = new NetworkAdvertisementManager({
            config: this.config,
            robot: this.robot,
            valetudoHelper: this.valetudoHelper
        });

        this.scheduler = new Scheduler({
            config: this.config,
            robot: this.robot,
            ntpClient: this.ntpClient
        });

        this.webserver = new Webserver({
            config: this.config,
            robot: this.robot,
            mqttController: this.mqttController,
            networkAdvertisementManager: this.networkAdvertisementManager,
            ntpClient: this.ntpClient,
            updater: this.updater,
            scheduler: this.scheduler,
            valetudoEventStore: this.valetudoEventStore,
            valetudoHelper: this.valetudoHelper
        });


        this.networkConnectionStabilizer = new NetworkConnectionStabilizer({
            config: this.config
        });


        this.setupMemoryManagement();
        this.setupEmbeddedTweaks();
    }

    /**
     * @private
     */
    setupMemoryManagement() {
        /**
         * Surprisingly, allocated buffers are not part of the v8 heap.
         * Furthermore, even though that they could be garbage collected,
         * for some reason that doesn't happen immediately (at least on node v14.16.0) which leads to
         * memory issues on machines like the roborock s5 max
         *
         * Therefore, we'll manually force a gc if the memory usage seems odd
         *
         * This could use some more testing and will probably require tweaking with new hw as well as sw versions
         */
        //@ts-ignore
        if (typeof global.gc === "function") {
            const heapLimit = v8.getHeapStatistics().heap_size_limit;
            const overHeapLimit = heapLimit + (10*1024*1024); //10mb of buffers and other stuff sounds somewhat reasonable
            const rssLimit = os.totalmem()*(1/3);

            let lastForcedGc = new Date(0);

            this.gcInterval = setInterval(() => {
                //@ts-ignore
                const rss = process.memoryUsage.rss();

                if (rss > overHeapLimit) {
                    const now = new Date();
                    //It doesn't make sense to GC every 250ms repeatedly. Therefore, we rate-limit this
                    if (now.getTime() - 2500 > lastForcedGc.getTime()) {
                        lastForcedGc = now;

                        //@ts-ignore
                        //eslint-disable-next-line no-undef
                        global.gc();

                        const rssAfter = process.memoryUsage.rss();
                        const rssDiff = rss - rssAfter;

                        if (rssDiff > 0) {
                            Logger.debug("GC forced at " + rss + " bytes RSS freed " + rssDiff + " bytes of memory.");
                        } else {
                            Logger.debug("GC forced at " + rss + " bytes RSS was unsuccessful.");
                        }
                    }
                }

                if (rss > rssLimit && this.config.get("embedded") === true) {
                    Logger.error(
                        "Valetudo is currently taking up " + rss +
                        " bytes which is more than 1/3 of available system memory. " +
                        "To ensure safe robot operation, it will now shutdown.\n",
                        {
                            "process.memoryUsage()": process.memoryUsage(),
                            "process.resourceUsage()": process.resourceUsage(),
                            "v8.getHeapStatistics()": v8.getHeapStatistics(),
                            "v8.getHeapSpaceStatistics()": v8.getHeapSpaceStatistics(),
                            "v8.getHeapCodeStatistics()": v8.getHeapCodeStatistics()
                        }
                    );

                    this.shutdown().catch(() => {
                        /* intentional */
                    }).finally(() => {
                        process.exit(1);
                    });
                }
            }, 250);
        }
    }

    /**
     * @private
     */
    setupEmbeddedTweaks() {
        if (this.config.get("embedded") !== true) {
            return;
        }

        try {
            const newOOMScoreAdj = 666;
            const previousOOMScoreAdj = parseInt(fs.readFileSync("/proc/self/oom_score_adj").toString());

            if (previousOOMScoreAdj > newOOMScoreAdj) {
                Logger.info("Current /proc/self/oom_score_adj: " + newOOMScoreAdj);
            } else {
                fs.writeFileSync("/proc/self/oom_score_adj", newOOMScoreAdj.toString());

                Logger.info(`Setting /proc/self/oom_score_adj to ${newOOMScoreAdj}. Previous value: ${previousOOMScoreAdj}`);
            }
        } catch (e) {
            Logger.warn("Error while setting OOM Score Adj:", e);
        }


        const newPriority = os.constants.priority.PRIORITY_BELOW_NORMAL;
        const previousPriority = os.getPriority();

        os.setPriority(newPriority);

        Logger.info(`Setting process priority to ${newPriority}. Previous value: ${previousPriority}`);
    }

    async shutdown() {
        Logger.info("Valetudo shutdown in progress...");

        const forceShutdownTimeout = setTimeout(() => {
            Logger.warn("Failed to shutdown valetudo in a timely manner. Using (the) force");
            process.exit(1);
        }, 5000);

        // shuts down valetudo (reverse startup sequence):
        clearInterval(this.gcInterval);

        await this.networkConnectionStabilizer.shutdown();
        await this.networkAdvertisementManager.shutdown();
        await this.scheduler.shutdown();
        if (this.mqttController) {
            await this.mqttController.shutdown();
        }

        await this.webserver.shutdown();
        await this.robot.shutdown();
        await this.ntpClient.shutdown();

        Logger.info("Valetudo shutdown done");
        clearTimeout(forceShutdownTimeout);
    }
}

module.exports = Valetudo;
