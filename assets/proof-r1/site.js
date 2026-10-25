const tabs = [...document.querySelectorAll('[role="tab"][data-model]')];
const selectModel = (selected) => {
  for (const tab of tabs) {
    const active = tab === selected;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute("aria-controls")).hidden = !active;
  }
};
if (tabs.length) {
  document.querySelector('[role="tablist"]').hidden = false;
  selectModel(tabs[0]);
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectModel(tab));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        selectModel(tabs[next]);
        tabs[next].focus();
      }
    });
  });
}

const copyButton = document.getElementById("copy-citation");
if (copyButton) {
  copyButton.hidden = false;
  copyButton.addEventListener("click", async () => {
    const citation = document.getElementById("bibtex");
    const status = document.getElementById("copy-status");
    try {
      await navigator.clipboard.writeText(citation.textContent.trim());
      copyButton.textContent = "Copied ✓";
      status.textContent = "BibTeX copied to clipboard.";
    } catch {
      const range = document.createRange();
      range.selectNodeContents(citation);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = "Citation selected. Press Ctrl+C (or ⌘C) to copy.";
    }
  });
}

const dialog = document.getElementById("figure-dialog");
if (dialog && typeof dialog.showModal === "function") {
  const fullImage = document.getElementById("figure-full");
  const caption = document.getElementById("figure-caption");
  for (const link of document.querySelectorAll("a[data-zoom]")) {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      fullImage.src = link.href;
      fullImage.alt = link.querySelector("img").alt;
      caption.textContent = link.dataset.caption;
      dialog.showModal();
    });
  }
  dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
}
