(function () {
  var canvas = document.getElementById("game-loop-canvas");
  if (!canvas) return;

  var lang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
  var isEs = lang.indexOf("es") === 0;
  var frameLabel = isEs ? "Cuadro: " : "Frame: ";
  var fpsLabel = "FPS: ";
  var dtLabel = "Δt: ";
  var pauseText = isEs ? "Pausa" : "Pause";
  var resumeText = isEs ? "Reanudar" : "Resume";

  var ctx = canvas.getContext("2d");
  var frameEl = document.getElementById("demo-frame");
  var fpsEl = document.getElementById("demo-fps");
  var dtEl = document.getElementById("demo-dt");
  var pauseBtn = document.getElementById("demo-pause");
  var stepBtn = document.getElementById("demo-step");

  var w = 640, h = 360;
  var ball = { x: w * 0.2, y: h / 2, vx: 120, vy: 80, r: 24 };
  var frameCount = 0;
  var lastTime = null;
  var fps = 0;
  var fpsFrames = 0;
  var fpsAccum = 0;
  var paused = false;

  function update(dt) {
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    if (ball.x - ball.r < 0) { ball.x = ball.r; ball.vx = -ball.vx; }
    if (ball.x + ball.r > w) { ball.x = w - ball.r; ball.vx = -ball.vx; }
    if (ball.y - ball.r < 0) { ball.y = ball.r; ball.vy = -ball.vy; }
    if (ball.y + ball.r > h) { ball.y = h - ball.r; ball.vy = -ball.vy; }
  }

  function render() {
    ctx.fillStyle = "#0d0d0e";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#e8e6e3";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
  }

  function tick(timestamp) {
    if (!lastTime) lastTime = timestamp;
    var dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    if (dt > 0.2) dt = 0.016;

    if (!paused) {
      update(dt);
      frameCount++;
      fpsFrames++;
      fpsAccum += dt;
      if (fpsAccum >= 0.5) {
        fps = Math.round(fpsFrames / fpsAccum);
        fpsFrames = 0;
        fpsAccum = 0;
      }
    }
    render();

    if (frameEl) frameEl.textContent = frameLabel + frameCount;
    if (fpsEl) fpsEl.textContent = fpsLabel + (paused ? "—" : fps);
    if (dtEl) dtEl.textContent = dtLabel + (paused ? "—" : (dt * 1000).toFixed(2)) + " ms";

    if (stepBtn) stepBtn.disabled = !paused;
    if (pauseBtn) pauseBtn.textContent = paused ? resumeText : pauseText;

    requestAnimationFrame(tick);
  }

  if (pauseBtn) {
    pauseBtn.addEventListener("click", function () {
      paused = !paused;
      if (!paused) lastTime = null;
    });
  }

  if (stepBtn) {
    stepBtn.addEventListener("click", function () {
      if (!paused) return;
      var t = performance.now();
      if (!lastTime) lastTime = t - 16.67;
      var dt = (t - lastTime) / 1000;
      if (dt > 0.2) dt = 0.016;
      lastTime = t;
      update(dt);
      frameCount++;
      render();
      if (frameEl) frameEl.textContent = frameLabel + frameCount;
      if (fpsEl) fpsEl.textContent = fpsLabel + "—";
      if (dtEl) dtEl.textContent = dtLabel + (dt * 1000).toFixed(2) + " ms";
    });
  }

  requestAnimationFrame(tick);
})();
