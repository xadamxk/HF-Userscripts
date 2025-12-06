// ==UserScript==
// @name         Convo WhoIs
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fetch and post profile info, credibility, disputes, popularity, balance, status and last seen date.
// @author       Charlie Sheen & MarlboroMan
// @match        https://hackforums.net/convo.php
// @match        https://hackforums.net/convo.php?id=*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    console.log("[HF /whois] 🚀 Script loaded");

    document.addEventListener('keydown', function (e) {
        const textarea = document.querySelector('#comment');
        const sendButton = document.querySelector('input[type="submit"][value="Send"]');
        if (!textarea || !sendButton || document.activeElement !== textarea) return;

        if (e.key === 'Enter' && !e.shiftKey) {
            const value = textarea.value.trim();
            const match = value.match(/^\/whois\s+([\p{L}0-9_\- ]{1,40})$/iu);
            if (match) {
                e.preventDefault();
                e.stopImmediatePropagation();

                const username = match[1].trim();
                textarea.value = '';
                fetchWhois(username, textarea, sendButton);
            }
        }
    }, true);

    async function fetchWhois(username, textarea, sendButton) {
        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('sort', 'registration');
            formData.append('order', 'desc');
            formData.append('submit', 'Search');

            const res = await fetch('https://hackforums.net/memberlist.php', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });

            const html = await res.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const profileLinkEl = doc.querySelector('a[href^="member.php?action=profile&uid="]');
            if (!profileLinkEl) {
                textarea.value = `❌ User "${username}" not found`;
                sendButton.click();
                return;
            }

            const profileHref = `https://hackforums.net/${profileLinkEl.getAttribute('href')}`;
            const profilePage = await fetch(profileHref, { credentials: 'include' });
            const profileHTML = await profilePage.text();
            const profileDoc = new DOMParser().parseFromString(profileHTML, 'text/html');

            const profileNameEl = profileDoc.querySelector('.largetext > strong') || profileDoc.querySelector('.group');
            const displayName = profileNameEl ? profileNameEl.textContent.trim() : username;

            // Extract bio
            const bioEl = profileDoc.querySelector('div[style*="padding: 0px 12px; margin-top: -6px; font-size: 13px;"]');
            const bio = bioEl ? bioEl.textContent.trim() : '';

            function getCredibilityTriple() {
                const blocks = profileDoc.querySelectorAll('strong');
                for (const strong of blocks) {
                    if (strong.textContent.trim().toLowerCase() === 'credibility:') {
                        const container = strong.parentElement;
                        const values = container.querySelectorAll('a strong');
                        if (values.length === 3) {
                            return `${values[0].textContent.trim()}/${values[1].textContent.trim()}/${values[2].textContent.trim()}`;
                        }
                    }
                }
                return "❓";
            }

            function getValueByStrongLabel(label) {
                const allStrong = [...profileDoc.querySelectorAll('strong')];
                for (let strong of allStrong) {
                    if (strong.textContent.trim().toLowerCase().includes(label.toLowerCase())) {
                        const parent = strong.parentNode;
                        const link = parent.querySelector('a[href^="myps.php?action=history"]');
                        if (link && label.toLowerCase() === 'βytes:') {
                            return link.textContent.trim();
                        }
                        const fullText = parent.textContent || '';
                        const match = fullText.match(/:\s*([^]+)/i);
                        if (match) return match[1].trim();
                        return "❓";
                    }
                }
                return "❓";
            }

            function getStatusAndLastSeen() {
                try {
                    const onlineEl = profileDoc.querySelector('span.online');
                    const offlineEl = profileDoc.querySelector('span.offline');
                    let status, lastSeen = null;

                    if (onlineEl) {
                        status = 'Online';
                    } else if (offlineEl) {
                        status = 'Offline';
                        const lastSeenEl = profileDoc.querySelector('.smart-time');
                        lastSeen = lastSeenEl ? lastSeenEl.title : 'Unknown';
                    } else {
                        status = 'Unknown';
                    }

                    return { status, lastSeen };
                } catch (err) {
                    console.error("[HF /whois] ❌ Error fetching status and last seen:", err);
                    return { status: 'Unknown', lastSeen: null };
                }
            }

            const credibility = getCredibilityTriple();
            const disputes = getValueByStrongLabel("Open Disputes");
            const popularity = getValueByStrongLabel("Popularity");
            const balance = getValueByStrongLabel("βytes");
            const { status, lastSeen } = getStatusAndLastSeen();

            const statusMessage = status !== 'Unknown' ? `🌐 Status: ${status}` : `🌐 Status: Unknown`;
            // Check if in private convo (URL contains id parameter)
            const isPrivateConvo = window.location.href.includes('convo.php?id=');
            let finalMessage = isPrivateConvo ? `🔗 ${profileHref}` : `🔗 @${displayName}@`;
            if (bio) {
                finalMessage += `\n💭 ***${bio}***`;
            }
            finalMessage += `\n🏆 Credibility: ${credibility}\n❗ Open Disputes: ${disputes}\n📈 Popularity: ${popularity}\n💰 Balance: ${balance}\n${statusMessage}`;

            if (status === 'Offline' && lastSeen) {
                const lastSeenMessage = lastSeen !== 'Unknown' ? `🕓 *Last Seen: ${lastSeen}*` : `🕓 *Last Seen: Unknown*`;
                finalMessage += `\n${lastSeenMessage}`;
            }

            textarea.value = finalMessage;
            sendButton.click();

        } catch (err) {
            console.error("[HF /whois] Error:", err);
            textarea.value = "⚠️ Failed to fetch profile data.";
            sendButton.click();
        }
    }
})();