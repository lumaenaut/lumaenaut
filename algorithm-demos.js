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
    return document.getElementById(id);
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

  var docLang = (document.documentElement && document.documentElement.getAttribute("lang")) || "en";
  var isEs = (docLang === "es" || docLang.indexOf("es-") === 0);
  var L = {
    tryNext: isEs ? "Siguiente" : "Try next",
    runUntilUnlock: isEs ? "Ejecutar hasta abrir" : "Run until unlock",
    reset: isEs ? "Reiniciar" : "Reset",
    tries: isEs ? "Intentos" : "Tries",
    target: isEs ? "Objetivo" : "Target",
    unlocked: isEs ? "¡Abierto!" : "Unlocked!",
    previous: isEs ? "Anterior" : "Previous",
    nextStep: isEs ? "Siguiente paso" : "Next step",
    runAll: isEs ? "Ejecutar todo" : "Run all",
    shuffle: isEs ? "Mezclar" : "Shuffle",
    stepOf: isEs ? "Paso %1 de %2" : "Step %1 of %2",
    divideLabel: isEs ? "Dividir: partir segmento a la mitad" : "Divide: split segment in half",
    conquerLabel: isEs ? "Vencer: fusionar mitades ordenadas" : "Conquer: merge sorted halves",
    initialArray: isEs ? "Arreglo inicial" : "Initial array",
    countCoins: isEs ? "Cantidad: %1 monedas" : "Count: %1 coins",
    greedyCoinChange: isEs ? "Dar cambio (greedy)" : "Greedy coin change",
    amountCents: isEs ? "Monto en centavos" : "Amount in cents",
    solve: isEs ? "Resolver" : "Solve",
    stepsDash: isEs ? "Pasos: —" : "Steps: —",
    stepsFound: isEs ? "Pasos: %1 (encontrado en índice %2)" : "Steps: %1 (found at index %2)",
    stepsNotInArray: isEs ? "Pasos: %1 (no está en el arreglo)" : "Steps: %1 (not in array)",
    stepsRange: isEs ? "Pasos: %1  ·  Rango: [%2..%3]" : "Steps: %1  ·  Range: [%2..%3]",
    msgSetRandomThenRun: isEs ? "Haz clic en \"Poner objetivo al azar\" y luego \"Ejecutar búsqueda\" para ver cómo se reduce el rango." : "Click \"Set random target\" to pick a value from the matrix, then \"Run search\" to watch binary search shrink the range.",
    msgTargetClickRun: isEs ? "Objetivo: %1. Haz clic en \"Ejecutar búsqueda\" para iniciar." : "Target is %1. Click \"Run search\" to start binary search over all 40 cells.",
    msgFoundAfter: isEs ? "Encontrado %1 en índice %2 después de %3 pasos. Rojo = descartado, verde = encontrado." : "Found %1 at index %2 after %3 steps. Red = discarded, green = found.",
    msgRangeEmpty: isEs ? "El rango está vacío: el objetivo %1 no está en esta matriz ordenada." : "Search range is empty — target %1 is not in this sorted matrix.",
    msgRedGreenNext: isEs ? "Rojo = mitad que descartamos. Verde = mitad que conservamos. Siguiente: ir al medio de la mitad verde." : "Red = half we discard. Green = half we keep. Next: move to the middle of the green half.",
    msgYellowGreenRed: isEs ? "Amarillo = aún considerando. Verde = número actual. Rojo = ya descartado." : "Yellow = still considering. Green = current number. Red = already discarded.",
    stepConsider: isEs ? "Paso %1: considerar índice medio %2 (valor %3). " : "Step %1: consider middle index %2 (value %3). ",
    match: isEs ? "¡Coincide!" : "Match!",
    discardLeftKeepRight: isEs ? "%1 < %2 → descartamos la mitad izquierda (rojo) y conservamos la derecha (verde)." : "%1 < %2 → next we discard the left half (red) and keep the right (green).",
    discardRightKeepLeft: isEs ? "%1 > %2 → descartamos la mitad derecha (rojo) y conservamos la izquierda (verde)." : "%1 > %2 → next we discard the right half (red) and keep the left (green).",
    setRandomTarget: isEs ? "Poner objetivo al azar" : "Set random target",
    runSearch: isEs ? "Ejecutar búsqueda" : "Run search",
    targetLabelBinary: isEs ? "Objetivo: %1  ·  Búsqueda binaria en matriz ordenada (por filas)" : "Target: %1  ·  Binary search on sorted matrix (row-major)",
    getRandomWord: isEs ? "Obtener palabra al azar" : "Get random word",
    lookUp: isEs ? "Buscar" : "Look up",
    placeholderWord: isEs ? "palabra" : "word",
    selectedWord: isEs ? "Palabra seleccionada" : "Selected word",
    msgClickLookUp: isEs ? "Haz clic en \"Buscar\" para ver en qué cubeta está esta palabra." : "Click \"Look up\" to see which bucket contains this word.",
    msgInBucket: isEs ? "\"%1\" está en la cubeta %2. Solo revisamos esa cubeta." : "\"%1\" is in bucket %2. We only checked that bucket.",
    hashBucket: isEs ? "hash(\"%1\")  →  cubeta %2" : "hash(\"%1\")  →  bucket %2",
    eachBucketGetRandom: isEs ? "Cada cubeta tiene 10 palabras. Obtén una palabra al azar y haz clic en \"Buscar\" para ver su cubeta." : "Each bucket has 10 words. Get a random word, then click \"Look up\" to see its bucket.",
    bucket: isEs ? "Cubeta" : "Bucket",
    bubbleSort: isEs ? "Bubble sort" : "Bubble sort",
    wordFallback: isEs ? "palabra" : "word"
  };

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
        ctx.fillText(L.unlocked, W / 2, H / 2 + 36);
      }
      if (statsEl) statsEl.textContent = L.tries + ": " + tries + " | " + L.target + ": " + String(target).padStart(3, "0");
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
      stepBtn.textContent = L.tryNext;
      stepBtn.addEventListener("click", function () {
        if (!unlocked) tick();
      });
      runBtn = document.createElement("button");
      runBtn.type = "button";
      runBtn.textContent = L.runUntilUnlock;
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
      resetBtn.textContent = L.reset;
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
    var dcPrevBtn, dcNextBtn, dcRunBtn;

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
          ? L.divideLabel
          : L.conquerLabel)
        : L.initialArray;
      ctx.fillText(label, 8, 12);

      if (statsEl) {
        statsEl.textContent = L.stepOf.replace("%1", stepIndex + 1).replace("%2", steps.length + 1);
      }
    }

    function canStepForward() {
      return stepIndex < steps.length;
    }

    function updateButtons() {
      if (!controlsEl) return;
      if (dcPrevBtn) dcPrevBtn.disabled = stepIndex === 0;
      if (dcNextBtn) dcNextBtn.disabled = !canStepForward();
      if (dcRunBtn) dcRunBtn.disabled = !canStepForward();
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
      if (dcRunBtn) dcRunBtn.disabled = true;
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
      dcPrevBtn = document.createElement("button");
      dcPrevBtn.type = "button";
      dcPrevBtn.textContent = L.previous;
      dcPrevBtn.setAttribute("data-dc-prev", "");
      dcPrevBtn.addEventListener("click", stepBack);
      dcNextBtn = document.createElement("button");
      dcNextBtn.type = "button";
      dcNextBtn.textContent = L.nextStep;
      dcNextBtn.setAttribute("data-dc-next", "");
      dcNextBtn.addEventListener("click", stepForward);
      dcRunBtn = document.createElement("button");
      dcRunBtn.type = "button";
      dcRunBtn.textContent = L.runAll;
      dcRunBtn.setAttribute("data-dc-run", "");
      dcRunBtn.addEventListener("click", runAll);
      var shuffleBtn = document.createElement("button");
      shuffleBtn.type = "button";
      shuffleBtn.textContent = L.shuffle;
      shuffleBtn.addEventListener("click", shuffle);
      controlsEl.appendChild(dcPrevBtn);
      controlsEl.appendChild(dcNextBtn);
      controlsEl.appendChild(dcRunBtn);
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
    var dpPrevBtn, dpNextBtn, dpRunBtn;

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
      if (dpPrevBtn) dpPrevBtn.disabled = currentN <= 2;
      if (dpNextBtn) dpNextBtn.disabled = currentN >= 10;
      if (dpRunBtn) dpRunBtn.disabled = animating;
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
      dpPrevBtn = document.createElement("button");
      dpPrevBtn.type = "button";
      dpPrevBtn.textContent = L.previous;
      dpPrevBtn.setAttribute("data-dp-prev", "");
      dpPrevBtn.addEventListener("click", prevStep);
      dpNextBtn = document.createElement("button");
      dpNextBtn.type = "button";
      dpNextBtn.textContent = L.nextStep;
      dpNextBtn.setAttribute("data-dp-next", "");
      dpNextBtn.addEventListener("click", nextStep);
      dpRunBtn = document.createElement("button");
      dpRunBtn.type = "button";
      dpRunBtn.textContent = L.runAll;
      dpRunBtn.setAttribute("data-dp-run", "");
      dpRunBtn.addEventListener("click", runAll);
      controlsEl.appendChild(dpPrevBtn);
      controlsEl.appendChild(dpNextBtn);
      controlsEl.appendChild(dpRunBtn);
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
      if (statsEl) statsEl.textContent = L.countCoins.replace("%1", chosen.length);
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
      inputEl.setAttribute("aria-label", L.amountCents);
      var goBtn = document.createElement("button");
      goBtn.type = "button";
      goBtn.textContent = L.greedyCoinChange;
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
      shuffleBtn.textContent = L.shuffle;
      shuffleBtn.addEventListener("click", shuffle);
      var solveBtn = document.createElement("button");
      solveBtn.type = "button";
      solveBtn.textContent = L.solve;
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
      ctx.fillText(L.targetLabelBinary.replace("%1", targetLabel), 12, H - 18);

      if (statsEl) {
        if (steps === 0 || lo === null || hi === null) {
          statsEl.textContent = L.stepsDash;
        } else if (done && foundIndex >= 0) {
          statsEl.textContent = L.stepsFound.replace("%1", steps).replace("%2", foundIndex);
        } else if (done) {
          statsEl.textContent = L.stepsNotInArray.replace("%1", steps);
        } else {
          statsEl.textContent = L.stepsRange.replace("%1", steps).replace("%2", lo).replace("%3", hi);
        }
      }

      if (messageEl) {
        if (targetIndex < 0) {
          messageEl.textContent = L.msgSetRandomThenRun;
        } else if (lo === null || hi === null) {
          messageEl.textContent = L.msgTargetClickRun.replace("%1", targetValue);
        } else if (done) {
          if (foundIndex >= 0) {
            messageEl.textContent = L.msgFoundAfter.replace("%1", targetValue).replace("%2", foundIndex).replace("%3", steps);
          } else {
            messageEl.textContent = L.msgRangeEmpty.replace("%1", targetValue);
          }
        } else if (phase === "discard") {
          messageEl.textContent = L.msgRedGreenNext;
        } else if (mid !== null) {
          var currentVal = arr[mid];
          var msg = L.stepConsider.replace("%1", steps).replace("%2", mid).replace("%3", currentVal);
          if (currentVal === targetValue) {
            msg += L.match;
          } else if (currentVal < targetValue) {
            msg += L.discardLeftKeepRight.replace("%1", currentVal).replace("%2", targetValue);
          } else {
            msg += L.discardRightKeepLeft.replace("%1", currentVal).replace("%2", targetValue);
          }
          messageEl.textContent = msg;
        } else {
          messageEl.textContent = L.msgYellowGreenRed;
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
        if (controlsEl) container.insertBefore(messageEl, controlsEl);
        else container.appendChild(messageEl);
      }
    }

    if (controlsEl) {
      var randomBtn = document.createElement("button");
      randomBtn.type = "button";
      randomBtn.textContent = L.setRandomTarget;
      randomBtn.addEventListener("click", setRandomTarget);

      var runBtn = document.createElement("button");
      runBtn.type = "button";
      runBtn.textContent = L.runSearch;
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
      shuffleBtn.textContent = L.shuffle;
      shuffleBtn.addEventListener("click", shuffle);
      var sortBtn = document.createElement("button");
      sortBtn.type = "button";
      sortBtn.textContent = L.bubbleSort;
      sortBtn.addEventListener("click", bubbleSort);
      controlsEl.appendChild(shuffleBtn);
      controlsEl.appendChild(sortBtn);
    }
    drawBars();
  })();

  // —— 8. Hashing: 10 words per bucket, get random word + look up ———
  (function () {
    var container = getContainer("demo-hash");
    var canvas = getCanvas(container);
    if (!canvas || !container) return;
    var ctx = canvas.getContext("2d");
    var numBuckets = 5;
    var wordsPerBucket = 10;
    var controlsEl = getControls(container);
    var statsEl = getStats(container);
    var messageEl;
    var wordDisplayEl;
    var lastKey = "";
    var lastHash = null;
    var lastBucket = null;

    function hash(s) {
      var h = 0;
      for (var i = 0; i < s.length; i++) {
        h = ((h << 5) - h) + s.charCodeAt(i);
        h = h & 0x7fffffff;
      }
      return h;
    }

    function buildBuckets() {
      var pool = isEs
        ? [
            "manzana", "plátano", "leche", "pan", "té", "café", "sal", "azúcar", "pera", "pastel",
            "perro", "gato", "pájaro", "pez", "rana", "león", "oso", "lobo", "venado", "pato",
            "rojo", "azul", "verde", "negro", "blanco", "oro", "rosa", "gris", "marino", "limón",
            "correr", "caminar", "saltar", "leer", "escribir", "cantar", "jugar", "cocinar", "dibujar", "nadar",
            "uno", "dos", "cinco", "nueve", "cero", "medio", "lleno", "pequeño", "grande", "rápido",
            "libro", "puerta", "lámpara", "escritorio", "llaves", "teléfono", "reloj", "silla", "mesa", "sofá",
            "sol", "luna", "estrella", "viento", "lluvia", "nieve", "nube", "cielo", "árbol", "hoja",
            "ciudad", "pueblo", "camino", "parque", "puente", "río", "playa", "cerro", "lago", "puerto",
            "feliz", "tranquilo", "valiente", "calmado", "fresco", "veloz", "afilado", "suave", "cálido", "frío",
            "primero", "último", "izquierda", "derecha", "norte", "sur", "este", "oeste", "hoy", "noche"
          ]
        : [
            "apple", "banana", "milk", "bread", "tea", "coffee", "salt", "sugar", "pear", "pie",
            "dog", "cat", "bird", "fish", "frog", "lion", "bear", "wolf", "deer", "duck",
            "red", "blue", "green", "black", "white", "gold", "pink", "gray", "navy", "lime",
            "run", "walk", "jump", "read", "write", "sing", "play", "cook", "draw", "swim",
            "one", "two", "five", "nine", "zero", "half", "full", "tiny", "huge", "fast",
            "book", "door", "lamp", "desk", "keys", "phone", "clock", "chair", "table", "couch",
            "sun", "moon", "star", "wind", "rain", "snow", "cloud", "sky", "tree", "leaf",
            "city", "town", "road", "park", "bridge", "river", "beach", "hill", "lake", "port",
            "happy", "quiet", "brave", "calm", "fresh", "quick", "sharp", "soft", "warm", "cool",
            "first", "last", "left", "right", "north", "south", "east", "west", "today", "night"
          ];
      var b = [];
      for (var i = 0; i < numBuckets; i++) b.push([]);
      for (var w = 0; w < pool.length; w++) {
        var h = hash(pool[w]);
        var idx = h % numBuckets;
        if (b[idx].length < wordsPerBucket) {
          b[idx].push({ key: pool[w], hash: h });
        }
      }
      for (var i = 0; i < numBuckets; i++) {
        while (b[i].length < wordsPerBucket) {
          var fallback = L.wordFallback + "-" + i + "-" + b[i].length;
          b[i].push({ key: fallback, hash: hash(fallback) });
        }
      }
      return b;
    }
    var buckets = buildBuckets();
    var allWords = [];
    for (var i = 0; i < numBuckets; i++) {
      for (var j = 0; j < buckets[i].length; j++) {
        allWords.push(buckets[i][j].key);
      }
    }

    function getRandomWord() {
      var w = allWords[Math.floor(Math.random() * allWords.length)];
      if (wordDisplayEl) wordDisplayEl.value = w;
      lastBucket = null;
      lastKey = "";
      lastHash = null;
      draw();
      if (statsEl) statsEl.textContent = "";
      if (messageEl) messageEl.textContent = L.msgClickLookUp;
    }

    function lookUp() {
      var s = (wordDisplayEl && wordDisplayEl.value) ? String(wordDisplayEl.value).trim() : "";
      if (!s) {
        getRandomWord();
        return;
      }
      lastKey = s;
      lastHash = hash(s);
      lastBucket = lastHash % numBuckets;
      draw();
      if (statsEl) {
        statsEl.textContent = L.hashBucket.replace("%1", lastKey).replace("%2", lastBucket);
      }
      if (messageEl) {
        messageEl.textContent = L.msgInBucket.replace("%1", lastKey).replace("%2", lastBucket);
      }
    }

    function draw() {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      ctx.font = "12px ui-monospace, monospace";
      ctx.fillStyle = fg;
      ctx.fillText(L.eachBucketGetRandom, 12, 18);
      var bw = (W - 24 - (numBuckets - 1) * 4) / numBuckets;
      var lineH = 14;
      var maxLines = Math.min(wordsPerBucket, Math.floor((H - 52) / lineH));
      for (var i = 0; i < numBuckets; i++) {
        var x = 12 + i * (bw + 4);
        var isHighlight = lastBucket !== null && i === lastBucket;
        ctx.fillStyle = isHighlight ? "#8DCEA7" : "#2a2a2c";
        ctx.fillRect(x, 28, bw, H - 44);
        ctx.strokeStyle = isHighlight ? "#6ab88a" : "#444";
        ctx.strokeRect(x, 28, bw, H - 44);
        ctx.fillStyle = fg;
        ctx.fillText(L.bucket + " " + i, x + 4, 46);
        for (var j = 0; j < Math.min(buckets[i].length, maxLines); j++) {
          ctx.fillStyle = acc;
          ctx.fillText(buckets[i][j].key, x + 4, 62 + j * lineH);
        }
        if (buckets[i].length > maxLines) {
          ctx.fillStyle = fg;
          ctx.fillText("…", x + 4, 62 + maxLines * lineH);
        }
      }
    }

    if (container) {
      messageEl = document.createElement("p");
      messageEl.className = "demo-message";
      messageEl.setAttribute("aria-live", "polite");
      messageEl.style.marginTop = "8px";
      messageEl.style.marginBottom = "8px";
      messageEl.style.fontSize = "13px";
      messageEl.style.color = "var(--text-muted, #888)";
      messageEl.style.minHeight = "2em";
      var canvasWrap = container.querySelector(".demo-canvas-wrap");
      if (canvasWrap && canvasWrap.parentNode) {
        canvasWrap.parentNode.insertBefore(messageEl, canvasWrap.nextSibling);
      } else {
        if (controlsEl) container.insertBefore(messageEl, controlsEl);
        else container.appendChild(messageEl);
      }
    }

    if (controlsEl) {
      wordDisplayEl = document.createElement("input");
      wordDisplayEl.type = "text";
      wordDisplayEl.readOnly = true;
      wordDisplayEl.placeholder = L.placeholderWord;
      wordDisplayEl.setAttribute("aria-label", L.selectedWord);
      wordDisplayEl.style.background = "#2a2a2c";
      wordDisplayEl.style.color = fg;
      var randomBtn = document.createElement("button");
      randomBtn.type = "button";
      randomBtn.textContent = L.getRandomWord;
      randomBtn.addEventListener("click", getRandomWord);
      var lookupBtn = document.createElement("button");
      lookupBtn.type = "button";
      lookupBtn.textContent = L.lookUp;
      lookupBtn.addEventListener("click", lookUp);
      controlsEl.appendChild(wordDisplayEl);
      controlsEl.appendChild(randomBtn);
      controlsEl.appendChild(lookupBtn);
    }
    draw();
  })();
})();
