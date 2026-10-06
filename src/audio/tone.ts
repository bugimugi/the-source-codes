/**
 * A plain sine tone for the frequency pages. It never starts by itself: `start()` must be called from a click,
 * the level fades in and is capped low (0.08), and `stop()` fades out before the oscillator is released.
 */
export function createTone() {
  let audio: AudioContext | null = null;
  let osc: OscillatorNode | null = null;
  let gain: GainNode | null = null;
  let analyser: AnalyserNode | null = null;
  let hz = 432;

  const api = {
    get playing() { return osc !== null; },
    get analyser() { return analyser; },
    start(freq: number): boolean {
      hz = freq;
      if (osc) return true;
      try {
        audio ??= new AudioContext();
        void audio.resume();
        osc = audio.createOscillator();
        gain = audio.createGain();
        analyser = audio.createAnalyser();
        analyser.fftSize = 2048;
        osc.type = "sine";
        osc.frequency.value = hz;
        gain.gain.value = 0;
        osc.connect(gain).connect(analyser).connect(audio.destination);
        osc.start();
        gain.gain.linearRampToValueAtTime(0.08, audio.currentTime + 0.6);
        return true;
      } catch (e) {
        console.warn("Audio nicht verfügbar", e);
        osc = gain = analyser = null;
        return false;
      }
    },
    setHz(freq: number) {
      hz = freq;
      if (osc && audio) osc.frequency.setTargetAtTime(hz, audio.currentTime, 0.05);
    },
    stop() {
      if (!audio || !osc || !gain) return;
      const o = osc, g = gain, a = audio;
      g.gain.cancelScheduledValues(a.currentTime);
      g.gain.setTargetAtTime(0, a.currentTime, 0.12);
      setTimeout(() => { try { o.stop(); o.disconnect(); g.disconnect(); } catch { /* already stopped */ } }, 500);
      osc = gain = analyser = null;
    },
  };
  return api;
}
export type Tone = ReturnType<typeof createTone>;
