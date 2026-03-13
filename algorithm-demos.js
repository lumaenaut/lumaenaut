/**
 * Algorithm demos for the "The 8 Algorithm Paradigms" blog post.
 * Each demo runs only when its container is present on the page.
 */
(function () {
  "use strict";

  var W = 560;
  var H = 240;
  var bg = "#0d0d0e";
  var fg = "#e8e6e3";
  var acc = "#7aa5b8";
  var hi = "#8DCEA7";

  function getContainer(id) {
    var el = document.getElementById(id);
    return el ? el : null;
  }

  function getCanvas(container) {
    return container ? container.querySelector("canvas") : null;
  }

  function getStats(container) {
    return container ? container.querySelector(".demo-stats") : null;
  }

  function getControls(container) {
    return container ? container.querySelector(".demo-controls") : null;
  }

  // —— 1. Brute force: 3-digit combination lock ———
  (function () {
    var container = getContainer("demo-brute-force");
    var canvas = getCanvas(container);
    if (!canvas || !container) return;
    var ctx = canvas.getContext("2d");
    var target = Math.floor(Math.random() * 1000);
    var current = 0;
    var tries = 0;
    var running = false;
    var unlocked = false;
    var statsEl = getStats(container);
    var controlsEl = getControls(container);
    var stepBtn, runBtn, resetBtn;

    function draw() {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      var digits = String(current).padStart(3, "0");
      ctx.font = "48px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = unlocked ? hi : fg;
      ctx.fillText(digits, W / 2, H / 2);
      if (unlocked) {
        ctx.font = "16px ui-monospace, monospace";
        ctx.fillStyle = acc;
        ctx.fillText("Unlocked!", W / 2, H / 2 + 36);
      }
      if (statsEl) statsEl.textContent = "Tries: " + tries + " | Target: " + String(target).padStart(3, "0");
    }

    function tick() {
      if (unlocked) return;
      tries++;
      if (current === target) {
        unlocked = true;
        if (runBtn) runBtn.disabled = true;
        if (stepBtn) stepBtn.disabled = true;
      } else {
        current++;
      }
      draw();
    }

    function reset() {
      target = Math.floor(Math.random() * 1000);
      current = 0;
      tries = 0;
      unlocked = false;
      if (runBtn) runBtn.disabled = false;
      if (stepBtn) stepBtn.disabled = false;
      draw();
    }

    if (controlsEl) {
      stepBtn = document.createElement("button");
      stepBtn.type = "button";
      stepBtn.textContent = "Try next";
      stepBtn.addEventListener("click", function () {
        if (!unlocked) tick();
      });
      runBtn = document.createElement("button");
      runBtn.type = "button";
      runBtn.textContent = "Run until unlock";
      runBtn.addEventListener("click", function () {
        if (running || unlocked) return;
        running = true;
        runBtn.disabled = true;
        var id = setInterval(function () {
          tick();
          if (unlocked) {
            clearInterval(id);
            running = false;
            runBtn.disabled = false;
          }
        }, 8);
      });
      resetBtn = document.createElement("button");
      resetBtn.type = "button";
      resetBtn.textContent = "Reset";
      resetBtn.addEventListener("click", reset);
      controlsEl.appendChild(stepBtn);
      controlsEl.appendChild(runBtn);
      controlsEl.appendChild(resetBtn);
    }
    draw();
  })();

  // —— 2. Divide and conquer: merge sort step-by-step ———
  (function () {
    var container = getContainer("demo-divide-conquer");
    var canvas = getCanvas(container);
    if (!canvas || !container) return;
    var ctx = canvas.getContext("2d");
    var arr = [4, 2, 8, 3, 1, 9, 5, 7, 6];
    var steps = [];
    var stepIndex = 0;
    var animating = false;
    var controlsEl = getControls(container);
    var statsEl = getStats(container);

    function mergeTwo(sortedLeft, sortedRight) {
      var out = [];
      var i = 0, j = 0;
      while (i < sortedLeft.length && j < sortedRight.length) {
        if (sortedLeft[i] <= sortedRight[j]) out.push(sortedLeft[i++]);
        else out.push(sortedRight[j++]);
      }
      return out.concat(sortedLeft.slice(i)).concat(sortedRight.slice(j));
    }

    function buildSteps() {
      steps = [];
      var a = arr.slice();
      function rec(start, end) {
        if (end - start <= 1) return;
        var mid = Math.floor((start + end) / 2);
        steps.push({ type: "divide", start: start, mid: mid, end: end, array: a.slice() });
        rec(start, mid);
        rec(mid, end);
        var left = a.slice(start, mid);
        var right = a.slice(mid, end);
        var merged = mergeTwo(left, right);
        var prefix = a.slice(0, start);
        var suffix = a.slice(end);
        var leftIdx = 0;
        var rightIdx = 0;
        for (var i = 0; i < merged.length; i++) {
          a[start + i] = merged[i];
          if (leftIdx < left.length && (rightIdx >= right.length || left[leftIdx] <= right[rightIdx])) {
            leftIdx++;
          } else {
            rightIdx++;
          }
          steps.push({
            type: "merge",
            start: start,
            end: end,
            mergedSoFar: merged.slice(0, i + 1),
            leftRemaining: left.slice(leftIdx),
            rightRemaining: right.slice(rightIdx),
            prefix: prefix.slice(),
            suffix: suffix.slice()
          });
        }
      }
      rec(0, a.length);
    }

    function drawStep() {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      var step = stepIndex === 0 ? null : steps[stepIndex - 1];
      var a;
      var n = arr.length;
      var barW = (W - (n + 1) * 4) / n;
      var pad = 4;

      if (step && step.type === "merge" && step.mergedSoFar) {
        a = step.prefix.concat(
          step.mergedSoFar,
          step.leftRemaining,
          step.rightRemaining
        ).concat(step.suffix);
      } else {
        a = step ? step.array : arr;
      }

      for (var i = 0; i < n; i++) {
        var x = pad + i * (barW + pad);
        var h = (a[i] / 10) * (H - 50);
        var y = H - 30 - h;
        if (step && step.type === "divide") {
          if (i < step.mid) ctx.fillStyle = "#7aa5b8";
          else ctx.fillStyle = "#8DCEA7";
        } else if (step && step.type === "merge") {
          var segStart = step.start;
          var mergedLen = step.mergedSoFar.length;
          var leftLen = step.leftRemaining.length;
          if (i >= segStart && i < segStart + mergedLen) {
            ctx.fillStyle = hi;
          } else if (i >= segStart + mergedLen && i < segStart + mergedLen + leftLen) {
            ctx.fillStyle = "#7aa5b8";
          } else if (i >= segStart + mergedLen + leftLen && i < step.end) {
            ctx.fillStyle = "#8DCEA7";
          } else {
            ctx.fillStyle = fg;
          }
        } else {
          ctx.fillStyle = fg;
        }
        ctx.fillRect(x, y, barW, h);
      }

      if (step && step.type === "merge" && step.mergedSoFar && step.mergedSoFar.length < (step.end - step.start)) {
        var mergedLen = step.mergedSoFar.length;
        var splitX = pad + (step.start + mergedLen) * (barW + pad) - 2;
        ctx.strokeStyle = "rgba(232, 230, 227, 0.8)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(splitX, 10);
        ctx.lineTo(splitX, H - 25);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      if (step && step.type === "divide") {
        var splitX = pad + step.mid * (barW + pad) - 2;
        ctx.strokeStyle = "#e8e6e3";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(splitX, 10);
        ctx.lineTo(splitX, H - 25);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.fillStyle = "#a8a6a2";
      ctx.font = "12px ui-monospace, monospace";
      ctx.textAlign = "left";
      var label = step
        ? (step.type === "divide"
          ? "Divide: split segment in half"
          : "Conquer: merge sorted halves")
        : "Initial array";
      ctx.fillText(label, 8, 12);

      if (statsEl) {
        statsEl.textContent = "Step " + (stepIndex + 1) + " of " + (steps.length + 1);
      }
    }

    function canStepForward() {
      return stepIndex < steps.length;
    }

    function updateButtons() {
      if (!controlsEl) return;
      var prevBtn = controlsEl.querySelector("[data-dc-prev]");
      var nextBtn = controlsEl.querySelector("[data-dc-next]");
      var runBtn = controlsEl.querySelector("[data-dc-run]");
      if (prevBtn) prevBtn.disabled = stepIndex === 0;
      if (nextBtn) nextBtn.disabled = !canStepForward();
      if (runBtn) runBtn.disabled = !canStepForward();
    }

    function stepForward() {
      if (stepIndex < steps.length) {
        stepIndex++;
        drawStep();
        updateButtons();
      }
    }

    function stepBack() {
      if (stepIndex > 0) {
        stepIndex--;
        drawStep();
        updateButtons();
      }
    }

    function runAll() {
      if (animating || !canStepForward()) return;
      animating = true;
      var runBtn = controlsEl ? controlsEl.querySelector("[data-dc-run]") : null;
      if (runBtn) runBtn.disabled = true;
      var id = setInterval(function () {
        if (stepIndex < steps.length) {
          stepIndex++;
          drawStep();
        } else {
          clearInterval(id);
          animating = false;
          updateButtons();
        }
      }, 400);
    }

    function shuffle() {
      for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = arr[i];
        arr[i] = arr[j];
        arr[j] = t;
      }
      stepIndex = 0;
      buildSteps();
      drawStep();
      updateButtons();
    }

    if (controlsEl) {
      var prevBtn = document.createElement("button");
      prevBtn.type = "button";
      prevBtn.textContent = "Previous";
      prevBtn.setAttribute("data-dc-prev", "");
      prevBtn.addEventListener("click", stepBack);
      var nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.textContent = "Next step";
      nextBtn.setAttribute("data-dc-next", "");
      nextBtn.addEventListener("click", stepForward);
      var runBtn = document.createElement("button");
      runBtn.type = "button";
      runBtn.textContent = "Run all";
      runBtn.setAttribute("data-dc-run", "");
      runBtn.addEventListener("click", runAll);
      var shuffleBtn = document.createElement("button");
      shuffleBtn.type = "button";
      shuffleBtn.textContent = "Shuffle";
      shuffleBtn.addEventListener("click", shuffle);
      controlsEl.appendChild(prevBtn);
      controlsEl.appendChild(nextBtn);
      controlsEl.appendChild(runBtn);
      controlsEl.appendChild(shuffleBtn);
    }

    buildSteps();
    drawStep();
    updateButtons();
  })();

  // —— 3. Dynamic programming: Fibonacci with memo (f(0)..f(10), step-by-step) ———
  (function () {
    var container = getContainer("demo-dp");
    var canvas = getCanvas(container);
    if (!canvas || !container) return;
    var ctx = canvas.getContext("2d");
    var memo = {};
    var currentN = 2;           // we focus the sequence on fib(2)..fib(10)
    var arrowAt = null;         // indices with arrows
    var sumRowIndex = null;     // row where the sum text is shown (bottom arrow)
    var sumText = null;         // e.g. \"1 + 1 = 2\"
    var controlsEl = getControls(container);
    var statsEl = getStats(container);
    var animating = false;
    var runAllId = null;

    function ensureMemoUpTo(k) {
      memo[0] = 0;
      memo[1] = 1;
      for (var i = 2; i <= k; i++) {
        if (memo[i] === undefined) memo[i] = memo[i - 1] + memo[i - 2];
      }
    }

    function draw() {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      ctx.font = "14px ui-monospace, monospace";
      var y = 24;
      ctx.fillText("Memo (n → fib(n)):", 12, y);
      y += 22;
      for (var i = 0; i <= 10; i++) {
        var val = memo[i];
        var isFilled = val !== undefined;
        var isArrow = arrowAt && arrowAt.indexOf(i) !== -1;
        ctx.fillStyle = isArrow ? hi : (isFilled ? acc : fg);
        var text = "fib(" + i + ") = " + (isFilled ? String(val) : "—");
        var rowY = y + i * 18;
        ctx.fillText(text, 20, rowY);
        var arrowX = 20 + ctx.measureText(text).width + 4;
        if (isArrow) {
          ctx.fillStyle = hi;
          ctx.fillText(" ←", arrowX, rowY);
        }
        if (sumRowIndex === i && sumText) {
          ctx.fillStyle = "#a8a6a2";
          ctx.font = "12px ui-monospace, monospace";
          ctx.fillText("  " + sumText, arrowX + 18, rowY);
          ctx.font = "14px ui-monospace, monospace";
        }
      }
      if (statsEl) {
        ctx.font = "14px ui-monospace, monospace";
        statsEl.textContent = "fib(" + currentN + ") = " +
          (memo[currentN] !== undefined ? memo[currentN] : "—");
      }
    }

    function updateDpButtons() {
      if (!controlsEl) return;
      var prevBtn = controlsEl.querySelector("[data-dp-prev]");
      var nextBtn = controlsEl.querySelector("[data-dp-next]");
      var runBtn = controlsEl.querySelector("[data-dp-run]");
      // user should not be able to step back from fib(2)
      if (prevBtn) prevBtn.disabled = currentN <= 2;
      if (nextBtn) nextBtn.disabled = currentN >= 10;
      if (runBtn) runBtn.disabled = animating;
    }

    function nextStep() {
      if (currentN >= 10) return;
      // From any n, move to n+1 using fib(n+1) = fib(n-1) + fib(n)
      var k = currentN;
      if (k < 2) k = 2; // ensure we always show the classic DP recurrence from f(2) upwards
      ensureMemoUpTo(k + 1);
      arrowAt = [k - 1, k];
      sumRowIndex = k; // bottom arrow row
      sumText = memo[k - 1] + " + " + memo[k] + " = " + memo[k + 1];
      currentN = k + 1;
      draw();
      updateDpButtons();
    }

    function prevStep() {
      // Do not step back past fib(2); we always want 0,1,2 visible as the base.
      if (currentN <= 2) return;
      var oldN = currentN;
      currentN = oldN - 1;

      // Delete the result where we were (oldN) and all subsequent results.
      for (var i = oldN; i <= 10; i++) {
        if (memo[i] !== undefined) {
          delete memo[i];
        }
      }

      // Move both arrows and the sum one step up: show how we'd recompute fib(currentN)
      // using fib(currentN-1) and fib(currentN-2).
      arrowAt = [currentN - 2, currentN - 1];
      sumRowIndex = currentN - 1;
      sumText = memo[currentN - 2] + " + " + memo[currentN - 1] +
        " = " + (memo[currentN] !== undefined ? memo[currentN] : memo[currentN - 2] + memo[currentN - 1]);

      draw();
      updateDpButtons();
    }

    function runAll() {
      if (animating) {
        return;
      }
      // If we've already reached fib(10), restart from the fib(2) view and run again.
      if (currentN >= 10) {
        memo = {};
        ensureMemoUpTo(2);
        currentN = 2;
        arrowAt = [0, 1];
        sumRowIndex = 1;
        sumText = memo[0] + " + " + memo[1] + " = " + memo[2];
        draw();
      }
      animating = true;
      updateDpButtons();
      runAllId = setInterval(function () {
        if (currentN >= 10) {
          clearInterval(runAllId);
          runAllId = null;
          animating = false;
          updateDpButtons();
          return;
        }
        nextStep();
      }, 500);
    }

    if (controlsEl) {
      var prevBtn = document.createElement("button");
      prevBtn.type = "button";
      prevBtn.textContent = "Previous";
      prevBtn.setAttribute("data-dp-prev", "");
      prevBtn.addEventListener("click", prevStep);
      var nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.textContent = "Next step";
      nextBtn.setAttribute("data-dp-next", "");
      nextBtn.addEventListener("click", nextStep);
      var runBtn = document.createElement("button");
      runBtn.type = "button";
      runBtn.textContent = "Run all";
      runBtn.setAttribute("data-dp-run", "");
      runBtn.addEventListener("click", runAll);
      controlsEl.appendChild(prevBtn);
      controlsEl.appendChild(nextBtn);
      controlsEl.appendChild(runBtn);
    }

    // Initial view: show fib(0), fib(1), and fib(2), with arrows on 0 and 1,
    // and the sum 0 + 1 = 1 next to the bottom arrow row.
    ensureMemoUpTo(2);
    arrowAt = [0, 1];
    sumRowIndex = 1;
    sumText = memo[0] + " + " + memo[1] + " = " + memo[2];
    draw();
    updateDpButtons();
  })();

  // —— 4. Greedy: coin change ———
  (function () {
    var container = getContainer("demo-greedy");
    var canvas = getCanvas(container);
    if (!canvas || !container) return;
    var ctx = canvas.getContext("2d");
    var coins = [25, 10, 5, 1];
    var amount = 37;
    var chosen = [];
    var controlsEl = getControls(container);
    var statsEl = getStats(container);
    var inputEl;

    function draw() {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      ctx.font = "14px ui-monospace, monospace";
      ctx.fillStyle = fg;
      ctx.fillText("Amount: " + amount + "¢  →  Coins (greedy): " + (chosen.length ? chosen.join(", ") : "—"), 12, 28);
      var x = 20;
      for (var i = 0; i < chosen.length; i++) {
        ctx.fillStyle = acc;
        ctx.fillRect(x, 50, 28, 28);
        ctx.fillStyle = bg;
        ctx.textAlign = "center";
        ctx.fillText(chosen[i], x + 14, 68);
        ctx.textAlign = "left";
        x += 34;
      }
      if (statsEl) statsEl.textContent = "Count: " + chosen.length + " coins";
    }

    function run() {
      var a = inputEl ? parseInt(inputEl.value, 10) : amount;
      if (isNaN(a) || a < 0) a = 37;
      amount = a;
      chosen = [];
      var rest = amount;
      for (var c = 0; c < coins.length; c++) {
        while (rest >= coins[c]) {
          chosen.push(coins[c]);
          rest -= coins[c];
        }
      }
      draw();
    }

    if (controlsEl) {
      inputEl = document.createElement("input");
      inputEl.type = "number";
      inputEl.min = 1;
      inputEl.max = 99;
      inputEl.value = "37";
      inputEl.setAttribute("aria-label", "Amount in cents");
      var goBtn = document.createElement("button");
      goBtn.type = "button";
      goBtn.textContent = "Greedy coin change";
      goBtn.addEventListener("click", run);
      controlsEl.appendChild(inputEl);
      controlsEl.appendChild(goBtn);
    }
    run();
  })();

  // —— 5. Backtracking: animated maze (preplanned wrong turn + correct path) ———
  (function () {
    var container = getContainer("demo-backtrack");
    var canvas = getCanvas(container);
    if (!canvas || !container) return;
    var ctx = canvas.getContext("2d");

    var start = { r: 0, c: 0 };
    var goals = [{ r: 0, c: 4 }, { r: 4, c: 0 }, { r: 4, c: 4 }];

    function p(r, c) { return { r: r, c: c }; }

    // Each maze: grid (5x5, 0=open 1=wall) + for each goal the wrong path (must end at a dead end:
    // last cell has no open neighbor except the one we came from) and correct path.
    var mazeConfigs = [
      {
        grid: [
          [0, 0, 0, 1, 0],
          [0, 1, 1, 1, 0],
          [0, 0, 0, 0, 0],
          [1, 1, 1, 1, 0],
          [0, 0, 0, 0, 0]
        ],
        paths: {
          "0,4": { wrong: [p(0,0), p(1,0), p(2,0), p(2,1), p(2,2), p(2,3), p(2,4), p(3,4), p(4,4), p(4,3), p(4,2), p(4,1), p(4,0)], correct: [p(0,0), p(1,0), p(2,0), p(2,1), p(2,2), p(2,3), p(2,4), p(1,4), p(0,4)] },
          "4,0": { wrong: [p(0,0), p(1,0), p(2,0), p(2,1), p(2,2), p(2,3), p(2,4), p(1,4), p(0,4)], correct: [p(0,0), p(1,0), p(2,0), p(2,1), p(2,2), p(2,3), p(2,4), p(3,4), p(4,4), p(4,3), p(4,2), p(4,1), p(4,0)] },
          "4,4": { wrong: [p(0,0), p(0,1), p(0,2)], correct: [p(0,0), p(1,0), p(2,0), p(2,1), p(2,2), p(2,3), p(2,4), p(3,4), p(4,4)] }
        }
      },
      {
        grid: [
          [0, 0, 1, 0, 0],
          [0, 1, 1, 1, 0],
          [0, 0, 0, 0, 0],
          [0, 1, 1, 1, 0],
          [0, 0, 0, 0, 0]
        ],
        paths: {
          "0,4": { wrong: [p(0,0), p(0,1)], correct: [p(0,0), p(1,0), p(2,0), p(2,1), p(2,2), p(2,3), p(2,4), p(1,4), p(0,4)] },
          "4,0": { wrong: [p(0,0), p(0,1)], correct: [p(0,0), p(1,0), p(2,0), p(3,0), p(4,0)] },
          "4,4": { wrong: [p(0,0), p(0,1)], correct: [p(0,0), p(1,0), p(2,0), p(3,0), p(4,0), p(4,1), p(4,2), p(4,3), p(4,4)] }
        }
      },
      {
        grid: [
          [0, 0, 1, 0, 0],
          [0, 1, 1, 1, 0],
          [0, 0, 0, 0, 0],
          [0, 1, 1, 1, 0],
          [0, 0, 0, 0, 0]
        ],
        paths: {
          "0,4": { wrong: [p(0,0), p(0,1)], correct: [p(0,0), p(1,0), p(2,0), p(2,1), p(2,2), p(2,3), p(2,4), p(1,4), p(0,4)] },
          "4,0": { wrong: [p(0,0), p(0,1)], correct: [p(0,0), p(1,0), p(2,0), p(3,0), p(4,0)] },
          "4,4": { wrong: [p(0,0), p(0,1)], correct: [p(0,0), p(1,0), p(2,0), p(2,1), p(2,2), p(2,3), p(2,4), p(3,4), p(4,4)] }
        }
      },
      {
        grid: [
          [0, 1, 0, 0, 0],
          [0, 1, 0, 1, 0],
          [0, 0, 0, 1, 0],
          [1, 1, 0, 1, 0],
          [0, 0, 0, 0, 0]
        ],
        paths: {
          "0,4": { wrong: [p(0,0), p(1,0), p(2,0), p(2,1), p(2,2), p(3,2), p(4,2), p(4,1), p(4,0)], correct: [p(0,0), p(1,0), p(2,0), p(2,1), p(2,2), p(1,2), p(0,2), p(0,3), p(0,4)] },
          "4,0": { wrong: [p(0,0), p(1,0), p(2,0), p(2,1), p(2,2), p(1,2), p(0,2), p(0,3), p(0,4)], correct: [p(0,0), p(1,0), p(2,0), p(2,1), p(2,2), p(3,2), p(4,2), p(4,1), p(4,0)] },
          "4,4": { wrong: [p(0,0), p(1,0), p(2,0), p(2,1), p(2,2), p(1,2), p(0,2), p(0,3), p(0,4)], correct: [p(0,0), p(1,0), p(2,0), p(2,1), p(2,2), p(3,2), p(4,2), p(4,3), p(4,4)] }
        }
      }
    ];

    var grid = mazeConfigs[0].grid.map(function (row) { return row.slice(); });
    var end = { r: 4, c: 4 };
    var currentMazeIndex = 0;
    var currentGoalKey = "4,4";
    var cellW = Math.min(60, (W - 20) / 5);
    var cellH = Math.min(48, (H - 20) / 5);
    var ox = (W - 5 * cellW) / 2;
    var oy = (H - 5 * cellH) / 2;
    var controlsEl = getControls(container);

    var steps = [];
    var stepIndex = 0;
    var animId = null;
    var running = false;

    function drawPath(path) {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      for (var r = 0; r < 5; r++) {
        for (var c = 0; c < 5; c++) {
          var x = ox + c * cellW;
          var y = oy + r * cellH;
          if (grid[r][c] === 1) {
            ctx.fillStyle = "#444";
            ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);
          } else {
            var onPath = path && path.some(function (p) { return p.r === r && p.c === c; });
            var isCurrent = path && path.length && path[path.length - 1].r === r && path[path.length - 1].c === c;
            ctx.fillStyle = isCurrent ? hi : (onPath ? acc : "#1a1a1c");
            ctx.strokeStyle = "#333";
            ctx.strokeRect(x, y, cellW, cellH);
            ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);
          }
        }
      }
      ctx.fillStyle = hi;
      ctx.fillRect(ox + start.c * cellW + 4, oy + start.r * cellH + 4, cellW - 8, cellH - 8);
      ctx.fillStyle = "#c4a574";
      ctx.fillRect(ox + end.c * cellW + 4, oy + end.r * cellH + 4, cellW - 8, cellH - 8);
    }

    function buildStepsFromPreplanned() {
      var config = mazeConfigs[currentMazeIndex];
      var pathData = config.paths[currentGoalKey];
      if (!pathData) return;
      steps = [];
      var wrong = pathData.wrong;
      var correct = pathData.correct;
      var path = [];

      // Walk the wrong path first.
      for (var i = 0; i < wrong.length; i++) {
        path.push(wrong[i]);
        steps.push(path.slice());
      }

      // Find the longest common prefix between wrong and correct
      // so we only backtrack to the actual decision point, not
      // necessarily all the way to the start.
      var forkIndex = 0;
      var minLen = Math.min(wrong.length, correct.length);
      for (var t = 0; t < minLen; t++) {
        if (wrong[t].r === correct[t].r && wrong[t].c === correct[t].c) {
          forkIndex = t + 1;
        } else {
          break;
        }
      }

      // Backtrack from the end of the wrong path to the fork.
      for (var j = wrong.length - 1; j >= forkIndex; j--) {
        path.pop();
        steps.push(path.slice());
      }

      // Continue along the correct path from the fork.
      // 'path' already contains correct[0..forkIndex-1].
      for (var k = forkIndex; k < correct.length; k++) {
        // Avoid duplicating the last element already in path.
        if (!path.length ||
            path[path.length - 1].r !== correct[k].r ||
            path[path.length - 1].c !== correct[k].c) {
          path.push(correct[k]);
        }
        steps.push(path.slice());
      }
    }

    function stopAnimation() {
      if (animId !== null) {
        clearInterval(animId);
        animId = null;
      }
      running = false;
    }

    function shuffle() {
      if (running) return;
      currentMazeIndex = Math.floor(Math.random() * mazeConfigs.length);
      var goalIdx = Math.floor(Math.random() * goals.length);
      end = { r: goals[goalIdx].r, c: goals[goalIdx].c };
      currentGoalKey = end.r + "," + end.c;
      grid = mazeConfigs[currentMazeIndex].grid.map(function (row) { return row.slice(); });
      steps = [];
      stepIndex = 0;
      drawPath([]);
    }

    function solveAnimated() {
      if (running) return;
      stepIndex = 0;
      buildStepsFromPreplanned();
      if (!steps.length) {
        drawPath([]);
        return;
      }
      running = true;
      animId = setInterval(function () {
        if (stepIndex >= steps.length) {
          stopAnimation();
          return;
        }
        drawPath(steps[stepIndex]);
        stepIndex++;
      }, 260);
    }

    if (controlsEl) {
      var shuffleBtn = document.createElement("button");
      shuffleBtn.type = "button";
      shuffleBtn.textContent = "Shuffle";
      shuffleBtn.addEventListener("click", shuffle);
      var solveBtn = document.createElement("button");
      solveBtn.type = "button";
      solveBtn.textContent = "Solve";
      solveBtn.addEventListener("click", solveAnimated);
      controlsEl.appendChild(shuffleBtn);
      controlsEl.appendChild(solveBtn);
    }

    drawPath([]);
  })();

  // —— 6. Searching: binary search on a 10×4 matrix ———
  (function () {
    var container = getContainer("demo-search");
    var canvas = getCanvas(container);
    if (!canvas || !container) return;
    var ctx = canvas.getContext("2d");

    var cols = 10;
    var rows = 4;
    var total = cols * rows;
    var arr = [];
    for (var i = 0; i < total; i++) {
      arr.push(i + 1);
    }

    var targetIndex = -1;
    var targetValue = null;
    var lo = null;
    var hi = null;
    var mid = null;
    var steps = 0;
    var done = false;
    var foundIndex = -1;
    var animating = false;
    // Two-phase animation: "mid" = showing current number; "discard" = showing discarded (red) vs kept (yellow) half
    var phase = "mid";
    var discardLeft = false; // true = we're discarding left half [lo..mid]
    var subStep = 0; // 0 = show mid, 1 = show discard, 2 = apply and move to next

    var colorConsidering = "#f3e08a";    // yellow — still in range
    var colorCurrent = "#8DCEA7";        // green — current number / found
    var colorDiscarded = "#4a272f";      // soft red — discarded
    var colorBase = "#ffffff";           // white — initial background
    var colorTarget = "#4a7abf";         // blue — chosen target (until found)

    var controlsEl = getControls(container);
    var statsEl = getStats(container);
    var messageEl;

    function resetSearch() {
      lo = null;
      hi = null;
      mid = null;
      steps = 0;
      done = false;
      foundIndex = -1;
      animating = false;
      phase = "mid";
      discardLeft = false;
      subStep = 0;
    }

    function draw() {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      var marginX = 16;
      var marginY = 24;
      var gapX = 4;
      var gapY = 4;
      var cellW = (W - marginX * 2 - gapX * (cols - 1)) / cols;
      var cellH = (H - marginY * 2 - 60 - gapY * (rows - 1)) / rows;

      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          var idx = r * cols + c;
          var x = marginX + c * (cellW + gapX);
          var y = marginY + r * (cellH + gapY);

          var cellColor = colorBase;

          // Final frame: found -> one green, rest red
          if (done && foundIndex >= 0) {
            cellColor = (idx === foundIndex) ? colorCurrent : colorDiscarded;
          } else if (lo !== null && hi !== null) {
            if (phase === "mid") {
              if (idx < lo || idx > hi) cellColor = colorDiscarded;
              else if (mid !== null && idx === mid) cellColor = colorCurrent;
              else cellColor = colorConsidering;
            } else {
              // phase === "discard": discarded half = red, kept half = yellow
              if (discardLeft) {
                if (idx >= lo && idx <= mid) cellColor = colorDiscarded;
                else if (idx > mid && idx <= hi) cellColor = colorConsidering;
                else if (idx < lo || idx > hi) cellColor = colorDiscarded;
                else cellColor = colorConsidering;
              } else {
                if (idx >= mid && idx <= hi) cellColor = colorDiscarded;
                else if (idx >= lo && idx < mid) cellColor = colorConsidering;
                else if (idx < lo || idx > hi) cellColor = colorDiscarded;
                else cellColor = colorConsidering;
              }
            }
          }

          // Highlight the chosen target (blue) until it is found
          if (!done && targetIndex >= 0 && idx === targetIndex) {
            cellColor = colorTarget;
          }

          ctx.fillStyle = cellColor;
          ctx.fillRect(x, y, cellW, cellH);

          var textColor;
          if (cellColor === colorDiscarded) textColor = "#e0d4d4";
          else textColor = "#111111";
          ctx.fillStyle = textColor;
          ctx.font = "14px ui-monospace, monospace";
          ctx.textAlign = "center";
          ctx.fillText(String(arr[idx]), x + cellW / 2, y + cellH / 2 + 5);
          ctx.textAlign = "left";
        }
      }

      ctx.fillStyle = fg;
      ctx.font = "12px ui-monospace, monospace";
      var targetLabel = targetIndex >= 0 ? (targetValue + " (index " + targetIndex + ")") : "—";
      ctx.fillText("Target: " + targetLabel + "  ·  Binary search on sorted matrix (row-major)", 12, H - 18);

      if (statsEl) {
        if (steps === 0 || lo === null || hi === null) {
          statsEl.textContent = "Steps: —";
        } else if (done && foundIndex >= 0) {
          statsEl.textContent = "Steps: " + steps + " (found at index " + foundIndex + ")";
        } else if (done) {
          statsEl.textContent = "Steps: " + steps + " (not in array)";
        } else {
          statsEl.textContent = "Steps: " + steps + "  ·  Range: [" + lo + ".." + hi + "]";
        }
      }

      if (messageEl) {
        if (targetIndex < 0) {
          messageEl.textContent = "Click \"Set random target\" to pick a value from the matrix, then \"Run search\" to watch binary search shrink the range.";
        } else if (lo === null || hi === null) {
          messageEl.textContent = "Target is " + targetValue + ". Click \"Run search\" to start binary search over all 40 cells.";
        } else if (done) {
          if (foundIndex >= 0) {
            messageEl.textContent = "Found " + targetValue + " at index " + foundIndex + " after " + steps + " steps. Red = discarded, green = found.";
          } else {
            messageEl.textContent = "Search range is empty — target " + targetValue + " is not in this sorted matrix.";
          }
        } else if (phase === "discard") {
          messageEl.textContent = "Red = half we discard. Green = half we keep. Next: move to the middle of the green half.";
        } else if (mid !== null) {
          var currentVal = arr[mid];
          var msg = "Step " + steps + ": consider middle index " + mid + " (value " + currentVal + "). ";
          if (currentVal === targetValue) {
            msg += "Match!";
          } else if (currentVal < targetValue) {
            msg += currentVal + " < " + targetValue + " → next we discard the left half (red) and keep the right (green).";
          } else {
            msg += currentVal + " > " + targetValue + " → next we discard the right half (red) and keep the left (green).";
          }
          messageEl.textContent = msg;
        } else {
          messageEl.textContent = "Yellow = still considering. Green = current number. Red = already discarded.";
        }
      }
    }

    function setRandomTarget() {
      var idx = Math.floor(Math.random() * arr.length);
      targetIndex = idx;
      targetValue = arr[idx];
      resetSearch();
      draw();
    }

    function runSearch() {
      if (animating) return;
      if (targetIndex < 0) {
        setRandomTarget();
      }
      resetSearch();
      lo = 0;
      hi = arr.length - 1;
      subStep = 0;
      phase = "mid";
      animating = true;

      function step() {
        if (!animating) return;
        if (lo > hi) {
          done = true;
          mid = null;
          foundIndex = -1;
          animating = false;
          draw();
          return;
        }
        if (subStep === 0) {
          mid = Math.floor((lo + hi) / 2);
          steps++;
          phase = "mid";
          draw();
          subStep = 1;
          setTimeout(step, 550);
          return;
        }
        if (subStep === 1) {
          var v = arr[mid];
          if (v === targetValue) {
            foundIndex = mid;
            done = true;
            animating = false;
            draw();
            return;
          }
          phase = "discard";
          discardLeft = (v < targetValue);
          draw();
          subStep = 2;
          setTimeout(step, 550);
          return;
        }
        if (subStep === 2) {
          if (discardLeft) {
            lo = mid + 1;
          } else {
            hi = mid - 1;
          }
          mid = null;
          phase = "mid";
          subStep = 0;
          setTimeout(step, 400);
        }
      }

      step();
    }

    if (container) {
      messageEl = document.createElement("p");
      messageEl.className = "demo-message";
      messageEl.setAttribute("aria-live", "polite");
      messageEl.style.marginTop = "8px";
      messageEl.style.marginBottom = "8px";
      messageEl.style.fontSize = "13px";
      messageEl.style.color = "var(--text-muted, #888)";
      messageEl.style.minHeight = "2.5em";
      var canvasWrap = container.querySelector(".demo-canvas-wrap");
      if (canvasWrap && canvasWrap.parentNode) {
        canvasWrap.parentNode.insertBefore(messageEl, canvasWrap.nextSibling);
      } else {
        var ctrl = container.querySelector(".demo-controls");
        if (ctrl) container.insertBefore(messageEl, ctrl);
        else container.appendChild(messageEl);
      }
    }

    if (controlsEl) {
      var randomBtn = document.createElement("button");
      randomBtn.type = "button";
      randomBtn.textContent = "Set random target";
      randomBtn.addEventListener("click", setRandomTarget);

      var runBtn = document.createElement("button");
      runBtn.type = "button";
      runBtn.textContent = "Run search";
      runBtn.addEventListener("click", runSearch);

      controlsEl.appendChild(randomBtn);
      controlsEl.appendChild(runBtn);
    }

    draw();
  })();

  // —— 7. Sorting: bubble sort bars ———
  (function () {
    var container = getContainer("demo-sort");
    var canvas = getCanvas(container);
    if (!canvas || !container) return;
    var ctx = canvas.getContext("2d");
    var arr = [4, 2, 8, 3, 1, 9, 5, 7, 6];
    var animating = false;
    var controlsEl = getControls(container);

    function drawBars(highlight) {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      var n = arr.length;
      var barW = (W - (n + 1) * 4) / n;
      for (var i = 0; i < n; i++) {
        ctx.fillStyle = (highlight && (i === highlight[0] || i === highlight[1])) ? acc : fg;
        var h = (arr[i] / 10) * (H - 30);
        ctx.fillRect(4 + i * (barW + 4), H - 20 - h, barW, h);
      }
    }

    function shuffle() {
      for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = arr[i];
        arr[i] = arr[j];
        arr[j] = t;
      }
      drawBars();
    }

    function bubbleSort() {
      if (animating) return;
      animating = true;
      var i = 0, j = 0;
      function step() {
        if (i >= arr.length - 1) {
          drawBars();
          animating = false;
          return;
        }
        if (j >= arr.length - 1 - i) {
          j = 0;
          i++;
          step();
          return;
        }
        drawBars([j, j + 1]);
        if (arr[j] > arr[j + 1]) {
          var t = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = t;
        }
        j++;
        setTimeout(step, 80);
      }
      step();
    }

    if (controlsEl) {
      var shuffleBtn = document.createElement("button");
      shuffleBtn.type = "button";
      shuffleBtn.textContent = "Shuffle";
      shuffleBtn.addEventListener("click", shuffle);
      var sortBtn = document.createElement("button");
      sortBtn.type = "button";
      sortBtn.textContent = "Bubble sort";
      sortBtn.addEventListener("click", bubbleSort);
      controlsEl.appendChild(shuffleBtn);
      controlsEl.appendChild(sortBtn);
    }
    drawBars();
  })();

  // —— 8. Hashing: input → hash → bucket ———
  (function () {
    var container = getContainer("demo-hash");
    var canvas = getCanvas(container);
    if (!canvas || !container) return;
    var ctx = canvas.getContext("2d");
    var buckets = [[], [], [], [], []];
    var inputStr = "hello";
    var controlsEl = getControls(container);
    var statsEl = getStats(container);
    var inputEl;

    function hash(s) {
      var h = 0;
      for (var i = 0; i < s.length; i++) {
        h = ((h << 5) - h) + s.charCodeAt(i);
        h = h & 0x7fffffff;
      }
      return h;
    }

    function run() {
      var s = (inputEl && inputEl.value) ? inputEl.value : inputStr;
      if (!s) s = "hello";
      inputStr = s;
      var h = hash(s);
      var idx = h % 5;
      buckets = [[], [], [], [], []];
      buckets[idx].push({ key: s, hash: h });
      draw();
      if (statsEl) statsEl.textContent = "hash(\"" + s + "\") = " + h + " → bucket " + idx;
    }

    function draw() {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      ctx.font = "12px ui-monospace, monospace";
      ctx.fillStyle = fg;
      var bw = (W - 40) / 5;
      for (var i = 0; i < 5; i++) {
        var x = 20 + i * (bw + 4);
        ctx.strokeStyle = "#444";
        ctx.strokeRect(x, 50, bw, 80);
        ctx.fillText("Bucket " + i, x + 4, 68);
        for (var j = 0; j < buckets[i].length; j++) {
          ctx.fillStyle = acc;
          ctx.fillText(buckets[i][j].key + " → " + buckets[i][j].hash, x + 4, 88 + j * 16);
        }
        ctx.fillStyle = fg;
      }
    }

    if (controlsEl) {
      inputEl = document.createElement("input");
      inputEl.type = "text";
      inputEl.placeholder = "key";
      inputEl.value = "hello";
      inputEl.setAttribute("aria-label", "Key to hash");
      var goBtn = document.createElement("button");
      goBtn.type = "button";
      goBtn.textContent = "Hash";
      goBtn.addEventListener("click", run);
      controlsEl.appendChild(inputEl);
      controlsEl.appendChild(goBtn);
    }
    run();
  })();
})();
