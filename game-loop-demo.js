/**
 * Game loop demo: runs only on pages that have #game-loop-canvas (blog post).
 * Animates a bouncing ball using requestAnimationFrame; labels are in English or
 * Spanish based on the document lang attribute. Supports pause and single-step.
 */
(function () {
  var canvas = document.getElementById("game-loop-canvas");
  if (!canvas) return;

  // UI labels from document language (e.g. "es" => Spanish)
  var lang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
  var isEs = lang.indexOf("es") === 0;
  var frameLabel = isEs ? "Cuadro: " : "Frame: ";
  var fpsLabel = "FPS: ";
  var dtLabel = "Δt: ";
  var pauseText = isEs ? "Pausa" : "Pause";
  var resumeText = isEs ? "Reanudar" : "Resume";

  // Canvas context and DOM refs for stats and controls
  var ctx = canvas.getContext("2d");
  var frameEl = document.getElementById("demo-frame");
  var fpsEl = document.getElementById("demo-fps");
  var dtEl = document.getElementById("demo-dt");
  var pauseBtn = document.getElementById("demo-pause");
  var stepBtn = document.getElementById("demo-step");

  // Canvas size, ball state (position, velocity, radius), and frame/time tracking
  var w = 640, h = 360;
  var ball = { x: w * 0.2, y: h / 2, vx: 120, vy: 80, r: 24 };
  var frameCount = 0;
  var lastTime = null;
  var fps = 0;
  var fpsFrames = 0;
  var fpsAccum = 0;
  var paused = false;

  /**
   * Updates ball position using velocity and delta time; bounces off walls.
   * @param {number} dt - Elapsed time in seconds since last update
   */
  function update(dt) {
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    if (ball.x - ball.r < 0) { ball.x = ball.r; ball.vx = -ball.vx; }
    if (ball.x + ball.r > w) { ball.x = w - ball.r; ball.vx = -ball.vx; }
    if (ball.y - ball.r < 0) { ball.y = ball.r; ball.vy = -ball.vy; }
    if (ball.y + ball.r > h) { ball.y = h - ball.r; ball.vy = -ball.vy; }
  }

  /**
   * Draws one frame: dark background, then the ball as a filled circle.
   */
  function render() {
    ctx.fillStyle = "#0d0d0e";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#e8e6e3";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * One tick of the game loop: compute dt, update (if not paused), render,
   * refresh stats in the DOM, and schedule the next frame.
   * @param {number} timestamp - From requestAnimationFrame
   */
  function tick(timestamp) {
    if (!lastTime) lastTime = timestamp;
    var dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    // Clamp large gaps (e.g. tab in background) to avoid big jumps
    if (dt > 0.2) dt = 0.016;

    if (!paused) {
      update(dt);
      frameCount++;
      fpsFrames++;
      fpsAccum += dt;
      // Recompute FPS every half second
      if (fpsAccum >= 0.5) {
        fps = Math.round(fpsFrames / fpsAccum);
        fpsFrames = 0;
        fpsAccum = 0;
      }
    }
    render();

    // Update on-screen stats (frame count, FPS, delta time)
    if (frameEl) frameEl.textContent = frameLabel + frameCount;
    if (fpsEl) fpsEl.textContent = fpsLabel + (paused ? "—" : fps);
    if (dtEl) dtEl.textContent = dtLabel + (paused ? "—" : (dt * 1000).toFixed(2)) + " ms";

    if (stepBtn) stepBtn.disabled = !paused;
    if (pauseBtn) pauseBtn.textContent = paused ? resumeText : pauseText;

    requestAnimationFrame(tick);
  }

  // Pause/resume: toggle paused and reset lastTime when resuming so dt is sane
  if (pauseBtn) {
    pauseBtn.addEventListener("click", function () {
      paused = !paused;
      if (!paused) lastTime = null;
    });
  }

  // Step one frame when paused: run update once with a small dt, then render and refresh stats
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

  // Start the loop
  requestAnimationFrame(tick);
})();
