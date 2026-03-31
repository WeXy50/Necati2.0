/**
 * ═══════════════════════════════════════════════
 *  UNPROVABLE REALITY — Ambient Sound Design
 * ═══════════════════════════════════════════════
 */

UR.Audio = (() => {
  let ctx;
  let nodes = [];
  let masterGain;
  let noiseNode;
  let initialized = false;

  const VOICES = [
    { freq: 48,    type: 'sine',     gain: 0.014, filterFreq: 350 },
    { freq: 72,    type: 'sine',     gain: 0.009, filterFreq: 280 },
    { freq: 96,    type: 'sine',     gain: 0.006, filterFreq: 420 },
    { freq: 144,   type: 'triangle', gain: 0.003, filterFreq: 300 },
    { freq: 192,   type: 'sine',     gain: 0.002, filterFreq: 240 }
  ];

  function init() {
    if (initialized) return;
    initialized = true;

    ctx = new (window.AudioContext || window.webkitAudioContext)();

    /* ─── Master Gain ─── */
    masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);

    /* ─── Convolver (Simple Reverb) ─── */
    const convolver = ctx.createConvolver();
    const reverbLength = ctx.sampleRate * 3;
    const reverbBuf = ctx.createBuffer(2, reverbLength, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = reverbBuf.getChannelData(ch);
      for (let i = 0; i < reverbLength; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbLength, 2.5);
      }
    }
    convolver.buffer = reverbBuf;

    const reverbGain = ctx.createGain();
    reverbGain.gain.value = 0.15;
    convolver.connect(reverbGain);
    reverbGain.connect(masterGain);

    /* ─── Oscillator Voices ─── */
    VOICES.forEach(voice => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = voice.type;
      osc.frequency.value = voice.freq;

      filter.type = 'lowpass';
      filter.frequency.value = voice.filterFreq;
      filter.Q.value = 0.7;

      gain.gain.value = voice.gain;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      gain.connect(convolver);
      osc.start();

      nodes.push({ osc, gain, filter, baseFreq: voice.freq });
    });

    /* ─── Noise Layer ─── */
    const noiseLength = ctx.sampleRate * 2;
    const noiseBuf = ctx.createBuffer(1, noiseLength, ctx.sampleRate);
    const noiseData = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseLength; i++) {
      noiseData[i] = Math.random() * 2 - 1;
    }

    noiseNode = ctx.createBufferSource();
    noiseNode.buffer = noiseBuf;
    noiseNode.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 160;
    noiseFilter.Q.value = 0.5;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.003;

    noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noiseNode.start();

    nodes.push({ osc: noiseNode, gain: noiseGain, filter: noiseFilter, isNoise: true });
  }

  function toggle() {
    if (!initialized) init();

    UR.state.sound = !UR.state.sound;
    const btn = document.getElementById('soundBtn');
    const textEl = btn.querySelector('.sound-btn__text');

    if (UR.state.sound) {
      if (ctx.state === 'suspended') ctx.resume();
      masterGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 2);
      btn.classList.add('is-on');
      if (textEl) textEl.textContent = 'SOUND ON';
    } else {
      masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
      btn.classList.remove('is-on');
      if (textEl) textEl.textContent = 'SOUND OFF';
    }
  }

  function update(time) {
    if (!UR.state.sound || !ctx || !nodes.length) return;

    const { sx, sy } = UR.state.mouse;

    nodes.forEach((node, i) => {
      if (node.isNoise) {
        node.filter.frequency.setValueAtTime(
          120 + Math.abs(sy) * 80 + Math.sin(time * 0.3) * 30,
          ctx.currentTime
        );
      } else {
        node.osc.frequency.setValueAtTime(
          node.baseFreq + sx * 3 + UR.state.scroll * 10 + Math.sin(time * 0.2 + i) * 2,
          ctx.currentTime
        );
        node.filter.frequency.setValueAtTime(
          250 + sy * 120 + Math.sin(time * 0.4 + i * 0.5) * 60,
          ctx.currentTime
        );
      }
    });
  }

  return { init, toggle, update };
})();