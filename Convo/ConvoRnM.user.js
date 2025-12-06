// ==UserScript==
// @name Convo RnM
// @namespace http://tampermonkey.net/
// @version 1.5
// @description Reply and mention buttons for both public and private HackForums convos
// @author       Charlie Sheen, Zenthara & MarlboroMan
// @match https://hackforums.net/convo.php
// @match https://hackforums.net/convo.php?id=*
// @grant none
// ==/UserScript==

(function () {
'use strict';

// Detect if we're in a private convo
const isPrivateConvo = window.location.href.includes('?id=');

const textarea = document.querySelector('#comment');
if (!textarea) {
return;
}

let lastUsername = null;

async function fetchProfileLinkViaPost(username) {
try {
const formData = new URLSearchParams();
formData.append('username', username);
formData.append('sort', 'registration');
formData.append('order', 'desc');
formData.append('submit', 'Search');

const res = await fetch('https://hackforums.net/memberlist.php', {
method: 'POST',
credentials: 'include',
headers: {
'Content-Type': 'application/x-www-form-urlencoded'
},
body: formData
});

const html = await res.text();
const doc = new DOMParser().parseFromString(html, 'text/html');
const link = doc.querySelector('a[href^="member.php?action=profile&uid="]');
return link ? `https://hackforums.net/${link.getAttribute('href')}` : null;
} catch (err) {
return null;
}
}

function processMessageBlock(msg) {
const usernameEl = msg.querySelector('.message-bubble-left strong');
const messageEl = msg.querySelector('.message-bubble-message span');

const username = usernameEl
? (lastUsername = usernameEl.textContent.trim())
: lastUsername;

if (!username || !messageEl) return;

const message = messageEl.textContent.trim();
if (!message || msg.querySelector('.hf-button-container')) return;

if (message.includes('/flip') || username === 'Stanley') {
return;
}

const buttonContainer = document.createElement('div');
buttonContainer.className = 'hf-button-container';
buttonContainer.style.cssText = `
position: absolute;
right: -80px;
top: 50%;
transform: translateY(-50%);
display: flex;
gap: 4px;
opacity: 0;
transition: opacity 0.2s ease-in-out;
z-index: 10;
align-items: center;
`;

const replyButtonStyle = `
color: #fff;
font-size: 12px;
background: none;
border: none;
cursor: pointer;
display: inline-flex;
align-items: center;
text-decoration: underline;
line-height: 15px;
vertical-align: middle;
`;
const mentionButtonStyle = `
color: #fff;
font-size: 12px;
background: none;
border: none;
cursor: pointer;
display: inline-flex;
align-items: center;
line-height: 15px;
vertical-align: middle;
`;

const replyBtn = document.createElement('button');
replyBtn.title = `Reply to ${username}`;
replyBtn.innerHTML = '<svg fill="#fff" height="15px" width="15px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 206.108 206.108" xml:space="preserve"><path d="M152.774,69.886H30.728l24.97-24.97c3.515-3.515,3.515-9.213,0-12.728c-3.516-3.516-9.213-3.515-12.729,0L2.636,72.523c-3.515,3.515-3.515,9.213,0,12.728l40.333,40.333c1.758,1.758,4.061,2.636,6.364,2.636c2.303,0,4.606-0.879,6.364-2.636c3.515-3.515,3.515-9.213,0-12.728l-24.97-24.97h122.046c19.483,0,35.334,15.851,35.334,35.334s-15.851,35.334-35.334,35.334H78.531c-4.971,0-9,4.029-9,9s4.029,9,9,9h74.242c29.408,0,53.334-23.926,53.334-53.334S182.182,69.886,152.774,69.886z"/></svg>';
replyBtn.className = 'hf-reply-btn';
replyBtn.style.cssText = replyButtonStyle;

const mentionBtn = document.createElement('button');
mentionBtn.title = `Mention ${username}`;
mentionBtn.textContent = '@';
mentionBtn.className = 'hf-mention-btn';
mentionBtn.style.cssText = mentionButtonStyle;

replyBtn.addEventListener('click', async () => {
if (isPrivateConvo) {
// Fetch profile URL for private convo
const profileUrl = await fetchProfileLinkViaPost(username);
const replyLine = profileUrl
? `${profileUrl} "*${message}*"\n\n`
: `❌ User "${username}" not found "*${message}*"\n\n`;
if (!textarea.value.includes(replyLine)) {
textarea.value = replyLine + textarea.value;
}
} else {
// Use @@ format for public convo
const replyLine = `@${username}@ "*${message}*"\n\n`;
if (!textarea.value.includes(replyLine)) {
textarea.value = replyLine + textarea.value;
}
}
textarea.focus();
});

mentionBtn.addEventListener('click', async () => {
if (isPrivateConvo) {
// Fetch profile URL for private convo
const profileUrl = await fetchProfileLinkViaPost(username);
const replyLine = profileUrl
? `${profileUrl} `
: `❌ User "${username}" not found `;
if (!textarea.value.includes(replyLine)) {
textarea.value = replyLine + textarea.value;
}
} else {
// Use @@ format for public convo
const replyLine = `@${username}@ `;
if (!textarea.value.includes(replyLine)) {
textarea.value = replyLine + textarea.value;
}
}
textarea.focus();
});

buttonContainer.appendChild(replyBtn);
buttonContainer.appendChild(mentionBtn);

const messageBubble = msg.querySelector('.message-bubble-message');
if (!messageBubble) return;

const messageWrapper = document.createElement('div');
messageWrapper.style.cssText = 'position: relative; display: inline-block;';
messageBubble.parentElement.insertBefore(messageWrapper, messageBubble);
messageWrapper.appendChild(messageBubble);
messageWrapper.appendChild(buttonContainer);

messageWrapper.addEventListener('mouseenter', () => {
buttonContainer.style.opacity = '1';
});
messageWrapper.addEventListener('mouseleave', () => {
buttonContainer.style.opacity = '0';
});
}

function observeMessages(rootSelector) {
const root = document.querySelector(rootSelector);
if (!root) {
return;
}

const observer = new MutationObserver((mutations) => {
mutations.forEach(m => {
m.addedNodes.forEach(node => {
if (node.nodeType === 1 && node.classList.contains('message-convo-left')) {
processMessageBlock(node);
}
});
});
});

observer.observe(root, { childList: true, subtree: true });

document.querySelectorAll('.message-convo-left').forEach(processMessageBlock);
}

observeMessages('#message-convo');
})();