const MiioValetudoRobot = require("../MiioValetudoRobot");
const ViomiValetudoRobot = require("./ViomiValetudoRobot");
const ViomiMiotServices = require("./ViomiMiotServices");
const Logger = require("../../Logger");
const RobotFirmwareError = require("../../core/RobotFirmwareError");
const capabilities = require("./capabilities");
const v13Capabilities = require("./capabilities/v13");
const attributes = require("./ViomiCommonAttributes");
const ValetudoSelectionPreset = require("../../entities/core/ValetudoSelectionPreset");
const stateAttrs = require("../../entities/state/attributes");

const MIOT_SERVICES = ViomiMiotServices["V13"];

class ViomiV13ValetudoRobot extends ViomiValetudoRobot {
    constructor(options) {
        super(options);

        if (options.waterGrades !== undefined) {
            this.waterGrades = options.waterGrades;
        } else {
            this.waterGrades = WATER_GRADES_V13;
        }

        // leave ViomiBasicControlCapability, it's the same
        // delete this.capabilities[capabilities.ViomiBasicControlCapability.TYPE];

        delete this.capabilities[capabilities.ViomiOperationModeControlCapability.TYPE];
        this.registerCapability(new v13Capabilities.ViomiV13OperationModeControlCapability({
            robot: this,
            presets: Object.keys(attributes.ViomiOperationMode).map(k => {
                return new ValetudoSelectionPreset({name: k, value: attributes.ViomiOperationMode[k]});
            }),
        }));

        delete this.capabilities[capabilities.ViomiFanSpeedControlCapability.TYPE];
        this.registerCapability(new v13Capabilities.ViomiV13FanSpeedControlCapability({
            robot: this,
            presets: Object.keys(this.fanSpeeds).map(k => {
                return new ValetudoSelectionPreset({name: k, value: this.fanSpeeds[k]});
            })
        }));

        delete this.capabilities[capabilities.ViomiWaterUsageControlCapability.TYPE];
        this.registerCapability(new v13Capabilities.ViomiV13WaterUsageControlCapability({
            robot: this,
            presets: Object.keys(this.waterGrades).map(k => {
                return new ValetudoSelectionPreset({name: k, value: this.waterGrades[k]});
            })
        }));

        // TODO reset consumables not the same, reading works
        // delete this.capabilities[capabilities.ViomiConsumableMonitoringCapability.TYPE];

        // leave ViomiCurrentStatisticsCapability, it's the same
        // delete this.capabilities[capabilities.ViomiCurrentStatisticsCapability.TYPE];

        // TODO
        delete this.capabilities[capabilities.ViomiPersistentMapControlCapability.TYPE];

        // TODO
        delete this.capabilities[capabilities.ViomiCombinedVirtualRestrictionsCapability.TYPE];

        // TODO
        delete this.capabilities[capabilities.ViomiZoneCleaningCapability.TYPE];

        // TODO
        delete this.capabilities[capabilities.ViomiCarpetModeControlCapability.TYPE];

        delete this.capabilities[capabilities.ViomiSpeakerVolumeControlCapability.TYPE];
        this.registerCapability(new v13Capabilities.ViomiV13SpeakerVolumeControlCapability({
            robot: this
        }));

        // TODO
        delete this.capabilities[capabilities.ViomiMapSegmentationCapability.TYPE];

        // TODO
        delete this.capabilities[capabilities.ViomiDoNotDisturbCapability.TYPE];

        // TODO
        delete this.capabilities[capabilities.ViomiManualControlCapability.TYPE];
    }

    getModelName() {
        return "V13";
    }

    static IMPLEMENTATION_AUTO_DETECTION_HANDLER() {
        const deviceConf = MiioValetudoRobot.READ_DEVICE_CONF(ViomiValetudoRobot.DEVICE_CONF_PATH);
        return !!(deviceConf && deviceConf.model === "viomi.vacuum.v13");
    }

    async getMiotProperties(properties) {
        const commandOptions = properties.map((property) => ({
            did: this.deviceId.toString(),
            siid: MIOT_SERVICES[property.split(".")[0]].SIID,
            piid: MIOT_SERVICES[property.split(".")[0]].PROPERTIES[property.split(".")[1]].PIID,
        }));

        const response = await this.sendCommand("get_properties", commandOptions);
        let result = {};
        response.map((item, index) => {
            if(item.code !== 0) {
                const err = `Error code ${item.code} (did: ${item.did}, siid: ${item.siid}, piid: ${item.piid})`;
                Logger.warn("Error while sending cloud ack", err);
                throw new RobotFirmwareError(err);
            }
            result[properties[index]] = item.value;
        });

        return result;
    }

    async getMiotProperty(property) {
        return await this.getMiotProperties([property])[property];
    }

    async pollState() {
        const res = await this.getMiotProperties([
            "VACUUM.STATUS",
            "VACUUM.FAULT",
            "VACUUM.SWEEP_TYPE",
            "VACUUM.WDR_MODE",
            "VACUUM.DOOR_STATE",
            "VACUUM.CONTACT_STATE_1",
            "BATTERY.BATTERY_LEVEL",
            "VIOMI_VACUUM.SUCTION_GRADE",
            "VIOMI_VACUUM.WATER_GRADE",
            "VIOMI_VACUUM.CLEAN_USE_TIME",
            "VIOMI_VACUUM.CLEAN_AREA",
            // "VACUUM.MUTE",
        ]);
console.log(res);

        const statusDict = {
            run_state: STATUS_TO_RUN_STATE[res["VACUUM.STATUS"]],
            err_state: res["VACUUM.FAULT"],
            mode: res["VACUUM.SWEEP_TYPE"],
            battary_life: res["BATTERY.BATTERY_LEVEL"], // not a typo, Viomi calls it "battary" with 'a' instead of 'e'
            suction_grade: res["VIOMI_VACUUM.SUCTION_GRADE"],
            water_grade: res["VIOMI_VACUUM.WATER_GRADE"],
            s_area: res["VIOMI_VACUUM.CLEAN_AREA"],
            s_time: res["VIOMI_VACUUM.CLEAN_USE_TIME"],
            box_type: res["VACUUM.DOOR_STATE"],
            is_mop: res["VACUUM.WDR_MODE"], // Viomi namings are really abysmal, these have nothing to do with operation mode
            mop_type: res["VACUUM.CONTACT_STATE_1"],
        };
console.log(statusDict);
        this.parseAndUpdateState(statusDict);

console.log(this.state);
        return this.state;
    }
}

const STATUS_TO_RUN_STATE = Object.freeze({
    0: 0, // Sleep
    1: 1, // Idle
    2: 2, // Paused
    3: 4, // Go Charging
    4: 5, // Charging
    5: 3, // Sweeping
    6: 6, // Sweeping And Mopping
    7: 7, // Mopping
});

const WATER_GRADES_V13 = Object.freeze({
    [stateAttrs.PresetSelectionStateAttribute.INTENSITY.LOW]: 0,
    [stateAttrs.PresetSelectionStateAttribute.INTENSITY.MEDIUM]: 1,
    [stateAttrs.PresetSelectionStateAttribute.INTENSITY.HIGH]: 2,
});
module.exports = ViomiV13ValetudoRobot;
