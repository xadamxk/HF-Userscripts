// ==UserScript==
// @name        HF Compact Posts Lite
// @author      xadamxk
// @namespace   https://github.com/xadamxk/HF-Userscripts
// @version     1.0.0
// @description Mobile Friendly Author Format
// @match       https://hackforums.net/*
// @copyright   2022+
// @updateURL   https://github.com/xadamxk/HF-Userscripts/raw/master/HF%20Compact%20Posts%20Lite/HF-Compact-Posts-Lite.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/raw/master/HF%20Compact%20Posts%20Lite/HF-Compact-Posts-Lite.user.js
// ==/UserScript==
// ------------------------------ Changelog -----------------------------
// v1.0.0: Update and Download URLs
// v0.0.1: Initial commit
// ------------------------------ Dev Notes -----------------------------
// Mobile layouts are hard
// ------------------------------ SETTINGS ------------------------------
const debug = false;
const widthThreshold = 530; // Minimum screen width to trigger script
// ------------------------------ SCRIPT ------------------------------
if (screen.width > widthThreshold) return;

const posts = document.getElementsByClassName("post");
for (const post of posts) {
    const postAuthor = post.querySelector("div.post_wrapper > div.post_author");
    const opIcon = postAuthor.querySelector('span[data-tooltip="Original Poster"]');
    const postAuthorAvatar = postAuthor.querySelector("div.author_avatar"); // All author info
    const postAuthorInformation = postAuthor.querySelector("div.author_information"); // Username, usertitle, stars, userbar, awards
    const postAuthorAwards = postAuthor.querySelector("div.post_myawards"); // Awards
    postAuthorAwards.style.width = '100%'
    postAuthorAwards && postAuthorInformation.removeChild(postAuthorAwards);
    const postAuthorStatistics = postAuthor.querySelector("div.author_statistics"); // Stats table
    postAuthorStatistics.style["border-bottom-style"] = 'none';
    postAuthorStatistics.style.margin = '0px';
    postAuthorStatistics.style.padding = '0px';

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
    const topLeft = document.createElement('div');
    topLeft.appendChild(postAuthorAvatar)
    const bottomLeft = document.createElement('div');
    bottomLeft.appendChild(postAuthorInformation)
    const left = document.createElement('div');
    left.append(topLeft, bottomLeft);
    // Right
    const right = document.createElement('div');
    right.appendChild(postAuthorStatistics);
    left.style.width = '50%';
    left.style.display = 'inline-block';
    right.style.width = '50%';
    right.style.display = 'inline-block';
    right.style.position = 'absolute';
    right.style.top = '0px';
    // Row
    const row1Wrapper = document.createElement('div');
    row1Wrapper.append(left, right)
    row1Wrapper.style['border-bottom'] = '1px dashed #232323';
    postAuthorAwards.style['border-bottom'] = '1px dashed #232323';
    postAuthor.append(row1Wrapper)
    postAuthor.append(postAuthorAwards)
}
