const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");
const mobileViewport = window.matchMedia("(max-width: 760px)");
document.documentElement.classList.add("js");
menuButton.hidden = false;

function closeMenu() {
  navigation.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.querySelector("span").textContent = "＋";
}
menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  navigation.classList.toggle("is-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.querySelector("span").textContent = open ? "−" : "＋";
});
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuButton.focus();
  }
});
mobileViewport.addEventListener("change", () => {
  if (mobileViewport.matches && navigation.contains(document.activeElement)) menuButton.focus();
  closeMenu();
});

// The full publication list and native BibTeX disclosures work without JavaScript.
const filters = document.querySelector(".publication-filters");
const papers = [...document.querySelectorAll(".publication")];
const count = document.querySelector("#publication-count");
filters.hidden = false;
filters.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;
  const filter = button.dataset.filter;
  let visible = 0;
  for (const paper of papers) {
    paper.hidden = filter !== "all" && paper.dataset.venue !== filter;
    if (!paper.hidden) visible += 1;
  }
  for (const other of filters.querySelectorAll("button")) other.setAttribute("aria-pressed", String(other === button));
  const type = filter === "conference" ? "conference publications" : filter === "preprint" ? "preprints" : "publications";
  count.textContent = visible + " " + type;
  scheduleNavigationUpdate();
});

if (navigator.clipboard?.writeText) {
  for (const citation of document.querySelectorAll(".citation")) {
    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "copy-citation";
    copyButton.textContent = "Copy BibTeX";
    copyButton.setAttribute(
      "aria-label",
      citation.querySelector("summary").getAttribute("aria-label").replace("BibTeX citation:", "Copy BibTeX for")
    );
    citation.insertBefore(copyButton, citation.querySelector("pre"));
    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(citation.querySelector("code").textContent);
        document.querySelector("#copy-status").textContent =
          "Copied the citation for " + citation.closest(".publication").querySelector("h3").textContent + ".";
        copyButton.textContent = "Copied";
        window.setTimeout(() => {
          copyButton.textContent = "Copy BibTeX";
        }, 2000);
      } catch {
        document.querySelector("#copy-status").textContent = "Copy is unavailable in this browser. Select and copy the citation text below.";
      }
    });
  }
}

// Include the page bottom so the short Contact section can become current.
const navigationLinks = [...navigation.querySelectorAll('a[href^="#"]')];
const sections = navigationLinks.map((link) => document.querySelector(link.hash));
let navigationFrame = null;
function updateNavigation() {
  navigationFrame = null;
  let current = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= window.innerHeight * 0.3) current = section;
  }
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) current = sections.at(-1);
  for (const link of navigationLinks) {
    if (link.hash === "#" + current.id) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
}
function scheduleNavigationUpdate() {
  if (navigationFrame === null) navigationFrame = window.requestAnimationFrame(updateNavigation);
}
window.addEventListener("scroll", scheduleNavigationUpdate, { passive: true });
window.addEventListener("resize", scheduleNavigationUpdate);
for (const citation of document.querySelectorAll(".citation")) citation.addEventListener("toggle", scheduleNavigationUpdate);
scheduleNavigationUpdate();
