class SoundService {

  audioContext;
  audioBuffer;
  sources;
  audioObjects;

  constructor() {
    this.audioContext = null;
    this.audioBuffer = null;
    this.sources = []; //keep track of all context sounds
    this.audioObjects = []; // Keep track of Audio objects
  }

  async loadSound(url) {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.playSound(); 
    } catch (error) {
      console.error('Error with decoding audio data:', error);
    }
  }

  playSound() {
    if (this.audioBuffer) {
      const source = this.audioContext.createBufferSource();
      source.buffer = this.audioBuffer;
      source.connect(this.audioContext.destination);
      source.loop = true;
      source.start(0);
      this.sources.push(source); 
    }
  }

  async playSoundBasic(soundName) {
    try {
      const module = await import(`@/assets/sounds/${soundName}.wav`);
      const audio = new Audio(module.default);
      audio.play();
      this.audioObjects.push(audio);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  async playLoop() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  
    try {
      await this.loadSound(new URL('@/assets/sounds/bg_loop.wav', import.meta.url).href);
    } catch (error) {
      console.error('Error initiating playLoop:', error);
    }
  }

  stopAllSounds() {
    this.sources.forEach(source => {
      source.stop();
    });
    this.sources = [];

    this.audioObjects.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.audioObjects = []; 
  }

  cleanup() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null; // Prepare for reinitialization
    }
  }
}

export default new SoundService();

