const VEGASonicEngine = (function() {
  let audioContext = null;
  let analyser = null;
  let dataArray = null;
  let isPlaying = false;
  let currentOscillator = null;
  let gainNode = null;
  let listeners = [];
  let animationFrame = null;

  const FREQUENCIES = {
    VOID: 55,
    ENTRY: 110,
    CALIBRATION: 220,
    RESONANCE: 432,
    FLOW: 528,
    INTEGRATION: 639
  };

  const WAVEFORMS = {
    VOID: 'sine',
    ENTRY: 'triangle',
    CALIBRATION: 'sine',
    RESONANCE: 'sine',
    FLOW: 'triangle',
    INTEGRATION: 'sine'
  };

  function initialize() {
    if (audioContext) return true;
    
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      gainNode = audioContext.createGain();
      gainNode.gain.value = 0.3;
      gainNode.connect(analyser);
      analyser.connect(audioContext.destination);
      
      return true;
    } catch (e) {
      console.error('Audio initialization failed:', e);
      return false;
    }
  }

  function playDrone(state = 'RESONANCE') {
    if (!audioContext) initialize();
    if (audioContext.state === 'suspended') audioContext.resume();
    
    stopDrone();
    
    currentOscillator = audioContext.createOscillator();
    currentOscillator.type = WAVEFORMS[state] || 'sine';
    currentOscillator.frequency.value = FREQUENCIES[state] || 432;
    
    currentOscillator.connect(gainNode);
    currentOscillator.start();
    isPlaying = true;
    
    startAnalysis();
    return true;
  }

  function stopDrone() {
    if (currentOscillator) {
      try {
        currentOscillator.stop();
        currentOscillator.disconnect();
      } catch (e) {}
      currentOscillator = null;
    }
    isPlaying = false;
    stopAnalysis();
  }

  function setFrequency(freq) {
    if (currentOscillator) {
      currentOscillator.frequency.setTargetAtTime(freq, audioContext.currentTime, 0.1);
    }
  }

  function setVolume(vol) {
    if (gainNode) {
      gainNode.gain.setTargetAtTime(Math.max(0, Math.min(1, vol)), audioContext.currentTime, 0.1);
    }
  }

  function getAnalyzerData() {
    if (!analyser || !dataArray) return { frequencies: [], average: 0, peak: 0 };
    
    analyser.getByteFrequencyData(dataArray);
    const frequencies = Array.from(dataArray);
    const average = frequencies.reduce((a, b) => a + b, 0) / frequencies.length;
    const peak = Math.max(...frequencies);
    
    return { frequencies, average, peak };
  }

  function startAnalysis() {
    if (animationFrame) return;
    
    function analyze() {
      const data = getAnalyzerData();
      listeners.forEach(fn => fn(data));
      animationFrame = requestAnimationFrame(analyze);
    }
    analyze();
  }

  function stopAnalysis() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  }

  function onAnalysis(fn) {
    listeners.push(fn);
    return () => { listeners = listeners.filter(l => l !== fn); };
  }

  function getMetrics() {
    const data = getAnalyzerData();
    return {
      isPlaying,
      frequency: currentOscillator ? currentOscillator.frequency.value : 0,
      volume: gainNode ? gainNode.gain.value : 0,
      averageAmplitude: Math.round(data.average),
      peakAmplitude: data.peak,
      analyzerBins: analyser ? analyser.frequencyBinCount : 0,
      contextState: audioContext ? audioContext.state : 'none'
    };
  }

  function updateForState(state) {
    if (!isPlaying) return;
    
    const freq = FREQUENCIES[state] || 432;
    const waveform = WAVEFORMS[state] || 'sine';
    
    if (currentOscillator) {
      currentOscillator.frequency.setTargetAtTime(freq, audioContext.currentTime, 0.5);
    }
  }

  return {
    initialize,
    playDrone,
    stopDrone,
    setFrequency,
    setVolume,
    getAnalyzerData,
    onAnalysis,
    getMetrics,
    updateForState,
    FREQUENCIES
  };
})();

if (typeof module !== 'undefined') module.exports = VEGASonicEngine;
