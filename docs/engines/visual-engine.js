const VEGAVisualEngine = (function() {
  let canvas = null;
  let ctx = null;
  let animationFrame = null;
  let isRunning = false;
  let particles = [];
  let orbRadius = 50;
  let orbPulse = 0;
  let currentState = 'VOID';
  let audioData = { average: 0, peak: 0, frequencies: [] };

  const STATE_COLORS = {
    VOID: { primary: '#1a1a2e', secondary: '#16213e', glow: '#333366' },
    ENTRY: { primary: '#16213e', secondary: '#0f3460', glow: '#4466aa' },
    CALIBRATION: { primary: '#0f3460', secondary: '#00ff88', glow: '#00aa55' },
    RESONANCE: { primary: '#00ff88', secondary: '#00ffff', glow: '#00ffaa' },
    FLOW: { primary: '#00ffff', secondary: '#ffd700', glow: '#88ffff' },
    INTEGRATION: { primary: '#ffd700', secondary: '#ff6b6b', glow: '#ffaa00' }
  };

  function initialize(canvasId) {
    canvas = document.getElementById(canvasId);
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = canvasId;
      canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
      document.body.insertBefore(canvas, document.body.firstChild);
    }
    
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    initParticles();
    return true;
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initParticles(count = 50) {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * (canvas ? canvas.width : 800),
        y: Math.random() * (canvas ? canvas.height : 600),
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.2
      });
    }
  }

  function updateAudioData(data) {
    audioData = data;
  }

  function setState(state) {
    currentState = state;
  }

  function render() {
    if (!ctx || !canvas) return;
    
    const colors = STATE_COLORS[currentState] || STATE_COLORS.VOID;
    const audioFactor = audioData.average / 128;
    
    ctx.fillStyle = 'rgba(10, 10, 20, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    orbPulse += 0.02;
    const dynamicRadius = orbRadius + Math.sin(orbPulse) * 10 + audioFactor * 30;
    
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, dynamicRadius * 2);
    gradient.addColorStop(0, colors.primary + '88');
    gradient.addColorStop(0.5, colors.secondary + '44');
    gradient.addColorStop(1, 'transparent');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, dynamicRadius * 2, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, dynamicRadius, 0, Math.PI * 2);
    ctx.fillStyle = colors.primary;
    ctx.shadowColor = colors.glow;
    ctx.shadowBlur = 20 + audioFactor * 20;
    ctx.fill();
    ctx.shadowBlur = 0;
    
    particles.forEach(p => {
      p.x += p.vx + audioFactor * (Math.random() - 0.5) * 2;
      p.y += p.vy + audioFactor * (Math.random() - 0.5) * 2;
      
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      
      const dx = p.x - centerX;
      const dy = p.y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < dynamicRadius * 3) {
        p.vx += dx / dist * 0.1;
        p.vy += dy / dist * 0.1;
      }
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size + audioFactor * 2, 0, Math.PI * 2);
      ctx.fillStyle = colors.secondary + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();
    });
    
    if (audioData.frequencies.length > 0) {
      const barWidth = canvas.width / audioData.frequencies.length;
      const barHeight = canvas.height * 0.1;
      
      ctx.fillStyle = colors.glow + '33';
      audioData.frequencies.forEach((freq, i) => {
        const height = (freq / 255) * barHeight;
        ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 1, height);
      });
    }
  }

  function start() {
    if (isRunning) return;
    isRunning = true;
    
    function loop() {
      if (!isRunning) return;
      render();
      animationFrame = requestAnimationFrame(loop);
    }
    loop();
  }

  function stop() {
    isRunning = false;
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  }

  function getMetrics() {
    return {
      isRunning,
      particleCount: particles.length,
      currentState,
      orbRadius: Math.round(orbRadius + Math.sin(orbPulse) * 10),
      canvasSize: canvas ? `${canvas.width}x${canvas.height}` : 'none',
      audioReactivity: Math.round(audioData.average)
    };
  }

  return {
    initialize,
    start,
    stop,
    setState,
    updateAudioData,
    getMetrics,
    STATE_COLORS
  };
})();

if (typeof module !== 'undefined') module.exports = VEGAVisualEngine;
