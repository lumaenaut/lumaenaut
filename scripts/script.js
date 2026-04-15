/**
 * Logo animation: builds the lumænaut ASCII logo in the DOM and animates
 * random characters with alternating colors on an interval.
 */
(function () {
  // Raw ASCII art source for the logo (multi-line string)
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

  /**
   * Converts a multi-line string into a 2D matrix of characters.
   * Pads shorter lines with spaces so every row has the same length.
   * @param {string} str - The source string (e.g. logo lines separated by newlines)
   * @returns {string[][]} - Matrix of single-character rows
   */
  function toMatrix(str) {
    var lines = str.split("\n");
    var maxLen = 0;
    var i, line, row;
    // Find the longest line so we can pad shorter ones
    for (i = 0; i < lines.length; i++) {
      if (lines[i].length > maxLen) maxLen = lines[i].length;
    }
    var matrix = [];
    // Turn each line into an array of characters; pad with spaces to maxLen
    for (i = 0; i < lines.length; i++) {
      line = lines[i];
      row = line.split("");
      while (row.length < maxLen) row.push(" ");
      matrix.push(row);
    }
    return matrix;
  }

  /**
   * Returns either black or grey at random (used for logo character flicker).
   * @returns {string} - "#000" or "grey"
   */
  function randomColor() {
    return Math.random() < 0.5 ? "#000" : "grey";
  }

  /**
   * Picks a given number of random cells from the matrix (without replacement).
   * Used to choose which logo characters to recolor each tick.
   * @param {string[][]} matrix - The logo character matrix
   * @param {number} count - How many cells to pick
   * @returns {{ row: number, col: number }[]} - Array of { row, col } objects
   */
  function pickRandomCells(matrix, count) {
    var rows = matrix.length;
    var cols = matrix[0].length;
    var total = rows * cols;
    var indices = [];
    var i, j, tmp, idx, chosen = [];
    var picks = Math.min(count, total);
    for (i = 0; i < total; i++) indices.push(i);
    // Partial Fisher–Yates: same uniform distribution as pick-without-replacement, O(picks) instead of O(picks²) splice
    for (i = 0; i < picks; i++) {
      j = i + Math.floor(Math.random() * (total - i));
      tmp = indices[i];
      indices[i] = indices[j];
      indices[j] = tmp;
      idx = indices[i];
      chosen.push({ row: Math.floor(idx / cols), col: idx % cols });
    }
    return chosen;
  }

  // Build matrix and parallel structures: colorMatrix tracks current color per cell, spanMatrix points to each character's DOM span
  var matrix = toMatrix(logoSource);
  var rows = matrix.length;
  var cols = matrix[0].length;
  var spanMatrix = [];
  var container = document.getElementById("logo-container");
  if (!container) return;

  // Create one span per character, grouped by line; store refs for animation
  var r, c, lineEl, charSpan;
  for (r = 0; r < rows; r++) {
    spanMatrix[r] = [];
    lineEl = document.createElement("span");
    lineEl.className = "logo-line";
    for (c = 0; c < cols; c++) {
      charSpan = document.createElement("span");
      charSpan.className = "logo-char";
      charSpan.setAttribute("data-row", r);
      charSpan.setAttribute("data-col", c);
      charSpan.textContent = matrix[r][c];
      spanMatrix[r][c] = charSpan;
      lineEl.appendChild(charSpan);
    }
    // Preserve newline so the logo keeps its shape (pre + whitespace)
    lineEl.appendChild(document.createTextNode("\n"));
    container.appendChild(lineEl);
  }

  // How many characters to recolor per tick (scale with logo size)
  var charsPerTick = Math.max(5, Math.floor((rows * cols) / 15));

  // Every second, pick random cells and apply a random color to each (updates both colorMatrix and the span's inline style)
  setInterval(function () {
    var cells = pickRandomCells(matrix, charsPerTick);
    var i, cell, color;
    for (i = 0; i < cells.length; i++) {
      cell = cells[i];
      color = randomColor();
      spanMatrix[cell.row][cell.col].style.color = color;
    }
  }, 1000);
})();

/**
 * Share button: uses Web Share API when available, otherwise copies URL to clipboard
 * or falls back to execCommand("copy"). Swaps share icon for iOS if data-ios-src is set.
 */
(function () {
  var shareBtn = document.querySelector(".share-btn");
  if (!shareBtn) return;

  // On Apple devices, optionally use a different share icon
  var shareBtnImg = shareBtn.querySelector(".share-btn-icon");
  if (shareBtnImg && navigator.vendor && navigator.vendor.indexOf("Apple") !== -1) {
    var iosSrc = shareBtnImg.getAttribute("data-ios-src");
    if (iosSrc) shareBtnImg.src = iosSrc;
  }

  /**
   * Returns the canonical URL for the current page, or location.href if no canonical link.
   * @returns {string}
   */
  function getShareUrl() {
    var canonical = document.querySelector('link[rel="canonical"]');
    return (canonical && canonical.href) ? canonical.href : window.location.href;
  }

  /**
   * Returns the page title for sharing (og:title if present, else document.title).
   * @returns {string}
   */
  function getShareTitle() {
    var ogTitle = document.querySelector('meta[property="og:title"]');
    return (ogTitle && ogTitle.content) ? ogTitle.content : document.title;
  }

  /**
   * Returns the page description for sharing (meta name="description" content).
   * @returns {string}
   */
  function getShareText() {
    var desc = document.querySelector('meta[name="description"]');
    return (desc && desc.content) ? desc.content : "";
  }

  // Click: prefer Web Share API, then clipboard, then hidden textarea + execCommand
  shareBtn.addEventListener("click", function () {
    var url = getShareUrl();
    var title = getShareTitle();
    var text = getShareText();

    // Native share sheet (mobile / supported browsers)
    if (navigator.share) {
      shareBtn.disabled = true;
      navigator
        .share({ title: title, text: text, url: url })
        .then(function () {
          // Briefly show "Shared" and restore the icon + aria-label after 2s
          var label = shareBtn.getAttribute("aria-label");
          var img = shareBtn.querySelector(".share-btn-icon");
          shareBtn.textContent = "Shared";
          shareBtn.setAttribute("aria-label", "Shared");
          setTimeout(function () {
            shareBtn.textContent = "";
            if (img) shareBtn.appendChild(img);
            shareBtn.setAttribute("aria-label", label || "Share this page");
            shareBtn.disabled = false;
          }, 2000);
        })
        .catch(function () {
          shareBtn.disabled = false;
        });
      return;
    }

    // Clipboard API (no share sheet) — just copy URL; no visual feedback
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url);
      return;
    }

    // Fallback: temporary textarea off-screen, select + execCommand("copy"), then remove (for older browsers)
    var ta = document.createElement("textarea");
    ta.value = url;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch (e) {}
    document.body.removeChild(ta);
  });
})();

/**
 * Floating controls (e.g. language switcher): hide on scroll down, show on scroll up
 * or when at top of .content. Uses requestAnimationFrame to throttle scroll handling.
 */
(function () {
  var content = document.querySelector(".content");
  var controls = document.querySelector(".floating-controls");
  if (!content || !controls) return;

  // Track scroll position and avoid scheduling multiple rAF callbacks
  var lastScrollTop = content.scrollTop || 0;
  var ticking = false;

  /**
   * Toggles the is-hidden class on the floating controls.
   * @param {boolean} hidden - True to add is-hidden, false to remove it
   */
  function setHidden(hidden) {
    controls.classList.toggle("is-hidden", hidden);
  }

  /**
   * Handles scroll: at top always show; otherwise hide on scroll down, show on scroll up
   * (only if delta >= 8px to avoid jitter). Runs inside rAF for throttling.
   */
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var current = content.scrollTop || 0;
      var delta = current - lastScrollTop;
      // At top of scroll: always show controls
      if (current <= 0) {
        setHidden(false);
      } else if (Math.abs(delta) >= 8) {
        // Only react if scroll moved at least 8px — hide when scrolling down (delta > 0), show when scrolling up
        setHidden(delta > 0);
        lastScrollTop = current;
      }
      ticking = false;
    });
  }

  content.addEventListener("scroll", onScroll, { passive: true });
})();

/**
 * Language switcher: sets hrefs for eng-US and esp-LAT based on current path,
 * updates the visible label, and toggles the dropdown on button click.
 */
(function () {
  var btn = document.querySelector(".lang-switcher-btn");
  var dropdown = document.querySelector(".lang-switcher-dropdown");
  if (!btn || !dropdown) return;

  // Derive English and Spanish paths from current URL.
  // Spanish filenames differ from English ones (e.g. indice.html vs index.html),
  // so we map special cases and blog post slugs explicitly.
  var pathname = window.location.pathname || "";
  var base = window.location.origin;
  var isEng = pathname.indexOf("/esp-LAT") !== 0;

  var blogEspToEng = {
    // Computer science / computación
    "blog/computacion/el-arte-del-codigo-lento.html": "blog/computer-science/the-art-of-slow-code.html",
    "blog/computacion/los-8-paradigmas-de-algoritmos.html": "blog/computer-science/the-8-algorithm-paradigms.html",
    "blog/computacion/asi-funciona-el-bucle-del-videojuego.html": "blog/computer-science/how-the-game-loop-works.html",
    // LeetCode series
    "blog/resolviendo-leetcode/dia-1-two-sum.html": "blog/solving-leetcode/day-1-two-sum.html",
    "blog/resolviendo-leetcode/dia-2-add-two-numbers.html": "blog/solving-leetcode/day-2-add-two-numbers.html",
    // Legacy blog root / old folder names (pre-reorg)
    "blog/el-arte-del-codigo-lento.html": "blog/computer-science/the-art-of-slow-code.html",
    "blog/los-8-paradigmas-de-algoritmos.html": "blog/computer-science/the-8-algorithm-paradigms.html",
    "blog/asi-funciona-el-bucle-del-videojuego.html": "blog/computer-science/how-the-game-loop-works.html",
    "blog/puliendo-leetcode/dia-1-two-sum.html": "blog/solving-leetcode/day-1-two-sum.html",
    "blog/puliendo-leetcode/dia-2-add-two-numbers.html": "blog/solving-leetcode/day-2-add-two-numbers.html",
    // Logbook / Bitácora (moved into subfolders)
    "blog/bitacora/ep-2-todo-lo-que-no-se-sobre-bloguear.html": "blog/logbook/ch-2-everything-i-dont-know-about-blogging.html",
    "blog/bitacora/ep-1-aspirante-nomada-digital.html": "blog/logbook/ch-1-aspiring-digital-nomad.html",
  };

  var blogEngToEsp = {
    "blog/computer-science/the-art-of-slow-code.html": "blog/computacion/el-arte-del-codigo-lento.html",
    "blog/computer-science/the-8-algorithm-paradigms.html": "blog/computacion/los-8-paradigmas-de-algoritmos.html",
    "blog/computer-science/how-the-game-loop-works.html": "blog/computacion/asi-funciona-el-bucle-del-videojuego.html",
    "blog/solving-leetcode/day-1-two-sum.html": "blog/resolviendo-leetcode/dia-1-two-sum.html",
    "blog/solving-leetcode/day-2-add-two-numbers.html": "blog/resolviendo-leetcode/dia-2-add-two-numbers.html",
    // Legacy English paths
    "blog/the-art-of-slow-code.html": "blog/computacion/el-arte-del-codigo-lento.html",
    "blog/the-8-algorithm-paradigms.html": "blog/computacion/los-8-paradigmas-de-algoritmos.html",
    "blog/how-a-game-loop-works.html": "blog/computacion/asi-funciona-el-bucle-del-videojuego.html",
    "blog/grinding-leetcode/day-1-two-sum.html": "blog/resolviendo-leetcode/dia-1-two-sum.html",
    "blog/grinding-leetcode/day-2-add-two-numbers.html": "blog/resolviendo-leetcode/dia-2-add-two-numbers.html",
    // Logbook / Bitácora
    "blog/logbook/ch-2-everything-i-dont-know-about-blogging.html": "blog/bitacora/ep-2-todo-lo-que-no-se-sobre-bloguear.html",
    "blog/logbook/ch-1-aspiring-digital-nomad.html": "blog/bitacora/ep-1-aspirante-nomada-digital.html",
    "blog/ch-2-everything-i-dont-know-about-blogging.html": "blog/bitacora/ep-2-todo-lo-que-no-se-sobre-bloguear.html",
    "blog/ch-1-aspiring-digital-nomad.html": "blog/bitacora/ep-1-aspirante-nomada-digital.html",
  };

  function espToEngPath(espPathname) {
    // Input example: /esp-LAT/indice.html
    // Output example: /eng-US/ (homepage)
    var rest = espPathname.replace(/^\/esp-LAT\/?/, "");

    if (!rest || rest === "/") return "/eng-US/";
    if (rest === "indice.html") return "/eng-US/";
    if (rest === "politica-de-privacidad.html") return "/eng-US/privacy-policy.html";
    if (rest === "blog/blog-indice.html") return "/eng-US/blog/blog-index.html";

    var mappedBlog = blogEspToEng[rest];
    if (mappedBlog) return "/eng-US/" + mappedBlog;

    // Fallback: keep the relative path after the locale prefix.
    return "/eng-US/" + rest.replace(/^\/+/, "");
  }

  function engToEspPath(engPathname) {
    // Input example: /eng-US/privacy-policy.html
    // Output example: /esp-LAT/politica-de-privacidad.html
    var rest = engPathname.replace(/^\/eng-US\/?/, "");

    if (!rest || rest === "/") return "/esp-LAT/indice.html";
    if (rest === "index.html") return "/esp-LAT/indice.html";
    if (rest === "privacy-policy.html") return "/esp-LAT/politica-de-privacidad.html";
    if (rest === "blog/blog-index.html") return "/esp-LAT/blog/blog-indice.html";

    var mappedBlog = blogEngToEsp[rest];
    if (mappedBlog) return "/esp-LAT/" + mappedBlog;

    // Fallback: keep the relative path after the locale prefix.
    return "/esp-LAT/" + rest.replace(/^\/+/, "");
  }

  var engPath = isEng ? pathname : espToEngPath(pathname);
  var espPath = isEng ? engToEspPath(pathname) : pathname;

  // Update displayed language label and link hrefs
  var label = btn.querySelector(".lang-switcher-label");
  if (label) label.textContent = isEng ? "eng (US)" : "esp (LAT)";

  var engLink = dropdown.querySelector('a[data-lang="eng-US"]');
  var espLink = dropdown.querySelector('a[data-lang="esp-LAT"]');
  if (engLink) engLink.href = base + engPath;
  if (espLink) espLink.href = base + espPath;
  if (engLink) engLink.classList.toggle("is-current", isEng);
  if (espLink) espLink.classList.toggle("is-current", !isEng);

  // Toggle dropdown on button click; close on outside click; prevent dropdown click from closing
  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    dropdown.classList.toggle("is-open");
  });

  document.addEventListener("click", function () {
    dropdown.classList.remove("is-open");
  });

  dropdown.addEventListener("click", function (e) {
    e.stopPropagation();
  });
})();
