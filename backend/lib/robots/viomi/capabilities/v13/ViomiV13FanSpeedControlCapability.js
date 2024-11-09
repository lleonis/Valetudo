const ViomiFanSpeedControlCapability = require("../ViomiFanSpeedControlCapability");
const ViomiMiotServices = require("../../ViomiMiotServices");

const MIOT_SERVICES = ViomiMiotServices["V13"];

class ViomiV13FanSpeedControlCapability extends ViomiFanSpeedControlCapability {
    async selectPreset(preset) {
        const matchedPreset = this.presets.find(p => {
            return p.name === preset;
        });

        if (matchedPreset) {
            await this.robot.sendCommand("set_properties", [{
                did: this.robot.deviceId.toString(),
                siid: MIOT_SERVICES.VIOMI_VACUUM.SIID,
                piid: MIOT_SERVICES.VIOMI_VACUUM.PROPERTIES.SUCTION_GRADE.PIID,
                value: matchedPreset.value,
            }]);
        } else {
            throw new Error("Invalid Preset");
        }
    }

}

module.exports = ViomiV13FanSpeedControlCapability;
