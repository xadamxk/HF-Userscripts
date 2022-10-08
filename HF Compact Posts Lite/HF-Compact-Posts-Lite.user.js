// ==UserScript==
// @name        HF Compact Posts Lite
// @author      xadamxk
// @namespace   https://github.com/xadamxk/HF-Userscripts
// @version     1.0.1
// @description Mobile Friendly Author Format
// @match       https://hackforums.net/*
// @copyright   2022+
// @updateURL   https://github.com/xadamxk/HF-Userscripts/raw/master/HF%20Compact%20Posts%20Lite/HF-Compact-Posts-Lite.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/raw/master/HF%20Compact%20Posts%20Lite/HF-Compact-Posts-Lite.user.js
// ==/UserScript==
// ------------------------------ Changelog -----------------------------
// v1.0.1: Update layout to use table for improved layout
// v1.0.0: Update and Download URLs
// v0.0.1: Initial commit
// ------------------------------ Dev Notes -----------------------------
// Mobile layouts are hard
// ------------------------------ SETTINGS ------------------------------
const debug = false;
const widthThreshold = 530; // Minimum screen width to trigger script
// ------------------------------ SCRIPT ------------------------------
if (screen.width > widthThreshold) return;

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
