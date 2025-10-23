// ==UserScript==
// @name        HF Mobile Thread Lists Lite
// @author      xadamxk
// @namespace   https://github.com/xadamxk/HF-Userscripts
// @version     1.0.0
// @description Reformats thread lists for mobile devices.
// @match       https://hackforums.net/*
// @copyright   2025+
// @updateURL   https://github.com/xadamxk/HF-Userscripts/raw/refs/heads/master/HF%20Mobile%20Thread%20Lists/HFMobileThreadListsLite.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/raw/refs/heads/master/HF%20Mobile%20Thread%20Lists/HFMobileThreadListsLite.user.js
// ==/UserScript==
// ------------------------------ Changelog -----------------------------
// v1.0.0: Add update and download URLs
// v0.0.1: Initial commit
// ------------------------------ SETTINGS ------------------------------
const currentUrl = window.location.href;

if(currentUrl.includes("/forumdisplay.php?")){
    injectMobileThreadListsForumDisplay();
} else if (currentUrl.includes("/usercp.php")){
    injectMobileThreadListsUserCP();
} else if (currentUrl.includes("/search.php?action=results&sid=")){
    injectMobileThreadListsSearch();
}

function reformatThreadRows(threadRows, includesForumColumn = false) {
    let repliesColumnIndex = 3;
    let viewsColumnIndex = 4;
    let lastPostColumnIndex = 5;
    if (includesForumColumn) {
        repliesColumnIndex++;// = 4;
        viewsColumnIndex++;// = 5;
        lastPostColumnIndex++;// = 6;
    }
    //
    threadRows.forEach((row) => {
        // Get content from new thread row
        const threadStatusIcon = row.querySelector('td:nth-child(1) > span.thread_status');
        threadStatusIcon.style.width = "30px";
        threadStatusIcon.style.height = "30px";
        threadStatusIcon.style.fontSize = "28px";
        const repliesCount = row.querySelector(`td:nth-child(${repliesColumnIndex}) > a`);
        const forumColumn = row.querySelector(`td:nth-child(3) > a`);
        const viewsCount = row.querySelector(`td:nth-child(${viewsColumnIndex}) > span`)?.innerHTML || row.querySelector(`td:nth-child(${viewsColumnIndex})`)?.innerHTML; // ForumDisplay or UserCP
        // Recent threads use smart time to show relative timestamps
        const recentLastPost = row.querySelector(`td:nth-child(${lastPostColumnIndex}) > span.smalltext > span.smart-time`);
        const recentLastPostSeconds = recentLastPost && recentLastPost.getAttribute('data-timestamp');
        // Old threads use string to show absolute timestamp
        const oldLastPost = row.querySelector(`td:nth-child(${lastPostColumnIndex}) > span.smalltext`)?.firstChild;
        const oldLastPostText = oldLastPost?.textContent;
        const oldLastPostSeconds = reformatDumbDate(oldLastPostText);
        // Use whichever timestamp exists (recent vs old)
        const lastPostTimestamp = recentLastPostSeconds || oldLastPostSeconds;
        const mobileColumn = row.querySelector('td:nth-child(2) > div.mobile-link > div.mobile-link-truncate') || row.querySelector('td:nth-child(2)');
        const threadTitle = mobileColumn.querySelector('span > span:not(.prefix):not(.smalltext)') || mobileColumn.querySelector('a:not([title="Go to first unread post"])');
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
        includesForumColumn && forumColumn && advDetailsRow.append(forumColumn);
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
        newStatusColumn.append(threadStatusLink);
        // Add status column to thread row
        row.append(newStatusColumn);
    });
};

function injectMobileThreadListsForumDisplay(){
    if (screen.width > 768) return; // Minimum screen width to trigger script

    const content = document.querySelector("#content");
    const threadRows = content.querySelectorAll("tr.inline_row");
    reformatThreadRows(threadRows);
}

function injectMobileThreadListsUserCP(){
        if (screen.width > 768) return; // Minimum screen width to trigger script

    const desiredTableHeaderTitles = ['Thread Subscriptions With New Posts', 'Threads'];

    const summaryPanel = document.querySelector("#content > div.wrapper-content > div.oc-container > div.oc-item:nth-child(2)");
    const desiredTableHeaders = Array.from(summaryPanel.querySelectorAll('strong')).filter(el => desiredTableHeaderTitles.some((text) => text === el.textContent));
    const desiredTables = desiredTableHeaders.map((tableHeader) => tableHeader.parentElement.parentElement.parentElement.parentElement);
    const desiredRows = desiredTables.reduce((savedThreadRows, table) => {
        const rows = table.querySelectorAll('tr');
        const threadRows = Array.from(rows).filter((row, index) => index > 1); // First and second row are not thread rows
        return savedThreadRows.concat(threadRows)
    }, []);
    reformatThreadRows(desiredRows);
}

function injectMobileThreadListsSearch() {
    if (screen.width > 768) return; // Minimum screen width to trigger script

    const desiredTableHeaderTitles = ['Search Results'];

    const content = document.querySelector("#content");
    const desiredTableHeaders = Array.from(content.querySelectorAll('strong')).filter(el => desiredTableHeaderTitles.some((text) => text === el.textContent));
    const desiredTables = desiredTableHeaders.map((tableHeader) => tableHeader.parentElement.parentElement.parentElement.parentElement);
    const desiredRows = desiredTables.reduce((savedThreadRows, table) => {
        const rows = table.querySelectorAll('tr');
        const threadRows = Array.from(rows).filter((row, index) => index > 1); // First and second row are not thread rows
        return savedThreadRows.concat(threadRows)
    }, []);
    reformatThreadRows(desiredRows, true);
};

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
    } else if (viewCount < 1000000) {
        return `${(viewCount / 1000).toFixed(1)}k`;
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