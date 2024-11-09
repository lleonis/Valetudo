const ViomiWaterUsageControlCapability = require("../ViomiWaterUsageControlCapability");
const ViomiMiotServices = require("../../ViomiMiotServices");

const MIOT_SERVICES = ViomiMiotServices["V13"];

class ViomiV13WaterUsageControlCapability extends ViomiWaterUsageControlCapability {
    async selectPreset(preset) {
        const matchedPreset = this.presets.find(p => {
            return p.name === preset;
        });

        if (matchedPreset) {
            await this.robot.sendCommand("set_properties", [{
                did: this.robot.deviceId.toString(),
                siid: MIOT_SERVICES.VIOMI_VACUUM.SIID,
                piid: MIOT_SERVICES.VIOMI_VACUUM.PROPERTIES.WATER_GRADE.PIID,
                value: matchedPreset.value,
            }]);
        } else {
            throw new Error("Invalid Preset");
        }
    }
}

module.exports = ViomiV13WaterUsageControlCapability;
