// ==UserScript==
// @name        HFX Mobile
// @author      xadamxk
// @namespace   https://github.com/xadamxk/HFX-Mobile
// @require     https://github.com/sizzlemctwizzle/GM_config/raw/master/gm_config.js
// @version     1.0.1
// @description Enhance your mobile HF Experience!
// @match       https://hackforums.net/*
// @copyright   2022+
// @updateURL   https://github.com/xadamxk/HF-Userscripts/blob/master/HFX%20Mobile/HFX%20Mobile.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/blob/master/HFX%20Mobile/HFX%20Mobile.user.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_log
// @grant       GM_info
// ==/UserScript==
// ------------------------------ Changelog -----------------------------
// v1.0.1: Add MobileThreadLists feature
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
// If new update is available, prompt user (hideUpdateModal in configuration if they dont want to update)
// Features to add:
// List View Swipe Actions (Thread: short to quicklove, long to quote) - https://demo.mobiscroll.com/jquery/listview/swipe-actions
// Infiniscroll (rate limit)
// Expanded profile sections
// Character Counter
// PM From Post postbit button
// Redesign forum thread list (remove pagination and replace with action=lastpost/action=newpost)
// Theme changer (accent color + mosaic + logo)
// ------------------------------ SETTINGS ------------------------------
const debug = false;
// ------------------------------ SCRIPT ------------------------------
const currentUrl = window.location.href;
dPrint(`Current URL: ${currentUrl}`);

initializeSettings();
appendHFXMSettings();

// Global features
GM_config.get('enableFavorites') && injectFavorites();

// Page features
switch (currentUrl) {
    case findPageMatch('/showthread.php?'): {
        GM_config.get('enableCompactPosts') && injectCompactPosts();
        GM_config.get('enableInteractivePostStats') && ingestInteractivePostStats();
        GM_config.get('enablePostsOnThread') && injectPostsOnThread();
        GM_config.get('enableThreadMentions') && injectThreadMentions();
        GM_config.get('enableQuickUnsubscribe') && injectQuickUnsubscribe();
    };
        break;
    case findPageMatch('/forumdisplay.php?'): {
        GM_config.get('enableSearchYourThreads') && injectSearchYourThreads();
        GM_config.get('enableMobileThreadLists') && injectMobileThreadListsForumDisplay();
    };
        break;
    case findPageMatch('/usercp.php'): {
        GM_config.get('enableMobileThreadLists') && injectMobileThreadListsUserCP();
    };
        break;
    case findPageMatch('/private.php?action=tracking'): {
        GM_config.get('enablePMTrackingLinks') && injectPMTrackingLinks();
    };
        break;
}

// ------------------------------ FUNCTIONS: Settings ------------------------------
function dPrint(str) {
    return debug && console.log(`[HFXM] DEBUG: ${str}`);
}

function initializeSettings() {
    //const recentChanges = getRecentChanges();
    var defaultConfiguration = {
        'enableFavorites': {
            'label': 'Favorites',
            'section': ['Global Features', 'All Pages'],
            'title': 'Adds favorites to the HF header.',
            'type': 'checkbox',
            'default': true,
        },
        'favorites': {
            'label': '',
            'title': '',
            'type': 'text',
            'default': '{"https://hackforums.net/usercp.php":"UserCP", "https://hackforums.net/forumdisplay.php?fid=25":"Lounge", "https://hackforums.net/forumdisplay.php?fid=2":"RANF"}',
            'type': 'hidden'
        },
        'enableMobileThreadLists': {
            'label': 'Reformat thread lists in forums, search, and usercp.',
            'title': 'Reformats threads to be easier to navigate on mobile.',
            'type': 'checkbox',
            'default': true
        },
        'enableCompactPosts': {
            'label': 'Compact Posts',
            'section': ['Thread Features', '/showthread.php'],
            'title': 'Condense author information in posts.',
            'type': 'checkbox',
            'default': true
        },
        'enableInteractivePostStats': {
            'label': 'Interactive Post Stats',
            'title': 'Hyperlink post stat values.',
            'type': 'checkbox',
            'default': true
        },
        'enablePostsOnThread': {
            'label': `Posts on Thread (Postbit Button)`,
            'title': 'See all posts of user on current thread.',
            'type': 'checkbox',
            'default': true
        },
        'enableThreadMentions': {
            'label': `Thread Mentions (Postbit Button)`,
            'title': 'Mention user in thread reply.',
            'type': 'checkbox',
            'default': true
        },
        'enableQuickUnsubscribe': {
            'label': `Quick Unsubscribe (Removes all thread subscriptions)`,
            'title': 'Remove all thread subscriptions with a single click.',
            'type': 'checkbox',
            'default': true
        },
        'enablePMTrackingLinks': {
            'label': 'PM Tracking Links',
            'section': ['Private Message Features', '/private.php'],
            'title': 'Links message titles to their corresponding linked PM.',
            'type': 'checkbox',
            'default': true
        },
        'enableSearchYourThreads': {
            'label': 'Search Your Threads (Filter forums by your threads)',
            'section': ['Forum Features', '/forumdisplay.php'],
            'title': 'Button in forums that filters threads by a given username.',
            'type': 'checkbox',
            'default': true
        },
        // NOTE: Stay app doesn't currently support .updateURL
        //         'HFXMversion':{
        //             'title':'About HFX Mobile',
        //             'section': ['About HFX Mobile',
        //                         `Author: ${GM_info.script.author}<br>` +
        //                         (true ? `<a href='${GM_info.script.updateURL}'>New Update Available (click to update)</a>` : `Up to date`) + `<br>` + // GM_info.scriptWillUpdate
        //                         recentChanges],
        //             'value': '0',
        //             'type': 'hidden'
        //         },
    };

    // Instance of settings
    const settingsAccentColor = '#2f3b5d'; // Previously: 072948
    GM_config.init({
        'id': 'HFXM_config',
        'title': "HFX Mobile",
        'fields': defaultConfiguration,
        'css': `#HFXM_config {background:#333; color:#CCC; font-size:14px; text:#fff;}` +
            `#HFXM_config .section_header {background:${settingsAccentColor}; color:#FFF; border:none; font-size:14px;}` +
            `#HFXM_config .section_desc {background:grey; color:white; border:none; font-size:12px;}` +
            `#HFXM_config .reset {color:white; border:none; font-size:12px;}` +
            `#HFXM_config_buttons_holder {text-align:center}` +
            `#HFXM_config * {font-family:Verdana, Arial, Sans-Serif; font-weight:normal}` +
            `#HFXM_config button {color:#efefef; background-color: ${settingsAccentColor}; border: 1px solid #000 !important;` +
            `box-shadow: 0 1px 0 0 #0F5799 inset !important; padding: 3px 6px; text-decoration: none; font-family: arial;` +
            `text-shadow: 1px 1px 0px #000; font-size: 14px; font-weight: bold; border-radius: 3px;}` +
            `#HFXM_config button:hover {color: #499FED}` +
            `#HFXM_config input[type="text"] {width:50%;}` +
            `#HFXM_config select {background: #cccccc; border: 1px solid ${settingsAccentColor};}` +
            `#HFXM_config_textPMSignature_var, #HFXM_config_enablePMCheck_var, #HFXM_config_enablePMNotifications_var {padding-left:15px}`
    });
}

function getRecentChanges() {
    // NOTE:: Stay app currently does not support GM_info.scriptMetaStr
    // Get Changelog from meta block
    var scriptMetadata = GM_info.scriptMetaStr && GM_info.scriptMetaStr.split('//') || [];
    return scriptMetadata.find((metadataRow) => {
        return metadataRow.includes(GM_info.script.version) && !metadataRow.includes('@version')
    }) || 'No Changelog Entry Found.';
}

function appendHFXMSettings() {
    const sideNav = document.getElementById('mySidenav');
    sideNav.insertAdjacentHTML('beforeend', `<button class="accordion" id="HFXMSettings">
    <div style="display:inline-block;width:50%;">
    <span class="accordion-icon"><i class="fa fa-cog" aria-hidden="true"></i></span>
    HFXM Settings
    </div></button>`);
    // Move default spacer below HFXM settings
    const panelSpacer = sideNav.querySelector('span.panel_spacer');
    sideNav.removeChild(panelSpacer);
    sideNav.append(panelSpacer);

    document.getElementById("HFXMSettings").addEventListener("click", () => {
        // Open settings
        GM_config.open();
        // Close sidenav
        closeNav();
    });
}

function findPageMatch(term) {
    if (!term) return '';
    if (currentUrl && currentUrl.includes(term)) {
        return currentUrl;
    }
}
// ------------------------------ FUNCTIONS: CompactPosts ------------------------------
function injectCompactPosts() {
    if (screen.width > 530) return; // Minimum screen width to trigger script

    const posts = document.getElementsByClassName('post');
    for (const post of posts) {
        const postAuthor = post.querySelector('div.post_wrapper > div.post_author');
        const opIcon = postAuthor.querySelector('span[data-tooltip="Original Poster"]'); // OP feather icon (only present on post #1)
        const postAuthorAvatar = postAuthor.querySelector('div.author_avatar'); // All author info
        const postAuthorInformation = postAuthor.querySelector('div.author_information'); // Username, usertitle, stars, userbar, awards
        const postAuthorAwards = postAuthor.querySelector('div.post_myawards'); // Awards
        postAuthorAwards.style.width = '100%'
        postAuthorAwards && postAuthorInformation.removeChild(postAuthorAwards); // Remove awards from author information
        const postAuthorStatistics = postAuthor.querySelector('div.author_statistics'); // Stats table
        postAuthorStatistics.style['border-bottom-style'] = 'none'; // Remove default border
        postAuthorStatistics.style.margin = '0px'; // Reset default margin
        postAuthorStatistics.style.padding = '0px'; // Reset default padding

        // Remove OP Feather if present
        opIcon && postAuthor.removeChild(opIcon)
        // Remove avatar from post
        postAuthorAvatar && postAuthor.removeChild(postAuthorAvatar);
        // Remove author information
        postAuthorInformation && postAuthor.removeChild(postAuthorInformation);
        // Remove author stats table
        postAuthorStatistics && postAuthor.removeChild(postAuthorStatistics);

        // Append elements back
        // Left
        const avatarContainer = document.createElement('div');
        avatarContainer.appendChild(postAuthorAvatar)
        const authorInfoContainer = document.createElement('div');
        authorInfoContainer.appendChild(postAuthorInformation)
        const leftColumn = document.createElement('td');
        leftColumn.append(avatarContainer, authorInfoContainer);
        // Right
        const rightColumn = document.createElement('td');
        rightColumn.appendChild(postAuthorStatistics);

        // Rows
        const row1 = document.createElement('tr');
        row1.style.width = "100%"
        row1.append(leftColumn, rightColumn);

        const row2 = document.createElement('tr');
        row2.style.width = "100%"

        const awardColumn = document.createElement('td');
        awardColumn.setAttribute('colspan', '2')
        awardColumn.append(postAuthorAwards);
        row2.append(awardColumn)

        const tbody = document.createElement('tbody');
        tbody.append(row1);
        tbody.append(row2);

        const table = document.createElement('table');
        table.style.display = 'table';
        table.style.width = '100%';
        table.append(tbody);
        postAuthorAwards.style['border-bottom'] = '1px dashed #232323';
        postAuthor.append(table)
    }
    // If URL contains post id, scroll to the post
    const pidUrlParam = getUrlParams().get('pid');
    if (pidUrlParam) {
        const urlPost = document.querySelector(`#post_${pidUrlParam}`);
        urlPost && urlPost.scrollIntoView(true);
    };
}
// ------------------------------ FUNCTIONS: Favorites ------------------------------
function createFavoriteElements(favorites) {
    if (!favorites) return [];
    return Object.entries(favorites).map((entry, index) => {
        const [url, text] = entry;
        const isActive = currentUrl == url;
        return `<a href='${url}' style='margin:0px 2px;'><button style='padding:5px; font-weight:600;${isActive ? 'background-color:#1d1d1d;' : ''}'>${text}</button></a>`;
    })
}

function getBreadcrumbText() {
    const breadcrumb = document.getElementsByClassName("breadcrumb")[0];
    const currentPage = breadcrumb.querySelector("a:last-of-type").textContent;
    dPrint(`Current breadcrumb page: ${currentPage}`);
    return currentPage || '';
}

function promptForFavoriteText(currentPage) {
    return prompt("Favorite label for current page:", currentPage);
}

function storeFavorites(favorites) {
    // This sets the value of the field in memory, it won't save the value.
    GM_config.set('favorites', JSON.stringify(favorites));
    // Save changes
    GM_config.save();
}

function retrieveFavorites() {
    try {
        return JSON.parse(GM_config.get('favorites'));
    } catch (err) {
        dPrint('retrieveFavorites: failed to parse favorites.');
        return {};
    }
}

function injectFavorites() {
    const favorites = retrieveFavorites();
    dPrint(`Favorites: ${JSON.stringify(favorites)}`);

    const isFavorite = currentUrl in favorites;
    dPrint(`Is current page favorite: ${isFavorite}`);

    const toggleText = isFavorite ? 'Remove' : 'Add';
    const toggleFavoriteElement = `<a onclick="return false;" id="HFXMFavoriteToggle" style='float:right; margin:0px 2px;'><button style='padding:5px'>${toggleText}</button></a>`;
    const favoriteElements = createFavoriteElements(favorites).join('');

    // Append favorites row
    const logoElement = document.getElementById('logo');
    logoElement.insertAdjacentHTML('beforeend', `<div style='text-align:left; margin:auto;'>${favoriteElements} ${toggleFavoriteElement}</div>`);

    // Add/Remove button event listener
    document.getElementById("HFXMFavoriteToggle").addEventListener("click", () => {
        if (isFavorite) {
            delete favorites[currentUrl];
        } else {
            // Default favorite text to current page per breadcrumb - allow override
            const favoriteText = promptForFavoriteText(getBreadcrumbText());
            if (!favoriteText) {
                return;
            }
            favorites[currentUrl] = favoriteText;
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
    const welcomeUser = document.getElementById("panel").querySelector('span.welcome > strong > a');
    const userID = welcomeUser.getAttribute("href").split("&uid=")[1];
    const username = welcomeUser.innerText;

    // Append button
    const forumActionsContainer = document.getElementById("content").querySelector('td.thead > div.float_right > span.smalltext > strong');
    forumActionsContainer.insertAdjacentHTML('beforeend', `&nbsp;&nbsp;|&nbsp;&nbsp;<form method="post" action="search.php" style="display:inline">
        <input type="hidden" name="action" value="do_search">
        <input type="hidden" name="matchusername" value="1">
        <input type="hidden" name="forums" value="${fid}">
        <input type="hidden" name="threadprefix" value="any">
        <input type="hidden" name="showresults" value="threads">
        <input type="hidden" name="author" value="${username}">
        <button type="submit" class="" name="submit" title="Search Your Threads" style=" background: initial; border: initial; padding: initial; color: white; "><i class="fas fa-user-edit fa-lg"></i></button>
    </form>`);
};
// ------------------------------ FUNCTIONS: PMTrackingLinks ------------------------------
function getTrackingTableByText(tableHeaderStr) {
    const tables = document.getElementById("content").querySelectorAll("table.tborder") || [];
    return Array.from(tables).find(table => {
        const tableHeader = table.querySelector("tbody > tr > td > strong").innerText;
        return tableHeader.includes(tableHeaderStr);
    });
};

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
        titleTd.insertAdjacentHTML('beforeend', `<a href="https://hackforums.net/private.php?action=read&pmid=${messageId}">${pmTitle}</a>`);
        return row;
    });
};

function injectPMTrackingLinks() {
    // Read table
    const readTable = getTrackingTableByText("Read Messages");
    linkMessageTitles(readTable);
    // Unread table
    const unreadTable = getTrackingTableByText("Unread Messages");
    linkMessageTitles(unreadTable);
};
// ------------------------------ FUNCTIONS: PostsOnThread ------------------------------
function getUrlParams() {
    const queryString = window.location.search;
    return new URLSearchParams(queryString);
};

function getBreadcrumbThreadId() {
    const breadcrumb = document.getElementsByClassName("breadcrumb")[0];
    return breadcrumb.querySelector("a:last-of-type").getAttribute('href').split('?tid=')[1];
}

function injectPostsOnThread() {
    const threadId = getUrlParams().get('tid');
    const posts = document.getElementsByClassName('post');
    if (!posts) return;

    for (const [index, post] of Array.from(posts).entries()) {
        const postAuthor = post.querySelector('div.post_wrapper > div.post_author');
        const authorProfile = postAuthor.querySelector('div.author_information > strong > span.largetext > a').getAttribute('href');
        const userId = authorProfile.split('&uid=')[1];
        const authorButtons = post.querySelector('.author_buttons');
        authorButtons.insertAdjacentHTML('beforeend', `
        <a id="HFXMPostsOnThread${index}" class="postbit_quote" href="/showthread.php?tid=${threadId || getBreadcrumbThreadId()}&mode=single&uid=${userId}" data-tooltip="Posts on Thread">
          <span>
            <i class="fa fa-file-signature fa-lg" aria-hidden="true"></i>
          </span>
        </a>`)
    }
};
// ------------------------------ FUNCTIONS: ThreadMentions ------------------------------
function appendMentionToInput(userId) {
    if (!userId) return;

    const textarea = document.getElementById("message");
    textarea.value = textarea.value + `[mention=${userId}] `;
    textarea.scrollIntoView(true);
    textarea.focus();
};

function injectThreadMentions() {
    const posts = document.getElementsByClassName('post');
    const postInput = document.getElementById("message")
    if (!posts || !postInput) return;

    for (const [index, post] of Array.from(posts).entries()) {
        const postAuthor = post.querySelector('div.post_wrapper > div.post_author');
        const authorProfile = postAuthor.querySelector('div.author_information > strong > span.largetext > a').getAttribute('href');
        const userId = authorProfile.split('&uid=')[1];
        const postManagementButtons = post.querySelector('.post_management_buttons');
        postManagementButtons.insertAdjacentHTML('afterbegin', `
              <a class="hfxm-user-mention postbit_quote" href="#" id="HFXMUserMention${index}" data-tooltip="Mention User" onclick="event.preventDefault()">
        <span style="padding-top:5px">
          <i class="fa fa-tag fa-lg" aria-hidden="true"></i>
        </span>
      </a>`);
        document.getElementById(`HFXMUserMention${index}`).addEventListener("click", () => { appendMentionToInput(userId); });
    }
};
// ------------------------------ FUNCTIONS: QuickUnsubscribe ------------------------------
function getUserPostKey() {
    return document.querySelector('head').innerHTML.match(/my_post_key = "([a-f0-9]+)"/).pop() || null;
};

function injectQuickUnsubscribe() {
    const unsubscribeElement = document.querySelector('.subscription_remove');
    if (!unsubscribeElement) return;

    unsubscribeElement.insertAdjacentHTML('afterend', `
    <li>
        <i class="fa fa-sign-out-alt" style="font-family:Font Awesome 5 Pro; font-size: 11px; right: 5px; position: relative; font-weight: 900;"></i>
        <a href="javascript:void(0)" title="HFXM: Quick Unsubscribe" id="HFXMQuickUnsubscribe">Quick Unsubscribe</a>
    </li>
    `);
    document.getElementById(`HFXMQuickUnsubscribe`).addEventListener("click", async () => {
        var data = new FormData();
        data.append("action", "removesubscription");
        data.append("my_post_key", getUserPostKey());
        data.append("tid", getBreadcrumbThreadId());
        await fetch(`${window.location.origin}/usercp2.php?ajax=1`, {
            method: 'POST',
            body: data
        }).then(data => {
            location.reload();
        }).catch((err) => {
            dPrint("Failed to unsubscribe from thread.")
        });
    });
};
// ------------------------------ FUNCTIONS: InteractivePostStats ------------------------------
function ingestInteractivePostStats() {
    const threadId = getUrlParams().get('tid');
    const posts = document.getElementsByClassName('post');
    if (!posts) return;

    for (const [index, post] of Array.from(posts).entries()) {
        const authorStatTable = post.querySelector('div.author_statistics > div.author_wrapper');
        const statRows = authorStatTable.querySelectorAll('div.author_row');
        const postAuthor = post.querySelector('div.post_wrapper > div.post_author');
        const authorProfile = postAuthor.querySelector('div.author_information > strong > span.largetext > a').getAttribute('href');
        const userId = authorProfile.split('&uid=')[1];
        const postId = post.getAttribute('id').replace("post_", "");
        statRows.forEach((stat) => {
            const label = stat.querySelector('div.author_label').innerHTML.toLowerCase();
            const value = stat.querySelector('div.author_value');
            const valueText = value.innerHTML;
            // New interactive post value element
            const newValue = document.createElement('div');
            newValue.classList.add("author_value");
            switch (label) {
                case "posts:": {
                    newValue.insertAdjacentHTML('beforeend', `<a href=https://hackforums.net/search.php?action=finduser&uid=${userId}>${valueText}</a>`)
                    value.replaceWith(newValue);
                };
                    break;
                case "threads:": {
                    newValue.insertAdjacentHTML('beforeend', `<a href=https://hackforums.net/search.php?action=finduserthreads&uid=${userId}>${valueText}</a>`)
                    value.replaceWith(newValue);
                };
                    break;
                case "βytes:": {
                    for (const child of value.childNodes) {
                        // Byte total is a text node and includes space at beginning of value. ie. " 398"
                        if (child.nodeType === Node.TEXT_NODE) {
                            newValue.insertAdjacentHTML('beforeend', `<a style="padding-left:5px;" href="https://hackforums.net/myps.php?action=history&uid=${userId}">${child.nodeValue}</a>`)
                            child.replaceWith(newValue);
                        }
                    }
                };
                    break;
            }
        });
        // Append join date
        const joinDate = post.querySelector("div.author_avatar > a").getAttribute("data-tooltip").replace("Joined ", "");
        const joinDateStat = document.createElement('div');
        joinDateStat.classList.add("author_row");
        joinDateStat.insertAdjacentHTML('beforeend', `<div class="author_label">Join Date:</div>`);
        joinDateStat.insertAdjacentHTML('beforeend', `<div class="author_value">${joinDate ?? 'N/A'}</div>`);
        authorStatTable.append(joinDateStat);
    }
};
// ------------------------------ FUNCTIONS: MobileForumDisplay ------------------------------
function getRelativeTime(timestampInSeconds) {
    if (!timestampInSeconds) return '-';
    const msPerMin = 60;
    const msPerHour = msPerMin * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const nowInSeconds = new Date().getTime() / 1000;
    let elapsed = nowInSeconds - parseInt(timestampInSeconds); // seconds to ms
    if (elapsed < msPerMin) {
        return '<1m';
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
    return '-';
};

function formatViewCount(viewCountStr) {
    if (!viewCountStr) return '-';

    const viewCount = parseFloat(viewCountStr.replaceAll(',', ''));
    if (viewCount < 1000) {
        return viewCount;
    } else if (viewCount < 10000) {
        return `${(viewCount / 1000).toFixed(1)}k`;
    } else if (viewCount < 100000) {
        return `${(viewCount / 10000).toFixed(1)}k`;
    } else if (viewCount < 1000000) {
        return `${(viewCount / 100000).toFixed(1)}k`;
    } else if (viewCount < 10000000) {
        return `${(viewCount / 1000000).toFixed(1)}m`;
    } else if (viewCount > 1000000000) {
        return `∞`;
    }
    return '-';
};

function reformatDumbDate(dateStr) {
    if (!dateStr) return;
    try {
        // ie. October 11th, 2022, 06:26 AM
        // new Date() can't parse ordinal endings, so remove them.
        const newDateStr = dateStr.replace("st", "").replace("nd", "").replace("rd", "").replace("th", "");
        return new Date(newDateStr).getTime() / 1000;
    } catch (err) {
        console.log(err)
        return;
    }

};

function determineThreadStatusLink(threadStatusElement) {
    const iconClasses = Array.from(threadStatusElement.classList);
    if (
        iconClasses.includes("newfolder") ||
        iconClasses.includes("dot_newfolder") ||
        iconClasses.includes("dot_newhotfolder") ||
        iconClasses.includes("newhotfolder")) {
        return "&action=newpost";
    } else {
        return "&action=lastpost";
    }
};

function reformatThreadRows(threadRows) {
    threadRows.forEach((row) => {
        // Get content from new thread row
        const threadStatusIcon = row.querySelector('td:nth-child(1) > span.thread_status');
        threadStatusIcon.style.width = "30px";
        threadStatusIcon.style.height = "30px";
        threadStatusIcon.style.fontSize = "28px";
        const repliesCount = row.querySelector('td:nth-child(3) > a');
        const viewsCount = row.querySelector('td:nth-child(4) > span')?.innerHTML || row.querySelector('td:nth-child(4)')?.innerHTML; // ForumDisplay or UserCP
        // Recent threads use smart time to show relative timestamps
        const recentLastPost = row.querySelector('td:nth-child(5) > span.smalltext > span.smart-time');
        const recentLastPostSeconds = recentLastPost && recentLastPost.getAttribute('data-timestamp');
        // Old threads use string to show absolute timestamp
        const oldLastPost = row.querySelector('td:nth-child(5) > span.smalltext').firstChild;
        const oldLastPostText = oldLastPost.textContent;
        const oldLastPostSeconds = reformatDumbDate(oldLastPostText);
        // Use whichever timestamp exists (recent vs old)
        const lastPostTimestamp = recentLastPostSeconds || oldLastPostSeconds;
        const mobileColumn = row.querySelector('td:nth-child(2) > div.mobile-link > div.mobile-link-truncate') || row.querySelector('td:nth-child(2)');
        const threadTitle = mobileColumn.querySelector('span > span:not(.prefix)') || mobileColumn.querySelector('a:not([title="Go to first unread post"])');
        const threadLink = threadTitle && threadTitle.querySelector('a')?.getAttribute('href') || threadTitle?.getAttribute('href');
        const threadPrefix = mobileColumn.querySelector('span.prefix');
        const author = mobileColumn.querySelector('div.author > a') || mobileColumn.querySelector('span.smalltext > a');
        const relativeLastPost = getRelativeTime(lastPostTimestamp);
        // Delete row contents
        row.innerHTML = '';

        // Build new thread row
        // Author row
        const authorRow = document.createElement('div');
        authorRow.classList.add("author");
        authorRow.classList.add("smalltext");
        authorRow.append(author);
        // Author row - post count
        const postCount = document.createElement('span');
        postCount.style.marginLeft = '10px';
        postCount.insertAdjacentHTML('beforeend', `<i class="fa fa-comment" aria-hidden="true" style="padding-right:3px;"></i>`);
        postCount.append(repliesCount);
        authorRow.append(postCount);
        // Author row - views
        const viewCount = document.createElement('span');
        viewCount.style.marginLeft = '10px';
        viewCount.insertAdjacentHTML('beforeend', `<i class="fa fa-eye" aria-hidden="true" style="padding-right:3px;"></i>`);
        viewCount.append(formatViewCount(viewsCount));
        authorRow.append(viewCount);
        // Author row - Last Post Timestamp
        const lastPost = document.createElement('span');
        lastPost.style.marginLeft = '10px';
        lastPost.insertAdjacentHTML('beforeend', `<i class="fa fa-clock" aria-hidden="true" style="padding-right:3px;"></i>`);
        lastPost.append(relativeLastPost);
        authorRow.append(lastPost);
        // Adv details row
        const advDetailsRow = document.createElement('div');
        threadPrefix && advDetailsRow.append(threadPrefix);
        // Add thread title/author row to thread column
        const newThreadColumn = document.createElement('td');
        newThreadColumn.setAttribute("colspan", 4);
        newThreadColumn.classList.add("trow2");
        newThreadColumn.append(advDetailsRow);
        newThreadColumn.append(threadTitle);
        newThreadColumn.append(authorRow);
        // Add thread column to thread row
        row.append(newThreadColumn);
        // Add thread status to status column
        const newStatusColumn = document.createElement('td');
        newThreadColumn.colspan = 1;
        newStatusColumn.classList.add("trow2");
        const threadStatusLink = document.createElement('a');
        threadStatusLink.setAttribute('href', `/${threadLink}${determineThreadStatusLink(threadStatusIcon)}`);
        threadStatusLink.append(threadStatusIcon);
        newStatusColumn.append(threadStatusLink); // TODO: append to <a> rather than newStatusColumn
        // Add status column to thread row
        row.append(newStatusColumn);
    });
};

function injectMobileThreadListsForumDisplay() {
    if (screen.width > 768) return; // Minimum screen width to trigger script

    const content = document.querySelector("#content");
    const threadRows = content.querySelectorAll("tr.inline_row");
    reformatThreadRows(threadRows);
};

function injectMobileThreadListsUserCP() {
    if (screen.width > 768) return; // Minimum screen width to trigger script

    const desiredTableHeaderTitles = ['Thread Subscriptions With New Posts', 'Threads'];

    const summaryPanel = document.querySelector("#content > div.wrapper > div.oc-container > div.oc-item:nth-child(2)");
    const desiredTableHeaders = Array.from(summaryPanel.querySelectorAll('strong')).filter(el => desiredTableHeaderTitles.some((text) => text === el.textContent));
    const desiredTables = desiredTableHeaders.map((tableHeader) => tableHeader.parentElement.parentElement.parentElement.parentElement);
    const desiredRows = desiredTables.reduce((savedThreadRows, table) => {
        const rows = table.querySelectorAll('tr');
        const threadRows = Array.from(rows).filter((row, index) => index > 1); // First and second row are not thread rows
        return savedThreadRows.concat(threadRows)
    }, []);
    console.log(desiredRows)
    reformatThreadRows(desiredRows);
};