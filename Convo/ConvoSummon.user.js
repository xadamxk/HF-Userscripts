// ==UserScript==
// @name         Convo Summon
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Sends a summon PM when using /summon <username> in convo
// @author       Charlie Sheen
// @match        https://hackforums.net/convo.php
// @match        https://hackforums.net/convo.php?id=*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    console.log("[HF /summon] Script active on convo");

    document.addEventListener('keydown', function (e) {
        const textarea = document.querySelector('#comment');
        if (!textarea || document.activeElement !== textarea) return;

        if (e.key === 'Enter' && !e.shiftKey) {
            const value = textarea.value.trim();
            const match = value.match(/^\/summon\s+(.{1,40})$/i);
            if (!match) return;

            e.preventDefault();
            e.stopImmediatePropagation();

            const username = match[1].trim();
            textarea.value = '';
            lookupUidAndSendPM(username);
        }
    });

    async function lookupUidAndSendPM(username) {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('sort', 'registration');
        formData.append('order', 'desc');
        formData.append('submit', 'Search');

        try {
            const response = await fetch('https://hackforums.net/memberlist.php', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });

            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const profileLink = doc.querySelector('a[href^="member.php?action=profile&uid="]');
            if (!profileLink) {
                alert(`❌ User "${username}" not found`);
                return;
            }

            const href = profileLink.getAttribute('href');
            const uidMatch = href.match(/uid=(\d+)/);
            if (!uidMatch) {
                alert("❌ UID not found in profile link");
                return;
            }

            const uid = uidMatch[1];
            sendPMInBackground(uid);
        } catch (err) {
            console.error("[HF /summon] Error:", err);
            alert("⚠️ Failed to prepare PM link.");
        }
    }

    function sendPMInBackground(uid) {
        const message = "You've been summoned to convo.\n\n[align=center][spoiler][url=https://hackforums.net/showthread.php?tid=6298890&pid=62747891#pid62747891][b]Hack Forums Plugins  -  Install and manage Hack Forums plugins with ease.[/b][/url][/spoiler][/align]";
        const pmLink = `https://hackforums.net/private.php?action=send&uid=${uid}&subject=${encodeURIComponent("Your presence is requested")}&message=${encodeURIComponent(message)}`;

        const pmWindow = window.open(pmLink, '_blank');
        if (!pmWindow) {
            console.error("[HF /summon] Failed to open PM window.");
            alert("⚠️ Failed to open PM window. Please allow pop-ups.");
            return;
        }

        pmWindow.blur();
        window.focus();

        pmWindow.onload = () => {
            try {
                const doc = pmWindow.document;
                const subjectInput = doc.querySelector('input[name="subject"]');
                const messageTextarea = doc.querySelector('textarea[name="message"]');
                const sendButton = doc.querySelector('input[type="submit"][value="Send Message"]');

                if (!subjectInput || !messageTextarea || !sendButton) {
                    console.warn("[HF /summon] PM form elements not found:", {
                        subjectInput: !!subjectInput,
                        messageTextarea: !!messageTextarea,
                        sendButton: !!sendButton
                    });
                    pmWindow.close();
                    alert("⚠️ Failed to send PM: Form elements not found.");
                    return;
                }

                subjectInput.value = "Your presence is requested";
                messageTextarea.value = message;

                setTimeout(() => {
                    sendButton.click();
                    setTimeout(() => {
                        pmWindow.close();
                        console.log("[HF /summon] PM sent and window closed.");
                    }, 1000);
                }, 500);
            } catch (err) {
                console.error("[HF /summon] Error in PM window:", err);
                pmWindow.close();
                alert("⚠️ Failed to send PM: Window error.");
            }
        };
    }
})();