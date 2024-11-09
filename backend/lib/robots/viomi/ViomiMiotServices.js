module.exports = {
    //https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:vacuum:0000A006:viomi-v13:2
    "V13": Object.freeze({
        DEVICE_INFORMATION: {
            SIID: 1,
            PROPERTIES: {
                MANUFACTURER: {
                    PIID: 1
                },
                MODEL: {
                    PIID: 2
                },
                SERIAL_NUMBER: {
                    PIID: 3
                },
                FIRMWARE_REVISION: {
                    PIID: 4
                }
            }
        },
        VACUUM: {
            SIID: 2,
            PROPERTIES: {
                STATUS: {
                    PIID: 1
                },
                FAULT: {
                    PIID: 2
                },
                SWEEP_TYPE: {
                    PIID: 4
                },
                WDR_MODE: { // operation mode
                    PIID: 11
                },
                DOOR_STATE: { // box type
                    PIID: 12
                },
                CONTACT_STATE_1: { // mop type
                    PIID: 13
                },
                STREAM_ADDRESS: {
                    PIID: 14
                },
                CONTACT_STATE_2: {
                    PIID: 15
                },
                CONTACT_STATE_3: {
                    PIID: 16
                },
                MUTE: { // speaker volume
                    PIID: 17
                },
                MODE: { // fan speed
                    PIID: 19
                }
            },
            ACTIONS: {
                START_SWEEP: {
                    AIID: 1
                },
                STOP_SWEEPING: {
                    AIID: 2
                },
                PAUSE: {
                    AIID: 3
                },
                START_CHARGE: {
                    AIID: 4
                },
                STOP_MASSAGE: {
                    AIID: 5
                },
                START_MOP: {
                    AIID: 6
                },
                START_ONLY_SWEEP: {
                    AIID: 7
                },
                START_SWEEP_MOP: {
                    AIID: 8
                }
            }
        },
        BATTERY: {
            SIID: 3,
            PROPERTIES: {
                BATTERY_LEVEL: {
                    PIID: 1
                }
            }
        },
        VIOMI_VACUUM: {
            SIID: 4,
            PROPERTIES: {
                REPEAT_STATE: {
                    PIID: 1
                },
                REMEMBER_STATE: {
                    PIID: 3
                },
                HAS_MAP: {
                    PIID: 4
                },
                HAS_NEWMAP: {
                    PIID: 5
                },
                MOP_ROUTE: {
                    PIID: 6
                },
                SIDE_BRUSH_LIFE: {
                    PIID: 8
                },
                SIDE_BRUSH_HOURS: {
                    PIID: 9
                },
                MAIN_BRUSH_LIFE: {
                    PIID: 10
                },
                MAIN_BRUSH_HOURS: {
                    PIID: 11
                },
                HYPA_LIFE: {
                    PIID: 12
                },
                HYPA_HOURS: {
                    PIID: 13
                },
                MOP_LIFE: {
                    PIID: 14
                },
                MOP_HOURS: {
                    PIID: 15
                },
                DIRECTION: {
                    PIID: 16
                },
                SUCTION_GRADE: {
                    PIID: 17
                },
                WATER_GRADE: {
                    PIID: 18
                },
                CONSUMABLE_INDEX: {
                    PIID: 19
                },
                CLEAN_ROOM_IDS: {
                    PIID: 20
                },
                CLEAN_ROOM_MODE: {
                    PIID: 21
                },
                CLEAN_ROOM_OPER: {
                    PIID: 22
                },
                MAP_NUM: {
                    PIID: 23
                },
                TIME_ZONE: {
                    PIID: 24
                },
                CLEAN_START_TIME: {
                    PIID: 25
                },
                CLEAN_USE_TIME: {
                    PIID: 26
                },
                CLEAN_AREA: {
                    PIID: 27
                },
                CLEAN_MAP_URL: {
                    PIID: 28
                },
                CLEAN_MODE: {
                    PIID: 29
                },
                CLEAN_WAY: {
                    PIID: 30
                },
                CUR_LANG: {
                    PIID: 31
                },
                CUR_MAP_ID: {
                    PIID: 32
                }
            },
            ACTIONS: {
                RESET_MAP: {
                    AIID: 7
                },
                SET_CALIBRATION: {
                    AIID: 10
                },
                RESET_CONSUMABLE: {
                    AIID: 11
                },
                SET_ROOM_CLEAN: {
                    AIID: 13
                },
                CREATE_NEW_MAP: {
                    AIID: 14
                },
                SET_QUEUE_ROOM_CLEAN: {
                    AIID: 15
                }
            }
        },
        ORDER: {
            SIID: 5,
            PROPERTIES: {
                ORDER_ID: {
                    PIID: 1
                },
                ENABLE: {
                    PIID: 2
                },
                DAY: {
                    PIID: 3
                },
                HOUR: {
                    PIID: 4
                },
                MINUTE: {
                    PIID: 5
                },
                REPEAT: {
                    PIID: 6
                },
                CLEAN_WAY: {
                    PIID: 8
                },
                SUCTION: {
                    PIID: 9
                },
                WATER: {
                    PIID: 10
                },
                TWICE_CLEAN: {
                    PIID: 11
                },
                MAPID: {
                    PIID: 12
                },
                ROOM_COUNT: {
                    PIID: 13
                },
                ROOM_DATA: {
                    PIID: 14
                },
                DND_ENABLE: {
                    PIID: 15
                },
                DND_START_HOUR: {
                    PIID: 16
                },
                DND_START_MINUTE: {
                    PIID: 17
                },
                DND_END_HOUR: {
                    PIID: 18
                },
                DND_END_MINUTE: {
                    PIID: 19
                },
                DND_TIMEZONE: {
                    PIID: 20
                },
                TIMESTAMP: {
                    PIID: 21
                },
                ORDERDATA: {
                    PIID: 22
                }
            },
            ACTIONS: {
                DEL: {
                    AIID: 2
                },
                GET: {
                    AIID: 3
                }
            }
        },
        POINT_ZONE: {
            SIID: 6,
            PROPERTIES: {
                TARGET_POINT: {
                    PIID: 1
                },
                ZONE_POINTS: {
                    PIID: 2
                },
                RESTRICT_POINTS: {
                    PIID: 3
                },
                PAUSE_TYPE: {
                    PIID: 4
                }
            },
            ACTIONS: {
                START_POINT_CLEAN: {
                    AIID: 1
                },
                PAUSE_POINT_CLEAN: {
                    AIID: 2
                },
                START_ZONE_CLEAN: {
                    AIID: 5
                },
                PAUSE_ZONE_CLEAN: {
                    AIID: 6
                }
            }
        },
        MAP: {
            SIID: 7,
            PROPERTIES: {
                MAP_TYPE: {
                    PIID: 1
                },
                MAP_ID: {
                    PIID: 2
                },
                NEW_MAP_OPER: {
                    PIID: 3
                },
                MAP_NAME: {
                    PIID: 4
                },
                LANG: {
                    PIID: 5
                },
                ARRANGE_ROOM_IDS: {
                    PIID: 6
                },
                TARGET_ROOM_ID: {
                    PIID: 7
                },
                SPLIT_POINTS: {
                    PIID: 8
                },
                ROOM_NAME: {
                    PIID: 9
                },
                CUR_CLEANING_PATH: {
                    PIID: 10
                },
                MAP_LIST: {
                    PIID: 11
                }
            },
            ACTIONS: {
                UPLOAD_BY_MAPTYPE: {
                    AIID: 1
                },
                UPLOAD_BY_MAPID: {
                    AIID: 2
                },
                SET_CUR_MAP: {
                    AIID: 3
                },
                DEAL_NEW_MAP: {
                    AIID: 4
                },
                DEL_MAP: {
                    AIID: 5
                },
                RENAME_MAP: {
                    AIID: 7
                },
                ARRANGE_ROOM: {
                    AIID: 8
                },
                SPLIT_ROOM: {
                    AIID: 9
                },
                RENAME_ROOM: {
                    AIID: 10
                },
                GET_MAP_LIST: {
                    AIID: 11
                }
            }
        },
        VOICE: {
            SIID: 8,
            PROPERTIES: {
                TARGET_VOICE: {
                    PIID: 3
                },
                CUR_VOICE: {
                    PIID: 4
                },
                DOWNLOAD_STATUS: {
                    PIID: 5
                },
                DOWNLOAD_PROGRESS: {
                    PIID: 6
                },
                VOICE_URL: {
                    PIID: 7
                },
                VOICE_MDFIVE: {
                    PIID: 8
                }
            },
            ACTIONS: {
                FIND_DEVICE: {
                    AIID: 2
                },
                DOWNLOAD_VOICE: {
                    AIID: 3
                },
                GET_DOWNLOADSTATUS: {
                    AIID: 4
                }
            }
        }
    })
};
