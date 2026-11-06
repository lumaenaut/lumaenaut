(() => {
  const shareButtons = document.querySelectorAll(".share-btn");
  const emailLinks = document.querySelectorAll(".copy-email-link");

  if (shareButtons.length === 0 && emailLinks.length === 0) {
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
      feedback.textContent = "";
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

  async function copyText(text, successMessage, failureMessage) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else if (!copyWithFallback(text)) {
        throw new Error("Clipboard copy is not supported");
      }

      showFeedback(successMessage);
    } catch {
      showFeedback(failureMessage);
    }
  }

  async function copyPageUrl() {
    const url = window.location.href;
    await copyText(url, "Link copied!", "Could not copy link. Please copy the URL from your address bar.");
  }

  async function copyEmailAddress(event) {
    event.preventDefault();
    const email = event.currentTarget.dataset.copyEmail;
    if (!email) {
      return;
    }

    await copyText(email, "email address copied", "Could not copy email address.");
  }

  shareButtons.forEach((button) => {
    button.addEventListener("click", () => {
      void copyPageUrl();
    });
  });

  emailLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      void copyEmailAddress(event);
    });
  });
})();
