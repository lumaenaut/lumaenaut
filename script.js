(function () {
  if (navigator.vendor && navigator.vendor.indexOf("Apple") !== -1) {
    document.documentElement.classList.add("safari");
  }
})();

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
  var shareBtn = document.querySelector(".share-btn");
  if (!shareBtn) return;

  var shareBtnImg = shareBtn.querySelector(".share-btn-icon");
  if (shareBtnImg && navigator.vendor && navigator.vendor.indexOf("Apple") !== -1) {
    var iosSrc = shareBtnImg.getAttribute("data-ios-src");
    if (iosSrc) shareBtnImg.src = iosSrc;
  }

  function getShareUrl() {
    var canonical = document.querySelector('link[rel="canonical"]');
    return (canonical && canonical.href) ? canonical.href : window.location.href;
  }

  function getShareTitle() {
    var ogTitle = document.querySelector('meta[property="og:title"]');
    return (ogTitle && ogTitle.content) ? ogTitle.content : document.title;
  }

  function getShareText() {
    var desc = document.querySelector('meta[name="description"]');
    return (desc && desc.content) ? desc.content : "";
  }

  shareBtn.addEventListener("click", function () {
    var url = getShareUrl();
    var title = getShareTitle();
    var text = getShareText();

    if (navigator.share) {
      shareBtn.disabled = true;
      navigator
        .share({ title: title, text: text, url: url })
        .then(function () {
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

    function showCopied() {
      var img = shareBtn.querySelector(".share-btn-icon");
      shareBtn.textContent = "Copied!";
      shareBtn.disabled = true;
      setTimeout(function () {
        shareBtn.textContent = "";
        if (img) shareBtn.appendChild(img);
        shareBtn.disabled = false;
      }, 1500);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(showCopied);
      return;
    }

    var ta = document.createElement("textarea");
    ta.value = url;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showCopied();
    } catch (e) {}
    document.body.removeChild(ta);
  });
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

(function () {
  var btn = document.querySelector(".lang-switcher-btn");
  var dropdown = document.querySelector(".lang-switcher-dropdown");
  if (!btn || !dropdown) return;

  var pathname = window.location.pathname || "";
  var base = window.location.origin;
  var isEng = pathname.indexOf("/esp-LAT") !== 0;
  var engPath = pathname.startsWith("/esp-LAT")
    ? pathname.replace(/^\/esp-LAT/, "/eng-US")
    : pathname.startsWith("/eng-US")
    ? pathname
    : "/eng-US/" + (pathname === "/" || pathname === "" ? "" : pathname.replace(/^\//, ""));
  var espPath = pathname.startsWith("/eng-US")
    ? pathname.replace(/^\/eng-US/, "/esp-LAT")
    : pathname.startsWith("/esp-LAT")
    ? pathname
    : "/esp-LAT/" + (pathname === "/" || pathname === "" ? "" : pathname.replace(/^\//, ""));

  var label = btn.querySelector(".lang-switcher-label");
  if (label) label.textContent = isEng ? "eng (US)" : "esp (LAT)";

  var engLink = dropdown.querySelector('a[data-lang="eng-US"]');
  var espLink = dropdown.querySelector('a[data-lang="esp-LAT"]');
  if (engLink) engLink.href = base + engPath;
  if (espLink) espLink.href = base + espPath;
  if (engLink) engLink.classList.toggle("is-current", isEng);
  if (espLink) espLink.classList.toggle("is-current", !isEng);

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
