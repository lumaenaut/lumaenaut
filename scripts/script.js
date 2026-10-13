(() => {
  const shareButtons = document.querySelectorAll(".share-btn");

  if (shareButtons.length === 0) {
    return;
  }

  const feedback = document.createElement("div");
  feedback.className = "share-feedback";
  feedback.setAttribute("role", "status");
  feedback.setAttribute("aria-live", "polite");
  feedback.setAttribute("aria-atomic", "true");
  document.body.append(feedback);

  let feedbackTimeout;

  function showFeedback(message) {
    feedback.textContent = message;
    feedback.classList.add("is-visible");
    window.clearTimeout(feedbackTimeout);
    feedbackTimeout = window.setTimeout(() => {
      feedback.classList.remove("is-visible");
    }, 2000);
  }

  function copyWithFallback(text) {
    if (typeof document.execCommand !== "function") {
      return false;
    }

    const input = document.createElement("textarea");
    input.value = text;
    input.setAttribute("readonly", "");
    input.setAttribute("aria-hidden", "true");
    input.style.position = "fixed";
    input.style.left = "-9999px";
    document.body.append(input);
    input.select();

    let copied = false;
    try {
      copied = document.execCommand("copy");
    } finally {
      input.remove();
    }

    return copied;
  }

  async function copyPageUrl() {
    const url = window.location.href;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else if (!copyWithFallback(url)) {
        throw new Error("Clipboard copy is not supported");
      }

      showFeedback("Link copied!");
    } catch {
      showFeedback("Could not copy link. Please copy the URL from your address bar.");
    }
  }

  shareButtons.forEach((button) => {
    button.addEventListener("click", () => {
      void copyPageUrl();
    });
  });
})();
