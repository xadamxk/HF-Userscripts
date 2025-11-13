// ==UserScript==
// @name        HFX Mobile
// @author      xadamxk
// @namespace   https://github.com/xadamxk/HFX-Mobile
// @version     1.2.0
// @description Enhance your mobile HF Experience!
// @match       https://hackforums.net/*
// @copyright   2022+
// @updateURL   https://github.com/xadamxk/HF-Userscripts/blob/master/HFX%20Mobile/HFX%20Mobile.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/blob/master/HFX%20Mobile/HFX%20Mobile.user.js
// ==/UserScript==
// ------------------------------ Changelog -----------------------------
// v1.2.0: Remove GM_config dependencies
// v1.1.1: Add Convo Resize feature
// v1.1.0: Add MobileThreadLists feature
// v1.0.0: Update and Download URLs, set default favorites
// v0.0.7: Add InteractivePostStats feature
// v0.0.7: Add Quick Unsubscribe feature
// v0.0.6: Add Thread Mentions feature
// v0.0.5: Add Posts on Thread feature
// v0.0.4: Add PMTrackingLinks feature
// v0.0.3: Add SearchYourThreads feature
// v0.0.2: Experimenting with settings library
// v0.0.1: Initial commit
// ------------------------------ Dev Notes -----------------------------
// Add /index.php and /forumdisplay.php?fid= to MobileThreadList
// If new update is available, prompt user (hideUpdateModal in configuration if they dont want to update)
// Features to add:
// List View Swipe Actions (Thread: short to quicklove, long to quote) - https://demo.mobiscroll.com/jquery/listview/swipe-actions
// Infiniscroll (rate limit)
// Expanded profile sections
// Character Counter
// PM From Post postbit button
// Theme changer (accent color + mosaic + logo)
// ------------------------------ SETTINGS ------------------------------
const debug = true;
const favoritesKey = "HFXM_FAVORITES";
const banReasonsKey = "HFXM_BAN_REASONS";
// ------------------------------ SCRIPT ------------------------------
const currentUrl = window.location.href;
dPrint(`Current URL: ${currentUrl}`);

// Global features
injectFavorites();

// Page features
switch (currentUrl) {
  case findPageMatch("/showthread.php?"):
    {
      injectCompactPosts();
      ingestInteractivePostStats();
      injectPostsOnThread();
      injectThreadMentions();
      injectQuickUnsubscribe();
    }
    break;
  case findPageMatch("/forumdisplay.php?"):
    {
      injectSearchYourThreads();
      injectMobileThreadListsForumDisplay();
    }
    break;
  case findPageMatch("/usercp.php"):
    {
      injectMobileThreadListsUserCP();
    }
    break;
  case findPageMatch("/private.php?action=tracking"):
    {
      injectPMTrackingLinks();
    }
    break;
  case findPageMatch("/search.php?action=results&sid="):
    {
      injectMobileThreadListsSearch();
    }
    break;
  case findPageMatch("/convo.php"):
    {
      injectAutoExpandConvoReply();
    }
    break;
  case findPageMatch("/member.php?action=profile"):
    {
      injectBanReason();
    }
    break;
}

// ------------------------------ FUNCTIONS: Settings ------------------------------
function dPrint(str) {
  return debug && console.log(`[HFXM] DEBUG: ${str}`);
}

function findPageMatch(term) {
  if (!term) return "";
  if (currentUrl && currentUrl.includes(term)) {
    return currentUrl;
  }
}
// ------------------------------ FUNCTIONS: CompactPosts ------------------------------
function injectCompactPosts() {
  if (window.innerWidth > 530) return; // Minimum screen width to trigger script

  const posts = document.getElementsByClassName("post");
  for (const post of posts) {
    const postAuthor = post.querySelector("div.post_wrapper > div.post_author");
    const opIcon = postAuthor.querySelector(
      'span[data-tooltip="Original Poster"]'
    ); // OP feather icon (only present on post #1)
    const postAuthorAvatar = postAuthor.querySelector("div.author_avatar"); // All author info
    const postAuthorInformation = postAuthor.querySelector(
      "div.author_information"
    ); // Username, usertitle, stars, userbar, awards
    const postAuthorAwards = postAuthor.querySelector("div.post_myawards"); // Awards
    postAuthorAwards.style.width = "100%";
    postAuthorAwards && postAuthorInformation.removeChild(postAuthorAwards); // Remove awards from author information
    const postAuthorStatistics = postAuthor.querySelector(
      "div.author_statistics"
    ); // Stats table
    postAuthorStatistics.style["border-bottom-style"] = "none"; // Remove default border
    postAuthorStatistics.style.margin = "0px"; // Reset default margin
    postAuthorStatistics.style.padding = "0px"; // Reset default padding

    // Remove OP Feather if present
    opIcon && postAuthor.removeChild(opIcon);
    // Remove avatar from post
    postAuthorAvatar && postAuthor.removeChild(postAuthorAvatar);
    // Remove author information
    postAuthorInformation && postAuthor.removeChild(postAuthorInformation);
    // Remove author stats table
    postAuthorStatistics && postAuthor.removeChild(postAuthorStatistics);

    // Append elements back
    // Left
    const avatarContainer = document.createElement("div");
    avatarContainer.appendChild(postAuthorAvatar);
    const authorInfoContainer = document.createElement("div");
    authorInfoContainer.appendChild(postAuthorInformation);
    const leftColumn = document.createElement("td");
    leftColumn.append(avatarContainer, authorInfoContainer);
    // Right
    const rightColumn = document.createElement("td");
    rightColumn.appendChild(postAuthorStatistics);

    // Rows
    const row1 = document.createElement("tr");
    row1.style.width = "100%";
    row1.append(leftColumn, rightColumn);

    const row2 = document.createElement("tr");
    row2.style.width = "100%";

    const awardColumn = document.createElement("td");
    awardColumn.setAttribute("colspan", "2");
    awardColumn.append(postAuthorAwards);
    row2.append(awardColumn);

    const tbody = document.createElement("tbody");
    tbody.append(row1);
    tbody.append(row2);

    const table = document.createElement("table");
    table.style.display = "table";
    table.style.width = "100%";
    table.append(tbody);
    postAuthorAwards.style["border-bottom"] = "1px dashed #232323";
    postAuthor.append(table);
  }
  // If URL contains post id, scroll to the post
  const pidUrlParam = getUrlParams().get("pid");
  if (pidUrlParam) {
    const urlPost = document.querySelector(`#post_${pidUrlParam}`);
    urlPost && urlPost.scrollIntoView(true);
  }
}
// ------------------------------ FUNCTIONS: Favorites ------------------------------
function createFavoriteElements(favorites) {
  if (!favorites) return [];
  return Object.entries(favorites).map((entry, index) => {
    const [url, text] = entry;
    const isActive = currentUrl == url;
    return `<a href='${url}' style='margin:0px 2px;'><button style='padding:5px; font-weight:600;${
      isActive ? "background-color:#1d1d1d;" : ""
    }'>${text}</button></a>`;
  });
}

function getBreadcrumbText() {
  const breadcrumb = document.getElementsByClassName("breadcrumb")[0];
  const currentPage = breadcrumb.querySelector("a:last-of-type").textContent;
  dPrint(`Current breadcrumb page: ${currentPage}`);
  return currentPage || "";
}

function promptForFavoriteText(currentPage) {
  return prompt("Favorite label for current page:", currentPage);
}

function storeFavorites(favorites) {
  localStorage.setItem(favoritesKey, JSON.stringify(favorites));
}

function retrieveFavorites() {
  try {
    return JSON.parse(localStorage.getItem(favoritesKey));
  } catch (err) {
    dPrint("retrieveFavorites: failed to parse favorites.");
    return {};
  }
}

function injectFavorites() {
  let favorites = retrieveFavorites();
  dPrint(`Favorites: ${JSON.stringify(favorites)}`);

  const isFavorite = favorites ? favorites[currentUrl] : false;
  dPrint(`Is current page favorite: ${isFavorite}`);

  const toggleText = isFavorite ? "Remove" : "Add";
  const toggleFavoriteElement = `<a onclick="return false;" id="HFXMFavoriteToggle" style='float:right; margin:0px 2px;'><button style='padding:5px'>${toggleText}</button></a>`;
  const favoriteElements = createFavoriteElements(favorites).join("");

  // Append favorites row
  const logoElement = document.getElementById("logo");
  logoElement.insertAdjacentHTML(
    "beforeend",
    `<div style='text-align:left; margin:auto;'>${favoriteElements} ${toggleFavoriteElement}</div>`
  );

  // Add/Remove button event listener
  document
    .getElementById("HFXMFavoriteToggle")
    .addEventListener("click", () => {
      if (isFavorite) {
        delete favorites[currentUrl];
      } else {
        // Default favorite text to current page per breadcrumb - allow override
        const favoriteText = promptForFavoriteText(getBreadcrumbText());
        if (!favoriteText) {
          return;
        }
        if (favorites) {
          favorites[currentUrl] = favoriteText;
        } else {
          favorites = { [currentUrl]: favoriteText };
        }
      }
      dPrint(`Updated favorites: ${JSON.stringify(favorites)}`);
      storeFavorites(favorites);
      // Reload page so UI doesn't have to be updated
      if (confirm("Reload page to update favorites?")) {
        location.reload();
      }
    });
}
// ------------------------------ FUNCTIONS: SearchYourThreads ------------------------------
function injectSearchYourThreads() {
  const fid = window.location.href.split("fid=")[1];
  const welcomeUser = document
    .getElementById("panel")
    .querySelector("span.welcome > strong > a");
  const userID = welcomeUser.getAttribute("href").split("&uid=")[1];
  const username = welcomeUser.innerText;

  // Append button
  const forumActionsContainer = document
    .getElementById("content")
    .querySelector("td.thead > div.float_right > span.smalltext > strong");
  forumActionsContainer.insertAdjacentHTML(
    "beforeend",
    `&nbsp;&nbsp;|&nbsp;&nbsp;<form method="post" action="search.php" style="display:inline">
        <input type="hidden" name="action" value="do_search">
        <input type="hidden" name="matchusername" value="1">
        <input type="hidden" name="forums" value="${fid}">
        <input type="hidden" name="threadprefix" value="any">
        <input type="hidden" name="showresults" value="threads">
        <input type="hidden" name="author" value="${username}">
        <button type="submit" class="" name="submit" title="Search Your Threads" style=" background: initial; border: initial; padding: initial; color: white; "><i class="fas fa-user-edit fa-lg"></i></button>
    </form>`
  );
}
// ------------------------------ FUNCTIONS: PMTrackingLinks ------------------------------
function getTrackingTableByText(tableHeaderStr) {
  const tables =
    document.getElementById("content").querySelectorAll("table.tborder") || [];
  return Array.from(tables).find((table) => {
    const tableHeader = table.querySelector(
      "tbody > tr > td > strong"
    ).innerText;
    return tableHeader.includes(tableHeaderStr);
  });
}

function linkMessageTitles(table) {
  if (!table) return;

  const rowsNodeList = table.querySelectorAll("tbody > tr");
  const rows = Array.from(rowsNodeList);
  rows.map((row, index) => {
    // First 2 rows and last row are not messages
    if (index < 2 || index == rows.length - 1) return row;
    // Everything else will be a message with a title that needs linking
    const columns = row.querySelectorAll("td");
    const titleTd = columns[1];
    const checkbox = columns[4].querySelector("input");
    const readCheckId = checkbox.getAttribute("name").replace(/\D/g, "");
    const messageId = parseInt(readCheckId) + 1; // message id is always 1 greater than the readcheck id

    // Clear existing title
    const pmTitle = titleTd.innerHTML;
    titleTd.innerHTML = "";
    titleTd.insertAdjacentHTML(
      "beforeend",
      `<a href="https://hackforums.net/private.php?action=read&pmid=${messageId}">${pmTitle}</a>`
    );
    return row;
  });
}

function injectPMTrackingLinks() {
  // Read table
  const readTable = getTrackingTableByText("Read Messages");
  linkMessageTitles(readTable);
  // Unread table
  const unreadTable = getTrackingTableByText("Unread Messages");
  linkMessageTitles(unreadTable);
}
// ------------------------------ FUNCTIONS: PostsOnThread ------------------------------
function getUrlParams() {
  const queryString = window.location.search;
  return new URLSearchParams(queryString);
}

function getBreadcrumbThreadId() {
  const breadcrumb = document.getElementsByClassName("breadcrumb")[0];
  return breadcrumb
    .querySelector("a:last-of-type")
    .getAttribute("href")
    .split("?tid=")[1];
}

function injectPostsOnThread() {
  const threadId = getUrlParams().get("tid");
  const posts = document.getElementsByClassName("post");
  if (!posts) return;

  for (const [index, post] of Array.from(posts).entries()) {
    const postAuthor = post.querySelector("div.post_wrapper > div.post_author");
    const authorProfile = postAuthor
      .querySelector("div.author_information > strong > span.largetext > a")
      .getAttribute("href");
    const userId = authorProfile.split("&uid=")[1];
    const authorButtons = post.querySelector(".author_buttons");
    authorButtons.insertAdjacentHTML(
      "beforeend",
      `
        <a id="HFXMPostsOnThread${index}" class="postbit_quote" href="/showthread.php?tid=${
        threadId || getBreadcrumbThreadId()
      }&mode=single&uid=${userId}" data-tooltip="Posts on Thread">
          <span>
            <i class="fa fa-file-signature fa-lg" aria-hidden="true"></i>
          </span>
        </a>`
    );
  }
}
// ------------------------------ FUNCTIONS: ThreadMentions ------------------------------
function appendMentionToInput(userId) {
  if (!userId) return;

  const textarea = document.getElementById("message");
  textarea.value = textarea.value + `[mention=${userId}] `;
  textarea.scrollIntoView(true);
  textarea.focus();
}

function injectThreadMentions() {
  const posts = document.getElementsByClassName("post");
  const postInput = document.getElementById("message");
  if (!posts || !postInput) return;

  for (const [index, post] of Array.from(posts).entries()) {
    const postAuthor = post.querySelector("div.post_wrapper > div.post_author");
    const authorProfile = postAuthor
      .querySelector("div.author_information > strong > span.largetext > a")
      .getAttribute("href");
    const userId = authorProfile.split("&uid=")[1];
    const postManagementButtons = post.querySelector(
      ".post_management_buttons"
    );
    postManagementButtons.insertAdjacentHTML(
      "afterbegin",
      `
              <a class="hfxm-user-mention postbit_quote" href="#" id="HFXMUserMention${index}" data-tooltip="Mention User" onclick="event.preventDefault()">
        <span style="padding-top:5px">
          <i class="fa fa-tag fa-lg" aria-hidden="true"></i>
        </span>
      </a>`
    );
    document
      .getElementById(`HFXMUserMention${index}`)
      .addEventListener("click", () => {
        appendMentionToInput(userId);
      });
  }
}
// ------------------------------ FUNCTIONS: QuickUnsubscribe ------------------------------
function getUserPostKey() {
  return (
    document
      .querySelector("head")
      .innerHTML.match(/my_post_key = "([a-f0-9]+)"/)
      .pop() || null
  );
}

function injectQuickUnsubscribe() {
  const unsubscribeElement = document.querySelector(".subscription_remove");
  if (!unsubscribeElement) return;

  unsubscribeElement.insertAdjacentHTML(
    "afterend",
    `
    <li>
        <i class="fa fa-sign-out-alt" style="font-family:Font Awesome 5 Pro; font-size: 11px; right: 5px; position: relative; font-weight: 900;"></i>
        <a href="javascript:void(0)" title="HFXM: Quick Unsubscribe" id="HFXMQuickUnsubscribe">Quick Unsubscribe</a>
    </li>
    `
  );
  document
    .getElementById(`HFXMQuickUnsubscribe`)
    .addEventListener("click", async () => {
      var data = new FormData();
      data.append("action", "removesubscription");
      data.append("my_post_key", getUserPostKey());
      data.append("tid", getBreadcrumbThreadId());
      await fetch(`${window.location.origin}/usercp2.php?ajax=1`, {
        method: "POST",
        body: data,
      })
        .then((data) => {
          location.reload();
        })
        .catch((err) => {
          dPrint("Failed to unsubscribe from thread.");
        });
    });
}
// ------------------------------ FUNCTIONS: InteractivePostStats ------------------------------
function ingestInteractivePostStats() {
  const threadId = getUrlParams().get("tid");
  const posts = document.getElementsByClassName("post");
  if (!posts) return;

  for (const [index, post] of Array.from(posts).entries()) {
    const authorStatTable = post.querySelector(
      "div.author_statistics > div.author_wrapper"
    );
    const statRows = authorStatTable.querySelectorAll("div.author_row");
    const postAuthor = post.querySelector("div.post_wrapper > div.post_author");
    const authorProfile = postAuthor
      .querySelector("div.author_information > strong > span.largetext > a")
      .getAttribute("href");
    const userId = authorProfile.split("&uid=")[1];
    const postId = post.getAttribute("id").replace("post_", "");
    statRows.forEach((stat) => {
      const label = stat
        .querySelector("div.author_label")
        .innerHTML.toLowerCase();
      const value = stat.querySelector("div.author_value");
      const valueText = value.innerHTML;
      // New interactive post value element
      const newValue = document.createElement("div");
      newValue.classList.add("author_value");
      switch (label) {
        case "posts:":
          {
            newValue.insertAdjacentHTML(
              "beforeend",
              `<a href=https://hackforums.net/search.php?action=finduser&uid=${userId}>${valueText}</a>`
            );
            value.replaceWith(newValue);
          }
          break;
        case "threads:":
          {
            newValue.insertAdjacentHTML(
              "beforeend",
              `<a href=https://hackforums.net/search.php?action=finduserthreads&uid=${userId}>${valueText}</a>`
            );
            value.replaceWith(newValue);
          }
          break;
        case "βytes:":
          {
            for (const child of value.childNodes) {
              // Byte total is a text node and includes space at beginning of value. ie. " 398"
              if (child.nodeType === Node.TEXT_NODE) {
                newValue.insertAdjacentHTML(
                  "beforeend",
                  `<a style="padding-left:5px;" href="https://hackforums.net/myps.php?action=history&uid=${userId}">${child.nodeValue}</a>`
                );
                child.replaceWith(newValue);
              }
            }
          }
          break;
      }
    });
    // Append join date
    const joinDate = post
      .querySelector("div.author_avatar > a")
      .getAttribute("data-tooltip")
      .replace("Joined ", "");
    const joinDateStat = document.createElement("div");
    joinDateStat.classList.add("author_row");
    joinDateStat.insertAdjacentHTML(
      "beforeend",
      `<div class="author_label">Join Date:</div>`
    );
    joinDateStat.insertAdjacentHTML(
      "beforeend",
      `<div class="author_value">${joinDate ?? "N/A"}</div>`
    );
    authorStatTable.append(joinDateStat);
  }
}
// ------------------------------ FUNCTIONS: MobileForumDisplay ------------------------------
function getRelativeTime(timestampInSeconds) {
  if (!timestampInSeconds) return "-";
  const msPerMin = 60;
  const msPerHour = msPerMin * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const nowInSeconds = new Date().getTime() / 1000;
  let elapsed = nowInSeconds - parseInt(timestampInSeconds); // seconds to ms
  if (elapsed < msPerMin) {
    return "<1m";
  } else if (elapsed < msPerHour) {
    return `${Math.floor(elapsed / msPerMin)}m`;
  } else if (elapsed < msPerDay) {
    return `${Math.floor(elapsed / msPerHour)}h`;
  } else if (elapsed < msPerMonth) {
    return `${Math.floor(elapsed / msPerDay)}d`;
  } else if (elapsed < msPerYear) {
    return `${Math.floor(elapsed / msPerMonth)}M`;
  } else {
    return `${Math.floor(elapsed / msPerYear)}Y`;
  }
  return "-";
}

function formatViewCount(viewCountStr) {
  if (!viewCountStr) return "-";

  const viewCount = parseFloat(viewCountStr.replaceAll(",", ""));
  if (viewCount < 1000) {
    return viewCount;
  } else if (viewCount < 1000000) {
    return `${(viewCount / 1000).toFixed(1)}k`;
  } else if (viewCount < 10000000) {
    return `${(viewCount / 1000000).toFixed(1)}m`;
  } else if (viewCount > 1000000000) {
    return `∞`;
  }
  return "-";
}

function reformatDumbDate(dateStr) {
  if (!dateStr) return;
  try {
    // ie. October 11th, 2022, 06:26 AM
    // new Date() can't parse ordinal endings, so remove them.
    const newDateStr = dateStr
      .replace("st", "")
      .replace("nd", "")
      .replace("rd", "")
      .replace("th", "");
    return new Date(newDateStr).getTime() / 1000;
  } catch (err) {
    console.log(err);
    return;
  }
}

function determineThreadStatusLink(threadStatusElement) {
  const iconClasses = Array.from(threadStatusElement.classList);
  if (
    iconClasses.includes("newfolder") ||
    iconClasses.includes("dot_newfolder") ||
    iconClasses.includes("dot_newhotfolder") ||
    iconClasses.includes("newhotfolder")
  ) {
    return "&action=newpost";
  } else {
    return "&action=lastpost";
  }
}

function reformatThreadRows(threadRows, includesForumColumn = false) {
  let repliesColumnIndex = 3;
  let viewsColumnIndex = 4;
  let lastPostColumnIndex = 5;
  if (includesForumColumn) {
    repliesColumnIndex++; // = 4;
    viewsColumnIndex++; // = 5;
    lastPostColumnIndex++; // = 6;
  }
  //
  threadRows.forEach((row) => {
    // Get content from new thread row
    const threadStatusIcon = row.querySelector(
      "td:nth-child(1) > span.thread_status"
    );
    threadStatusIcon.style.width = "30px";
    threadStatusIcon.style.height = "30px";
    threadStatusIcon.style.fontSize = "28px";
    const repliesCount = row.querySelector(
      `td:nth-child(${repliesColumnIndex}) > a`
    );
    const forumColumn = row.querySelector(`td:nth-child(3) > a`);
    const viewsCount =
      row.querySelector(`td:nth-child(${viewsColumnIndex}) > span`)
        ?.innerHTML ||
      row.querySelector(`td:nth-child(${viewsColumnIndex})`)?.innerHTML; // ForumDisplay or UserCP
    // Recent threads use smart time to show relative timestamps
    const recentLastPost = row.querySelector(
      `td:nth-child(${lastPostColumnIndex}) > span.smalltext > span.smart-time`
    );
    const recentLastPostSeconds =
      recentLastPost && recentLastPost.getAttribute("data-timestamp");
    // Old threads use string to show absolute timestamp
    const oldLastPost = row.querySelector(
      `td:nth-child(${lastPostColumnIndex}) > span.smalltext`
    )?.firstChild;
    const oldLastPostText = oldLastPost?.textContent;
    const oldLastPostSeconds = reformatDumbDate(oldLastPostText);
    // Use whichever timestamp exists (recent vs old)
    const lastPostTimestamp = recentLastPostSeconds || oldLastPostSeconds;
    const mobileColumn =
      row.querySelector(
        "td:nth-child(2) > div.mobile-link > div.mobile-link-truncate"
      ) || row.querySelector("td:nth-child(2)");
    // Prefer the explicit subject span if present, otherwise fall back to the anchor
    const subjectSpan =
      mobileColumn.querySelector("span[id^='tid_']") ||
      mobileColumn.querySelector("span.subject_old") ||
      mobileColumn.querySelector("span.subject_new");
    const threadAnchor =
      subjectSpan?.querySelector("a") ||
      mobileColumn.querySelector('a[href*="showthread.php?tid="]') ||
      mobileColumn.querySelector('a:not([title="Go to first unread post"])');
    const threadTitle = subjectSpan || threadAnchor;
    const threadLink = threadAnchor?.getAttribute("href");
    // Capture optional prefix: support .prefix or sibling span before subject (e.g., group classes like group7)
    const threadPrefix =
      mobileColumn.querySelector("span.prefix") ||
      (() => {
        const wrapper = subjectSpan?.parentElement;
        if (!wrapper) return null;
        const candidate = Array.from(wrapper.children).find(
          (el) =>
            el.tagName === "SPAN" &&
            el !== subjectSpan &&
            !el.classList.contains("smalltext")
        );
        return candidate || null;
      })();
    const author =
      mobileColumn.querySelector("div.author > a") ||
      mobileColumn.querySelector("span.smalltext > a");
    const relativeLastPost = getRelativeTime(lastPostTimestamp);
    // Delete row contents
    row.innerHTML = "";

    // Build new thread row
    // Author row
    const authorRow = document.createElement("div");
    authorRow.classList.add("author");
    authorRow.classList.add("smalltext");
    authorRow.append(author);
    // Author row - post count
    const postCount = document.createElement("span");
    postCount.style.marginLeft = "10px";
    postCount.insertAdjacentHTML(
      "beforeend",
      `<i class="fa fa-comment" aria-hidden="true" style="padding-right:3px;"></i>`
    );
    postCount.append(repliesCount);
    authorRow.append(postCount);
    // Author row - views
    const viewCount = document.createElement("span");
    viewCount.style.marginLeft = "10px";
    viewCount.insertAdjacentHTML(
      "beforeend",
      `<i class="fa fa-eye" aria-hidden="true" style="padding-right:3px;"></i>`
    );
    viewCount.append(formatViewCount(viewsCount));
    authorRow.append(viewCount);
    // Author row - Last Post Timestamp
    const lastPost = document.createElement("span");
    lastPost.style.marginLeft = "10px";
    lastPost.insertAdjacentHTML(
      "beforeend",
      `<i class="fa fa-clock" aria-hidden="true" style="padding-right:3px;"></i>`
    );
    lastPost.append(relativeLastPost);
    authorRow.append(lastPost);
    // Adv details row
    const advDetailsRow = document.createElement("div");
    threadPrefix && advDetailsRow.append(threadPrefix);
    includesForumColumn && forumColumn && advDetailsRow.append(forumColumn);
    // Add thread title/author row to thread column
    const newThreadColumn = document.createElement("td");
    newThreadColumn.setAttribute("colspan", 4);
    newThreadColumn.classList.add("trow2");
    newThreadColumn.append(advDetailsRow);
    newThreadColumn.append(threadTitle);
    newThreadColumn.append(authorRow);
    // Add thread column to thread row
    row.append(newThreadColumn);
    // Add thread status to status column
    const newStatusColumn = document.createElement("td");
    newThreadColumn.colspan = 1;
    newStatusColumn.classList.add("trow2");
    const threadStatusLink = document.createElement("a");
    threadStatusLink.setAttribute(
      "href",
      `/${threadLink}${determineThreadStatusLink(threadStatusIcon)}`
    );
    threadStatusLink.append(threadStatusIcon);
    newStatusColumn.append(threadStatusLink);
    // Add status column to thread row
    row.append(newStatusColumn);
  });
}

function injectMobileThreadListsForumDisplay() {
  if (window.innerWidth > 768) return; // Minimum screen width to trigger script

  const content = document.querySelector("#content");
  const threadRows = content.querySelectorAll("tr.inline_row");
  reformatThreadRows(threadRows);
}

function injectMobileThreadListsUserCP() {
  if (window.innerWidth > 768) return; // Minimum screen width to trigger script

  const desiredTableHeaderTitles = [
    "Thread Subscriptions With New Posts",
    "Threads",
  ];

  const summaryPanel = document.querySelector(
    "#content > div.wrapper-content > div.oc-container > div.oc-item:nth-child(2)"
  );
  const desiredTableHeaders = Array.from(
    summaryPanel.querySelectorAll("strong")
  ).filter((el) =>
    desiredTableHeaderTitles.some((text) => text === el.textContent)
  );
  const desiredTables = desiredTableHeaders.map(
    (tableHeader) =>
      tableHeader.parentElement.parentElement.parentElement.parentElement
  );
  const desiredRows = desiredTables.reduce((savedThreadRows, table) => {
    const rows = table.querySelectorAll("tr");
    const threadRows = Array.from(rows).filter((row, index) => index > 1); // First and second row are not thread rows
    return savedThreadRows.concat(threadRows);
  }, []);
  reformatThreadRows(desiredRows);
}

function injectMobileThreadListsSearch() {
  if (window.innerWidth > 768) return; // Minimum screen width to trigger script

  const desiredTableHeaderTitles = ["Search Results"];

  const content = document.querySelector("#content");
  const desiredTableHeaders = Array.from(
    content.querySelectorAll("strong")
  ).filter((el) =>
    desiredTableHeaderTitles.some((text) => text === el.textContent)
  );
  const desiredTables = desiredTableHeaders.map(
    (tableHeader) =>
      tableHeader.parentElement.parentElement.parentElement.parentElement
  );
  const desiredRows = desiredTables.reduce((savedThreadRows, table) => {
    const rows = table.querySelectorAll("tr");
    const threadRows = Array.from(rows).filter((row, index) => index > 1); // First and second row are not thread rows
    return savedThreadRows.concat(threadRows);
  }, []);
  reformatThreadRows(desiredRows, true);
}
// ------------------------------ FUNCTIONS: AutoExpandConvoReply ------------------------------
function injectAutoExpandConvoReply() {
  const messageHistory = document.querySelector("#message-convo");
  const defaultHistoryHeight =
    parseInt(getComputedStyle(messageHistory).height.replace("px", "")) || 0;

  const convoControlRow = document.querySelector("#convoControlsRow");
  const defaultInputHeight =
    parseInt(getComputedStyle(convoControlRow).height.replace("px", "")) || 0;

  // On input, check if control row height needs to be increased
  const convoInput = document.querySelector("#comment");
  convoInput.addEventListener("input", () => {
    // If input is greater than viewable height, subtract difference from convo history height
    if (convoInput.clientHeight > defaultInputHeight) {
      const heightDifference = convoInput.clientHeight - defaultInputHeight;
      messageHistory.style.height = `${
        defaultHistoryHeight - heightDifference
      }px`;
    } else if (convoInput.clientHeight < defaultInputHeight) {
      // input fits in default view, reset convo history height
      messageHistory.style.height = `${defaultHistoryHeight}px`;
    }
  });
  // On convo submit, reset height changes
  const sendConvoForm = document.querySelector("#new_message");
  sendConvoForm.addEventListener(
    "submit",
    () => {
      messageHistory.style.height = `${defaultHistoryHeight}px`;
    },
    false
  );
}
// ------------------------------ FUNCTIONS: BanReason ------------------------------
async function injectBanReason() {
  const storedReasons = retrieveStoredBanReasons();
  const profileUserId = getProfileUserId();
  const isBanned = isUserBanned();
  if (!isBanned) {
    console.log(`User ${profileUserId} is not banned`);
    return;
  }
  const banReason = storedReasons[profileUserId];
  if (banReason) {
    console.log(`Ban reason found in cache for user ${profileUserId}`);
    appendBanReason(banReason);
  } else {
    console.log(
      `Ban reason not found in cache for user ${profileUserId}, querying...`
    );
    const banReasons = await queryBanReasons();
    storeBanReasons(banReasons);
    if (profileUserId in banReasons) {
      appendBanReason(banReasons[profileUserId]);
    }
  }
}

function retrieveStoredBanReasons() {
  const storedReasons = localStorage.getItem(banReasonsKey);
  if (!storedReasons) return {};
  return JSON.parse(storedReasons);
}

function storeBanReasons(banReasons) {
  localStorage.setItem(banReasonsKey, JSON.stringify(banReasons));
}

async function queryBanReasons() {
  const url = "https://hackforums.net/bans.php";
  try {
    const response = await fetch(url, { credentials: "include" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const rows = Array.from(
      doc.querySelectorAll("table.tborder tr.mobile-no-padding")
    );

    const banMap = {};

    rows.forEach((row) => {
      const usernameLink = row.querySelector("td:nth-child(1) a[href*='uid=']");
      if (!usernameLink) return;

      const uidParam = new URL(usernameLink.href).searchParams.get("uid");
      const uid = parseInt(uidParam || "0", 10);
      if (!uid) return;

      // const username = (usernameLink.textContent || "").trim();

      const reasonCell = row.querySelector("td:nth-child(2)");
      const banReasonText = (
        reasonCell?.innerText ||
        reasonCell?.textContent ||
        ""
      )
        .replace(/\u00A0/g, " ")
        .trim();

      const bannedByLink = row.querySelector("td:nth-child(3) a[href*='uid=']");
      let bannedByUID = 0;
      let bannedByUsername = "";
      if (bannedByLink) {
        const staffUidParam = new URL(bannedByLink.href).searchParams.get(
          "uid"
        );
        bannedByUID = parseInt(staffUidParam || "0", 10);
        bannedByUsername = (bannedByLink.textContent || "").trim();
      } else {
        const bannedByCell = row.querySelector("td:nth-child(3)");
        bannedByUsername = (
          bannedByCell?.innerText ||
          bannedByCell?.textContent ||
          ""
        )
          .replace(/\u00A0/g, " ")
          .trim();
      }

      const bannedAtRaw = row
        .querySelector("td:nth-child(4)")
        ?.textContent?.trim();
      const unbanRaw = row
        .querySelector("td:nth-child(5)")
        ?.textContent?.trim();

      const bannedAt = formatBanDateString(bannedAtRaw || "");
      const expiresAt = formatUnbanDateString(unbanRaw || "");

      banMap[uid] = {
        banReason: banReasonText,
        bannedByUID,
        bannedByUsername,
        bannedAt,
        expiresAt,
      };
    });

    return banMap;
  } catch (e) {
    console.error("Failed to parse ban reasons");
    return {};
  }
}

function appendBanReason(banReason) {
  const firstCard = document.querySelector(
    ".pro-adv-content-info > .pro-adv-card"
  );
  if (!firstCard) return;

  const existing = firstCard.querySelector("[data-hfx-ban-reason='true']");
  if (existing) existing.remove();

  const block = document.createElement("div");
  block.setAttribute("data-hfx-ban-reason", "true");
  block.className = "smalltext";

  const wrapper = document.createElement("div");
  wrapper.setAttribute("style", "padding: 4px 12px; margin-top: 8px;");

  const hr = document.createElement("hr");
  hr.setAttribute("style", "margin: 6px 0;");
  wrapper.appendChild(hr);

  const title = document.createElement("div");
  title.innerHTML = "<strong>Ban Information</strong>";
  wrapper.appendChild(title);

  const reasonEl = document.createElement("div");
  reasonEl.innerHTML = `<strong>Reason:</strong> ${escapeHtml(
    banReason.banReason
  )}`;
  wrapper.appendChild(reasonEl);

  const bannedByEl = document.createElement("div");
  const bannedByLink = banReason.bannedByUID
    ? `<a href="https://hackforums.net/member.php?action=profile&uid=${
        banReason.bannedByUID
      }">${escapeHtml(banReason.bannedByUsername)}</a>`
    : escapeHtml(banReason.bannedByUsername || "");
  bannedByEl.innerHTML = `<strong>Banned By:</strong> ${bannedByLink}`;
  wrapper.appendChild(bannedByEl);

  const bannedAtEl = document.createElement("div");
  bannedAtEl.innerHTML = `<strong>Ban Date:</strong> ${escapeHtml(
    banReason.bannedAt || ""
  )}`;
  wrapper.appendChild(bannedAtEl);

  const unbanEl = document.createElement("div");
  unbanEl.innerHTML = `<strong>Unban Date:</strong> ${escapeHtml(
    banReason.expiresAt || ""
  )}`;
  wrapper.appendChild(unbanEl);

  block.appendChild(wrapper);
  firstCard.appendChild(block);
}

function formatBanDateString(text) {
  const trimmed = (text || "").trim();
  if (!trimmed) return "";
  const lower = trimmed.toLowerCase();
  if (lower === "today" || lower === "yesterday") {
    const now = new Date();
    const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (lower === "yesterday") base.setDate(base.getDate() - 1);
    return base.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  return trimmed;
}

function formatUnbanDateString(text) {
  const trimmed = (text || "").trim();
  if (!trimmed) return "";
  if (trimmed.toLowerCase() === "never") return "Never";
  return formatBanDateString(trimmed);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text || "";
  return div.innerHTML;
}

function isUserBanned() {
  const container = document.querySelector(".pro-adv-content-info");
  if (!container) return null;

  const firstCard = container.querySelector(":scope > .pro-adv-card");
  if (!firstCard) return null;

  const bannedUserGroupElement = firstCard.querySelector(".largetext .group7");
  return bannedUserGroupElement !== null;
}

function getProfileUserId() {
  return (
    parseInt(
      new URL(window.location.href).searchParams.get("uid") || "0",
      10
    ) || 0
  );
}
