const ViomiOperationModeControlCapability = require("../ViomiOperationModeControlCapability");
const ViomiMiotServices = require("../../ViomiMiotServices");

const MIOT_SERVICES = ViomiMiotServices["V13"];

class ViomiV13OperationModeControlCapability extends ViomiOperationModeControlCapability {
    async selectPreset(preset) {
        const matchedPreset = this.presets.find(p => {
            return p.name === preset;
        });

        if (matchedPreset) {
            await this.robot.sendCommand("set_properties", [{
                did: this.robot.deviceId.toString(),
                siid: MIOT_SERVICES.VACUUM.SIID,
                piid: MIOT_SERVICES.VACUUM.PROPERTIES.WDR_MODE.PIID,
                value: matchedPreset.value,
            }]);
        } else {
            throw new Error("Invalid Preset");
        }
    }

}

module.exports = ViomiV13OperationModeControlCapability;
