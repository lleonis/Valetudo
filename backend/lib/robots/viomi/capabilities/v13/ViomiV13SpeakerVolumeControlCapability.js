const ViomiSpeakerVolumeControlCapability = require("../ViomiSpeakerVolumeControlCapability");

class ViomiV13SpeakerVolumeControlCapability extends ViomiSpeakerVolumeControlCapability {
    async getVolume() {
        const result = await this.robot.getMiotProperty("VACUUM.MUTE");
        return result[0] * 10;
    }
}

module.exports = ViomiV13SpeakerVolumeControlCapability;
