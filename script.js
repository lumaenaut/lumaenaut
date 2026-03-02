(function () {
  var logoSource = `
            =
          .  **
          -= :*+
         .*= ***. +
        -+= =***- *-
        -: =**=* :*-
      .  =**+=*= ++
    :  =*++===*+ -  +
  .+- +++=+ =++** .-*:
  ++ ++=++.  +++**+ **
 =++++=++= .: =++=++++=
.+-=++==. -++   =+=++++.
.+-===: :+++.  . :===++.
 --==: ===+=   :=  ==+=
  --= .=====+++==: ===
   :=- ========== .=:
      : ======== ::
`;

  function toMatrix(str) {
    var lines = str.split("\n");
    var maxLen = 0;
    var i, line, row;
    for (i = 0; i < lines.length; i++) {
      if (lines[i].length > maxLen) maxLen = lines[i].length;
    }
    var matrix = [];
    for (i = 0; i < lines.length; i++) {
      line = lines[i];
      row = line.split("");
      while (row.length < maxLen) row.push(" ");
      matrix.push(row);
    }
    return matrix;
  }

  function randomColor() {
    return Math.random() < 0.5 ? "#000" : "grey";
  }

  function pickRandomCells(matrix, count) {
    var rows = matrix.length;
    var cols = matrix[0].length;
    var total = rows * cols;
    var indices = [];
    var i, r, idx, chosen = [];
    for (i = 0; i < total; i++) indices.push(i);
    for (i = 0; i < count && indices.length > 0; i++) {
      r = Math.floor(Math.random() * indices.length);
      idx = indices[r];
      indices.splice(r, 1);
      chosen.push({ row: Math.floor(idx / cols), col: idx % cols });
    }
    return chosen;
  }

  var matrix = toMatrix(logoSource);
  var rows = matrix.length;
  var cols = matrix[0].length;
  var colorMatrix = [];
  var spanMatrix = [];
  var container = document.getElementById("logo-container");
  if (!container) return;

  var r, c, span, lineEl, charSpan;
  for (r = 0; r < rows; r++) {
    colorMatrix[r] = [];
    spanMatrix[r] = [];
    lineEl = document.createElement("span");
    lineEl.className = "logo-line";
    for (c = 0; c < cols; c++) {
      colorMatrix[r][c] = null;
      charSpan = document.createElement("span");
      charSpan.className = "logo-char";
      charSpan.setAttribute("data-row", r);
      charSpan.setAttribute("data-col", c);
      charSpan.textContent = matrix[r][c];
      spanMatrix[r][c] = charSpan;
      lineEl.appendChild(charSpan);
    }
    lineEl.appendChild(document.createTextNode("\n"));
    container.appendChild(lineEl);
  }

  var charsPerTick = Math.max(5, Math.floor((rows * cols) / 15));

  setInterval(function () {
    var cells = pickRandomCells(matrix, charsPerTick);
    var i, cell, color;
    for (i = 0; i < cells.length; i++) {
      cell = cells[i];
      color = randomColor();
      colorMatrix[cell.row][cell.col] = color;
      spanMatrix[cell.row][cell.col].style.color = color;
    }
  }, 1000);
})();

(function () {
  var content = document.querySelector(".content");
  var controls = document.querySelector(".floating-controls");
  if (!content || !controls) return;

  var lastScrollTop = content.scrollTop || 0;
  var ticking = false;

  function setHidden(hidden) {
    controls.classList.toggle("is-hidden", hidden);
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(function () {
      var current = content.scrollTop || 0;
      var delta = current - lastScrollTop;

      if (current <= 0) {
        setHidden(false);
      } else if (Math.abs(delta) >= 8) {
        setHidden(delta > 0);
        lastScrollTop = current;
      }

      ticking = false;
    });
  }

  content.addEventListener("scroll", onScroll, { passive: true });
})();
