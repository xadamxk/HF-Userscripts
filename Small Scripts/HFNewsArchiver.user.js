// ==UserScript==
// @name        HF News Archiver
// @author      xadamxk
// @namespace   https://github.com/xadamxk/HF-Scripts
// @version     0.0.1
// @description Helps archive HF News Threads
// @match       *://hackforums.net/showthread.php?tid=*
// @copyright   2025+
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==
// ------------------------------ Changelog -----------------------------
// v 0.0.1: Initial release
// ------------------------------ Dev Notes -----------------------------
//
// ------------------------------ SETTINGS ------------------------------
// ------------------------------- SCRIPT -------------------------------

(function () {
  "use strict";

  function getTid() {
    const url = new URL(window.location.href);
    return url.searchParams.get("tid");
  }

  function getCanonicalThreadUrl(tid) {
    return `${location.origin}/showthread.php?tid=${tid}`;
  }

  function getThreadTitle() {
    // article > table > tbody > tr > td.thead > (2nd div) > h1
    const specific = document.querySelector(
      "article table td.thead > div:nth-of-type(2) > h1"
    );
    if (specific && specific.textContent) return specific.textContent.trim();
    const fallback = document.querySelector("td.thead h1");
    if (fallback && fallback.textContent) return fallback.textContent.trim();
    return document.title.trim();
  }

  function appendArchiveButton() {
    const breadcrumb = document.querySelector(".breadcrumb");
    if (!breadcrumb) return;
    if (document.getElementById("hfna-archive-btn")) return;

    const button = document.createElement("button");
    button.id = "hfna-archive-btn";
    button.type = "button";
    button.textContent = "Archive";
    button.style.marginLeft = "8px";
    button.style.padding = "2px 8px";
    button.style.cursor = "pointer";

    button.addEventListener("click", () => {
      const editionInput = prompt(
        "Enter HF News edition number (e.g., 1 or 1.1):",
        ""
      );
      if (editionInput === null) return; // cancelled
      const edition = String(editionInput).trim();
      if (!edition) return;

      const tid = getTid();
      const canonicalUrl = getCanonicalThreadUrl(tid);
      const title = getThreadTitle();

      try {
        const MAP_KEY = "HFNewsArchiver:archives";
        const existing = GM_getValue(MAP_KEY, {});
        const archiveMap =
          existing && typeof existing === "object" ? existing : {};
        archiveMap[edition] = { edition, tid, url: canonicalUrl, title };
        GM_setValue(MAP_KEY, archiveMap);
        alert("HF News archived.");
      } catch (err) {
        console.error("HFNewsArchiver: failed to save", err);
        alert("Failed to save archive data.");
      }
    });

    breadcrumb.insertAdjacentElement("afterend", button);
  }

  appendArchiveButton();
})();
