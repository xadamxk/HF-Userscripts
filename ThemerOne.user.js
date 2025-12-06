// ==UserScript==
// @name         Themer
// @namespace    https://hackforums.net/
// @version      1.34
// @description  Customize your HackForums theme and profile and view other Themer users's custom profiles with dynamic background updates.
// @author       MarlboroMan
// @match        *://hackforums.net/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://w.soundcloud.com/player/api.js
// ==/UserScript==

(function() {
    'use strict';

    const style = `
        #hft-main-ui, #hft-settings-ui, #hft-about-ui, #hft-themer-ui, #hft-background-options-ui, #hft-customize-bg-ui, #hft-manage-bg-ui, #hft-manage-slideshow-ui, #hft-create-slideshow-ui, #hft-customize-main-bg-ui, #hft-customize-page-bg-ui, #hft-page-rules-ui, #hft-add-bg-popup-ui, #hft-active-customizations-ui, #hft-error-popup, #hft-forum-options-ui, #hft-profiles-ui, #hft-themer-link-ui, #hft-themer-link-main-ui {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            z-index: 999999;
            color: #e0e0e0;
            cursor: move;
            user-select: none;
            resize: none;
            box-sizing: border-box;
            overflow: hidden;
        }
        #hft-main-ui {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2b2b2b;
            padding: 20px;
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            width: 360px;
            min-height: 180px;
            max-height: 180px;
            border: 1px solid #502c5c;
            animation: fadeIn 0.5s ease;
            display: none;
            flex-direction: column;
            gap: 16px;
        }
        #hft-themer-link-ui {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2b2b2b;
            padding: 24px;
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            width: 400px;
            border: 1px solid #502c5c;
            animation: fadeIn 0.5s ease;
            display: none;
            flex-direction: column;
            gap: 16px;
        }
        #hft-themer-link-main-ui {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2b2b2b;
            padding: 32px;
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            width: 500px;
            min-height: 400px;
            border: 1px solid #502c5c;
            animation: fadeIn 0.5s ease;
            display: none;
            flex-direction: column;
            gap: 24px;
        }
        #hft-main-ui h2, #hft-settings-ui h2, #hft-about-ui h2, #hft-themer-ui h2, #hft-background-options-ui h2, #hft-customize-bg-ui h2, #hft-manage-bg-ui h2, #hft-manage-slideshow-ui h2, #hft-create-slideshow-ui h2, #hft-customize-main-bg-ui h2, #hft-customize-page-bg-ui h2, #hft-page-rules-ui h2, #hft-add-bg-popup-ui h2, #hft-active-customizations-ui h2, #hft-forum-options-ui h2, #hft-profiles-ui h2, #hft-themer-link-ui h2, #hft-themer-link-main-ui h2 {
            margin: 0;
            font-size: 18px;
            color: #0cb114;
            font-weight: 600;
            text-align: center;
        }
        #hft-main-ui .header, #hft-settings-ui .header, #hft-about-ui .header, #hft-themer-ui .header, #hft-background-options-ui .header, #hft-customize-bg-ui .header, #hft-manage-bg-ui .header, #hft-manage-slideshow-ui .header, #hft-create-slideshow-ui .header, #hft-customize-main-bg-ui .header, #hft-customize-page-bg-ui .header, #hft-page-rules-ui .header, #hft-add-bg-popup-ui .header, #hft-active-customizations-ui .header, #hft-forum-options-ui .header, #hft-profiles-ui .header, #hft-themer-link-ui .header, #hft-themer-link-main-ui .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        #hft-main-ui .button-container, #hft-settings-ui .button-container, #hft-about-ui .button-container, #hft-themer-ui .button-container, #hft-background-options-ui .button-container, #hft-customize-bg-ui .button-container, #hft-manage-bg-ui .button-container, #hft-manage-slideshow-ui .button-container, #hft-create-slideshow-ui .button-container, #hft-customize-main-bg-ui .button-container, #hft-customize-page-bg-ui .button-container, #hft-page-rules-ui .button-container, #hft-add-bg-popup-ui .button-container, #hft-active-customizations-ui .button-container, #hft-forum-options-ui .button-container, #hft-profiles-ui .button-container, #hft-themer-link-ui .button-container, #hft-themer-link-main-ui .button-container {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        #hft-themer-link-main-ui .button-container {
            flex-direction: row;
            justify-content: space-between;
            gap: 16px;
        }
        #hft-main-ui button, #hft-settings-ui button, #hft-about-ui button, #hft-themer-ui button, #hft-background-options-ui button, #hft-customize-bg-ui button, #hft-manage-bg-ui button, #hft-manage-slideshow-ui button, #hft-create-slideshow-ui button, #hft-customize-main-bg-ui button, #hft-customize-page-bg-ui button, #hft-page-rules-ui button, #hft-add-bg-popup-ui button, #hft-active-customizations-ui button, #hft-forum-options-ui button, #hft-profiles-ui button, #hft-themer-link-ui button, #hft-themer-link-main-ui button:not(.toggle-btn) {
            background: #502c5c;
            border: none;
            color: #fff;
            padding: 10px;
            border-radius: 12px;
            font-size: 14px;
            cursor: pointer;
            transition: background 0.3s ease, transform 0.3s ease;
            width: 100%;
            box-sizing: border-box;
        }
        #hft-themer-link-main-ui button:not(.toggle-btn) {
            width: auto;
            padding: 10px 20px;
        }
        #hft-main-ui button:hover, #hft-settings-ui button:hover, #hft-about-ui button:hover, #hft-themer-ui button:hover, #hft-background-options-ui button:hover, #hft-customize-bg-ui button:hover, #hft-manage-bg-ui button:hover, #hft-manage-slideshow-ui button:hover, #hft-create-slideshow-ui button:hover, #hft-customize-main-bg-ui button:hover, #hft-customize-page-bg-ui button:hover, #hft-page-rules-ui button:hover, #hft-add-bg-popup-ui button:hover, #hft-active-customizations-ui button:hover, #hft-forum-options-ui button:hover, #hft-profiles-ui button:hover, #hft-themer-link-ui button:hover, #hft-themer-link-main-ui button:not(.toggle-btn):hover {
            background: #683a76;
            transform: scale(1.02);
        }
        #hft-settings-ui, #hft-about-ui, #hft-themer-ui, #hft-background-options-ui, #hft-customize-bg-ui, #hft-customize-main-bg-ui, #hft-customize-page-bg-ui, #hft-add-bg-popup-ui, #hft-create-slideshow-ui, #hft-error-popup, #hft-forum-options-ui, #hft-profiles-ui {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2b2b2b;
            padding: 24px;
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            width: 400px;
            border: 1px solid #502c5c;
            animation: fadeIn 0.5s ease;
            display: none;
            flex-direction: column;
            gap: 16px;
            box-sizing: border-box;
        }
        #hft-about-ui p, #hft-about-ui a {
            margin: 5px 0;
            text-align: center;
            font-size: 14px;
            color: #e0e0e0;
        }
        #hft-about-ui a {
            color: #0cb114;
            text-decoration: none;
        }
        #hft-about-ui a:hover {
            text-decoration: underline;
        }
        #hft-manage-bg-ui, #hft-manage-slideshow-ui, #hft-page-rules-ui, #hft-active-customizations-ui {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2b2b2b;
            padding: 24px;
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            width: 500px;
            border: 1px solid #502c5c;
            animation: fadeIn 0.5s ease;
            display: none;
            flex-direction: column;
            gap: 16px;
            box-sizing: border-box;
        }
        #hft-manage-bg-ui .table-container, #hft-manage-slideshow-ui .table-container, #hft-page-rules-ui .table-container, #hft-active-customizations-ui .table-container, #hft-create-slideshow-ui .checkbox-container {
            max-height: 300px;
            overflow-y: auto;
            background: #3b3b3b;
            border-radius: 12px;
            padding: 12px;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: thin;
            scrollbar-color: #683a76 #3b3b3b;
        }
        #hft-manage-bg-ui .table-container::-webkit-scrollbar, #hft-manage-slideshow-ui .table-container::-webkit-scrollbar {
            width: 8px;
        }
        #hft-manage-bg-ui .table-container::-webkit-scrollbar-track, #hft-manage-slideshow-ui .table-container::-webkit-scrollbar-track {
            background: #3b3b3b;
        }
        #hft-manage-bg-ui .table-container::-webkit-scrollbar-thumb, #hft-manage-slideshow-ui .table-container::-webkit-scrollbar-thumb {
            background: #683a76;
            border-radius: 4px;
        }
        #hft-create-slideshow-ui .checkbox-container {
            padding: 16px;
        }
        #hft-manage-bg-ui table, #hft-manage-slideshow-ui table, #hft-page-rules-ui table, #hft-active-customizations-ui table, #hft-create-slideshow-ui .checkbox-table {
            width: 100%;
            border-collapse: collapse;
            color: #e0e0e0;
            font-size: 14px;
        }
        #hft-manage-bg-ui th, #hft-manage-bg-ui td, #hft-manage-slideshow-ui th, #hft-manage-slideshow-ui td, #hft-page-rules-ui th, #hft-page-rules-ui td, #hft-active-customizations-ui th, #hft-active-customizations-ui td, #hft-create-slideshow-ui .checkbox-table th, #hft-create-slideshow-ui .checkbox-table td {
            padding: 12px;
            border-bottom: 1px solid #4b4b4b;
        }
        #hft-manage-bg-ui th, #hft-manage-slideshow-ui th, #hft-page-rules-ui th, #hft-active-customizations-ui th, #hft-create-slideshow-ui .checkbox-table th {
            background: #3b3b3b;
            font-weight: 600;
            text-align: right;
        }
        #hft-manage-bg-ui th:nth-child(2), #hft-manage-slideshow-ui th:nth-child(2), #hft-page-rules-ui th:nth-child(3), #hft-active-customizations-ui th:nth-child(4), #hft-create-slideshow-ui .checkbox-table th {
            text-align: center;
        }
        #hft-manage-bg-ui td:nth-child(1), #hft-manage-slideshow-ui td:nth-child(1), #hft-page-rules-ui td:nth-child(1), #hft-page-rules-ui td:nth-child(2), #hft-active-customizations-ui td:nth-child(1), #hft-active-customizations-ui td:nth-child(2), #hft-active-customizations-ui td:nth-child(3) {
            text-align: right;
        }
        #hft-manage-bg-ui td:nth-child(2), #hft-manage-slideshow-ui td:nth-child(2), #hft-page-rules-ui td:nth-child(3), #hft-active-customizations-ui td:nth-child(4), #hft-create-slideshow-ui .checkbox-table td {
            text-align: center;
        }
        #hft-manage-bg-ui td[colspan="2"], #hft-manage-slideshow-ui td[colspan="2"], #hft-page-rules-ui td[colspan="3"], #hft-active-customizations-ui td[colspan="4"] {
            text-align: center;
        }
        #hft-manage-bg-ui td button, #hft-manage-slideshow-ui td button, #hft-page-rules-ui td button, #hft-active-customizations-ui td button {
            background: transparent;
            color: #ff4444;
            padding: 4px;
            border-radius: 4px;
            font-size: 16px;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
        }
        #hft-manage-bg-ui td button:hover, #hft-manage-slideshow-ui td button:hover, #hft-page-rules-ui td button:hover, #hft-active-customizations-ui td button:hover {
            background: #ff6666;
            color: #fff;
        }
        #hft-create-slideshow-ui select, #hft-customize-main-bg-ui select, #hft-customize-page-bg-ui select, #hft-add-bg-popup-ui input, #hft-create-slideshow-ui input[type="text"], #hft-profiles-ui select, #hft-themer-link-ui input, #hft-themer-link-main-ui select, #hft-themer-link-main-ui input {
            background: #3b3b3b;
            border: none;
            color: #e0e0e0;
            padding: 10px;
            border-radius: 12px;
            font-size: 14px;
            outline: none;
            width: 100%;
            box-sizing: border-box;
        }
        #hft-create-slideshow-ui .input-group, #hft-add-bg-popup-ui .input-group, #hft-customize-page-bg-ui .input-group, #hft-profiles-ui .input-group, #hft-themer-link-ui .input-group, #hft-themer-link-main-ui .input-group {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        #hft-create-slideshow-ui .checkbox-table label {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 8px 0;
        }
        #hft-error-popup button {
            background: #502c5c;
            border: none;
            color: #fff;
            padding: 10px;
            border-radius: 12px;
            font-size: 14px;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        #hft-error-popup button:hover {
            background: #683a76;
        }
        #hft-bg-overlay-1, #hft-bg-overlay-2 {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0;
            transition: opacity 2s ease;
        }
        #hft-home-icon {
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 1000;
            color: #e0e0e0;
            font-size: 24px;
            cursor: pointer;
            display: none;
        }
        #hft-home-icon:hover {
            color: #0cb114;
        }
        .hft-checkbox {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 0;
            flex-direction: row;
            justify-content: space-between;
        }
        .hft-checkbox-label {
            font-size: 14px;
            color: #e0e0e0;
            cursor: pointer;
            white-space: nowrap;
            text-align: left;
            flex: 1;
        }
        .hft-checkbox input[type="checkbox"] {
            width: 16px;
            height: 16px;
            background: #3b3b3b;
            border: 1px solid #502c5c;
            border-radius: 4px;
            cursor: pointer;
            appearance: none;
            -webkit-appearance: none;
            margin-left: 10px;
        }
        .hft-checkbox input[type="checkbox"]:checked {
            background: #0cb114;
            border-color: #0cb114;
        }
        .hft-checkbox input[type="checkbox"]:checked::before {
            content: '';
            display: block;
            width: 10px;
            height: 5px;
            border-left: 2px solid #fff;
            border-bottom: 2px solid #fff;
            transform: rotate(-45deg);
            position: relative;
            top: 3px;
            left: 2px;
        }
        .toggle-btn {
            background: #3b3b3b !important;
            border: none;
            color: #e0e0e0 !important;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            text-align: left;
            margin: 8px 0;
            width: 100%;
            box-sizing: border-box;
            white-space: nowrap;
            transition: background 0.3s ease, color 0.3s ease;
        }
        .toggle-btn.enabled {
            background: #1a3c1a !important;
            color: #0cb114 !important;
        }
        .toggle-btn.disabled {
            background: #3b3b3b !important;
            color: #e0e0e0 !important;
        }
        .toggle-btn:hover {
            background: #4b4b4b !important;
        }
        .hft-profile-container {
            transition: all 0.3s ease;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        #soundcloud-player-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
            cursor: move;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        #soundcloud-player-container button {
            position: absolute;
            bottom: -30px;
            right: 0;
            z-index: 1001;
            background: #ff4444;
            color: #fff;
            border: none;
            border-radius: 3px;
            padding: 5px 10px;
            cursor: pointer;
            display: none;
        }
    `;
    try {
        GM_addStyle(style);
    } catch (e) {}

    const defaultSettings = {
        backgrounds: [],
        slideshows: [],
        customPages: [],
        mainBackground: null,
        slideshowState: {
            currentIndex: 0,
            currentSlideshowName: null,
            shuffledOrder: [],
            lastIndex: -1,
            fadeStartTime: 0,
            fadeDuration: 0,
            currentUrl: null,
            previousUrl: null
        },
        profileSettings: {
            pictureAlignment: 'left',
            disableBanner: false,
            removeProfileBar: false,
            removeNavbar: false,
            removeLogo: false
        },
        defaultProfileSettings: {
            pictureAlignment: 'left',
            disableBanner: false,
            removeProfileBar: false,
            removeNavbar: false,
            removeLogo: false
        },
        themerLink: {
            profileUrl: '',
            themerId: '',
            config: null
        },
        themerConfigs: {}
    };

    function sanitizeSettings(stored) {
        const settings = { ...defaultSettings };
        if (stored && typeof stored === 'object') {
            settings.backgrounds = Array.isArray(stored.backgrounds) ? stored.backgrounds.filter(bg => bg && bg.name && bg.url) : [];
            settings.slideshows = Array.isArray(stored.slideshows) ? stored.slideshows.filter(ss => ss && ss.name) : [];
            settings.customPages = Array.isArray(stored.customPages) ? stored.customPages.filter(cp => cp && cp.url && cp.backgroundName) : [];
            settings.mainBackground = stored.mainBackground && ['background', 'slideshow'].includes(stored.mainBackground.type) && stored.mainBackground.name ? stored.mainBackground : null;
            settings.slideshowState = stored.slideshowState && typeof stored.slideshowState.currentIndex === 'number' ? stored.slideshowState : { ...defaultSettings.slideshowState };
            settings.profileSettings = stored.profileSettings && typeof stored.profileSettings === 'object' ? {
                pictureAlignment: ['left', 'center', 'right'].includes(stored.profileSettings.pictureAlignment) ? stored.profileSettings.pictureAlignment : 'left',
                disableBanner: !!stored.profileSettings.disableBanner,
                removeProfileBar: !!stored.profileSettings.removeProfileBar,
                removeNavbar: !!stored.profileSettings.removeNavbar,
                removeLogo: !!stored.profileSettings.removeLogo
            } : { ...defaultSettings.profileSettings };
            settings.defaultProfileSettings = stored.defaultProfileSettings && typeof stored.defaultProfileSettings === 'object' ? {
                pictureAlignment: ['left', 'center', 'right'].includes(stored.defaultProfileSettings.pictureAlignment) ? stored.defaultProfileSettings.pictureAlignment : 'left',
                disableBanner: !!stored.defaultProfileSettings.disableBanner,
                removeProfileBar: !!stored.defaultProfileSettings.removeProfileBar,
                removeNavbar: !!stored.defaultProfileSettings.removeNavbar,
                removeLogo: !!stored.defaultProfileSettings.removeLogo
            } : { ...defaultSettings.defaultProfileSettings };
            settings.themerLink = stored.themerLink && typeof stored.themerLink === 'object' ? {
                profileUrl: typeof stored.themerLink.profileUrl === 'string' ? stored.themerLink.profileUrl : '',
                themerId: typeof stored.themerLink.themerId === 'string' ? stored.themerLink.themerId : '',
                config: stored.themerLink.config || null
            } : { ...defaultSettings.themerLink };
            settings.themerConfigs = stored.themerConfigs && typeof stored.themerConfigs === 'object' ? stored.themerConfigs : {};
        }
        return settings;
    }

    let settings;
    try {
        settings = sanitizeSettings(GM_getValue('hft_settings', defaultSettings));
        GM_setValue('hft_settings', settings);
    } catch (e) {
        settings = { ...defaultSettings };
    }

    function saveSettings() {
        try {
            GM_setValue('hft_settings', settings);
        } catch (e) {}
    }

    function resetSettings() {
        try {
            GM_deleteValue('hft_settings');
            settings = { ...defaultSettings };
            saveSettings();
            applyPageBackground();
            applyProfileCustomizations();
        } catch (e) {}
    }

    let themerCache = {
        configs: {},
        lastFetched: 0
    };
    const CACHE_DURATION = 10 * 1000;
    const DB_URL = 'https://tinyurl.com/themerlinkprofiles';
    let currentBackgroundUrl = null;
    let soundcloudLoaded = false;

    function generateThemerId() {
        const numbers = Math.floor(1000 + Math.random() * 9000);
        const letters1 = Array(4).fill().map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
        const mixed = Array(8).fill().map(() => Math.random() > 0.5 ? String.fromCharCode(65 + Math.floor(Math.random() * 26)) : Math.floor(Math.random() * 10)).join('');
        return `ThemerID:${numbers}X${letters1}x${mixed}`;
    }

    async function resolveRedirect(url) {
    try {
        const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
        return response.url;
    } catch (e) {
        console.error('Failed to resolve redirect:', e);
        return url;
    }
}


    async function fetchThemerDb() {
    try {
        const now = Date.now();
        if (now - themerCache.lastFetched < CACHE_DURATION) {
            return themerCache.configs;
        }
        // Resolve the redirect URL to get the final URL
        const resolvedUrl = await resolveRedirect(DB_URL);
        const response = await fetch(resolvedUrl, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to fetch Themer DB');
        const text = await response.text();
        const configs = {};
        text.split('\n\n').forEach(entry => {
            try {
                const config = JSON.parse(entry);
                if (config.themerId && config.profileUrl) {
                    configs[config.profileUrl] = config;
                }
            } catch (e) {}
        });
        themerCache.configs = configs;
        themerCache.lastFetched = now;
        return configs;
    } catch (e) {
        console.error('Error fetching Themer DB:', e);
        return themerCache.configs;
    }
}

    function applySoundCloudPlayer(soundcloudUrl) {
        if (!soundcloudUrl || !window.location.href.includes('member.php?action=profile')) return;

        $('#soundcloud-player-container').remove();

        const playerContainer = $('<div>', {
            id: 'soundcloud-player-container',
            css: {
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 1000,
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '10px',
                cursor: 'move',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }
        });

        const playerIframe = $('<iframe>', {
            id: 'soundcloud-widget',
            width: '500',
            height: '100',
            scrolling: 'no',
            frameborder: 'no',
            allow: 'autoplay',
            src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(soundcloudUrl)}&auto_play=false`
        });

        const closeButton = $('<button>', {
            text: 'Close',
            css: {
                position: 'absolute',
                bottom: '-30px',
                right: '0',
                zIndex: 1001,
                background: '#ff4444',
                color: '#fff',
                border: 'none',
                borderRadius: '3px',
                padding: '5px 10px',
                cursor: 'pointer',
                display: 'none'
            }
        }).on('click', function() {
            widget.pause();
            playerContainer.remove();
        });

        playerContainer.append(playerIframe).append(closeButton);
        $('body').append(playerContainer);

        const widget = SC.Widget('soundcloud-widget');
        widget.bind(SC.Widget.Events.READY, function() {
            widget.pause();
        });

        let hoverTimeout;
        let hideTimeout;
        playerContainer.on('mouseenter', function() {
            clearTimeout(hideTimeout);
            hoverTimeout = setTimeout(function() {
                closeButton.fadeIn(200);
            }, 700);
        }).on('mouseleave', function() {
            clearTimeout(hoverTimeout);
            hideTimeout = setTimeout(function() {
                closeButton.fadeOut(200);
            }, 900);
        });

        closeButton.on('mouseenter', function() {
            clearTimeout(hideTimeout);
            closeButton.show();
        }).on('mouseleave', function() {
            hideTimeout = setTimeout(function() {
                closeButton.fadeOut(200);
            }, 900);
        });

        let isDragging = false;
        let currentX;
        let currentY;
        let xOffset = 0;
        let yOffset = 0;

        playerContainer.on('mousedown', function(e) {
            if ($(e.target).is(closeButton)) return;
            isDragging = true;
            currentX = e.clientX - xOffset;
            currentY = e.clientY - yOffset;
            playerContainer.css('cursor', 'grabbing');
        });

        $(document).on('mousemove', function(e) {
            if (isDragging) {
                xOffset = e.clientX - currentX;
                yOffset = e.clientY - currentY;
                playerContainer.css({
                    right: `calc(20px - ${xOffset}px)`,
                    top: `calc(20px + ${yOffset}px)`
                });
            }
        });

        $(document).on('mouseup', function() {
            isDragging = false;
            playerContainer.css('cursor', 'move');
        });
    }

    function applyThemerConfig(config, isInitialLoad = false) {
        try {
            if (!config) return;

            settings.profileSettings = { ...config.profileSettings };
            applyProfileCustomizations();

            if (config.backgroundUrl && config.backgroundUrl !== currentBackgroundUrl) {
                currentBackgroundUrl = config.backgroundUrl;
                const bgName = `Themer_${config.themerId}`;
                const tempBackgrounds = [
                    ...settings.backgrounds.filter(bg => bg.name !== bgName),
                    { name: bgName, url: config.backgroundUrl }
                ];
                const tempCustomPages = [
                    ...settings.customPages.filter(page => !page.url.includes('member.php?action=profile')),
                    { url: config.profileUrl, backgroundName: bgName }
                ];
                applyPageBackground(tempBackgrounds, tempCustomPages);
            }

            if (isInitialLoad && config.soundcloudUrl && !soundcloudLoaded) {
                applySoundCloudPlayer(config.soundcloudUrl);
                soundcloudLoaded = true;
            }
        } catch (e) {
            console.error('Failed to apply themer config:', e);
        }
    }

    function restoreDefaultProfileSettings() {
        try {
            settings.profileSettings = { ...settings.defaultProfileSettings };
            applyProfileCustomizations();
            currentBackgroundUrl = null;
            soundcloudLoaded = false;
            $('#soundcloud-player-container').remove();
            applyPageBackground();
        } catch (e) {}
    }

    let pollingInterval = null;

    async function startBackgroundPolling() {
        if (pollingInterval) clearInterval(pollingInterval);
        pollingInterval = setInterval(async () => {
            try {
                const currentUrl = window.location.href;
                if (!currentUrl.includes('member.php?action=profile')) {
                    if (pollingInterval) clearInterval(pollingInterval);
                    restoreDefaultProfileSettings();
                    return;
                }
                const configs = await fetchThemerDb();
                const config = configs[currentUrl];
                if (config) {
                    applyThemerConfig(config);
                } else {
                    restoreDefaultProfileSettings();
                }
            } catch (e) {
                console.error('Background polling error:', e);
            }
        }, 25000);
    }

    async function checkThemerLink() {
        try {
            const currentUrl = window.location.href;
            if (!currentUrl.includes('member.php?action=profile')) {
                restoreDefaultProfileSettings();
                if (pollingInterval) clearInterval(pollingInterval);
                return;
            }
            soundcloudLoaded = false;
            const configs = await fetchThemerDb();
            const config = configs[currentUrl];
            if (config) {
                applyThemerConfig(config, true);
            } else {
                restoreDefaultProfileSettings();
            }
            startBackgroundPolling();
        } catch (e) {
            restoreDefaultProfileSettings();
        }
    }

    let bgOverlay1, bgOverlay2;
    let activeOverlay = 1;
    try {
        bgOverlay1 = document.createElement('div');
        bgOverlay1.id = 'hft-bg-overlay-1';
        document.body.appendChild(bgOverlay1);

        bgOverlay2 = document.createElement('div');
        bgOverlay2.id = 'hft-bg-overlay-2';
        document.body.appendChild(bgOverlay2);
    } catch (e) {}

    let homeIcon;
    try {
        homeIcon = document.createElement('i');
        homeIcon.id = 'hft-home-icon';
        homeIcon.className = 'fa fa-home';
        homeIcon.setAttribute('aria-hidden', 'true');
        homeIcon.onclick = () => {
            window.location.href = 'https://hackforums.net';
        };
        document.body.appendChild(homeIcon);
    } catch (e) {}

    function waitForTransition(overlay) {
        return new Promise(resolve => {
            const onTransitionEnd = () => {
                overlay.removeEventListener('transitionend', onTransitionEnd);
                resolve();
            };
            overlay.addEventListener('transitionend', onTransitionEnd);
        });
    }

    async function applyBackground(url, transitionDuration, resumeFade = false) {
        try {
            if (!bgOverlay1 || !bgOverlay2) return;
            if (!url) return;

            const overlayToFadeOut = activeOverlay === 1 ? bgOverlay1 : bgOverlay2;
            const overlayToFadeIn = activeOverlay === 1 ? bgOverlay2 : bgOverlay1;

            let fadeProgress = 0;
            if (resumeFade && settings.slideshowState.fadeStartTime && settings.slideshowState.fadeDuration) {
                const elapsed = Date.now() - settings.slideshowState.fadeStartTime;
                fadeProgress = Math.min(elapsed / settings.slideshowState.fadeDuration, 1);
            }

            overlayToFadeOut.style.opacity = resumeFade ? (1 - fadeProgress) : '1';
            overlayToFadeIn.style.opacity = resumeFade ? fadeProgress : '0';
            overlayToFadeIn.style.background = '';

            const remainingDuration = resumeFade ? (1 - fadeProgress) * transitionDuration : transitionDuration;
            overlayToFadeOut.style.transition = `opacity ${remainingDuration / 1000}s ease`;
            overlayToFadeIn.style.transition = `opacity ${remainingDuration / 1000}s ease`;

            overlayToFadeIn.style.background = `url("${url}") no-repeat center center fixed`;
            overlayToFadeIn.style.backgroundSize = 'cover';

            settings.slideshowState.fadeStartTime = Date.now();
            settings.slideshowState.fadeDuration = transitionDuration;
            saveSettings();

            overlayToFadeOut.style.opacity = '0';
            overlayToFadeIn.style.opacity = '1';

            await Promise.race([
                waitForTransition(overlayToFadeIn),
                new Promise(resolve => setTimeout(resolve, remainingDuration + 100))
            ]);

            settings.slideshowState.fadeStartTime = 0;
            settings.slideshowState.fadeDuration = 0;
            saveSettings();

            activeOverlay = activeOverlay === 1 ? 2 : 1;
        } catch (e) {}
    }

    async function clearBackground(transitionDuration) {
        try {
            if (!bgOverlay1 || !bgOverlay2) return;
            bgOverlay1.style.transition = `opacity ${transitionDuration / 1000}s ease`;
            bgOverlay2.style.transition = `opacity ${transitionDuration / 1000}s ease`;
            bgOverlay1.style.opacity = '0';
            bgOverlay2.style.opacity = '0';
            await Promise.race([
                waitForTransition(bgOverlay1),
                new Promise(resolve => setTimeout(resolve, transitionDuration + 100))
            ]);
            bgOverlay1.style.background = '';
            bgOverlay1.style.backgroundSize = '';
            bgOverlay2.style.background = '';
            bgOverlay2.style.backgroundSize = '';
            settings.slideshowState.fadeStartTime = 0;
            settings.slideshowState.fadeDuration = 0;
            saveSettings();
        } catch (e) {}
    }

    function applyProfileCustomizations() {
        try {
            if (!window.location.href.includes('member.php?action=profile&uid=')) return;

            const applyAlignment = () => {
                let profileDiv = document.querySelector('div[style*="display: flex; position: absolute; flex-direction: column;"]');
                if (!profileDiv) {
                    profileDiv = document.querySelector('.Aligner div[style*="position: absolute"] img[src*="hackforums.net/uploads/avatars/"]')?.closest('div[style*="position: absolute"]');
                }
                if (profileDiv) {
                    profileDiv.classList.add('hft-profile-container');
                    const baseStyles = "display: flex; position: absolute; flex-direction: column; justify-content: center; text-align: center;";
                    let positionStyles = "";
                    if (settings.profileSettings.pictureAlignment === 'center') {
                        positionStyles = "left: 50%; right: auto; transform: translateX(-50%);";
                    } else if (settings.profileSettings.pictureAlignment === 'right') {
                        positionStyles = "left: auto; right: 64px; transform: none;";
                    } else {
                        positionStyles = "left: 64px; right: auto; transform: none;";
                    }
                    profileDiv.setAttribute('style', `${baseStyles} ${positionStyles}`);
                    profileDiv.style.transition = 'all 0.3s ease';
                    return true;
                } else {
                    return false;
                }
            };

            if (!applyAlignment()) {
                const observer = new MutationObserver((mutations, obs) => {
                    if (applyAlignment()) {
                        obs.disconnect();
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
                setTimeout(() => {
                    observer.disconnect();
                }, 10000);
            }

            if (settings.profileSettings.disableBanner) {
                const bannerContainer = document.querySelector('.Aligner-item--fixed');
                if (bannerContainer) {
                    const bannerImg = bannerContainer.querySelector('img');
                    if (bannerImg) {
                        bannerImg.remove();
                    }
                }
                const alignerDiv = document.querySelector('.Aligner[style*="overflow: hidden"][style*="position: relative"][style*="text-align: center"]');
                if (alignerDiv) {
                    alignerDiv.style.backgroundColor = 'transparent';
                }
            }

            const breadcrumb = document.querySelector('.breadcrumb');
            if (settings.profileSettings.removeProfileBar && breadcrumb) {
                breadcrumb.remove();
            }

            const panel = document.querySelector('#panel');
            if (settings.profileSettings.removeNavbar && panel) {
                panel.remove();
            }

            const logoWrapper = document.querySelector('.wrapper > a.logo-a');
            if (settings.profileSettings.removeLogo) {
                if (logoWrapper && logoWrapper.parentElement) {
                    logoWrapper.parentElement.remove();
                }
                if (homeIcon) {
                    homeIcon.style.display = 'block';
                }
            } else {
                if (homeIcon) {
                    homeIcon.style.display = 'none';
                }
            }
        } catch (e) {}
    }

    async function applyPageBackground(tempBackgrounds = settings.backgrounds, tempCustomPages = settings.customPages) {
        try {
            const currentUrl = window.location.href;

            settings.slideshowState.previousUrl = settings.slideshowState.currentUrl;
            settings.slideshowState.currentUrl = currentUrl;
            saveSettings();

            const pageSetting = tempCustomPages.find(page => page && currentUrl.includes(page.url));
            if (pageSetting) {
                const bg = getBackgroundOrSlideshow(pageSetting.backgroundName, tempBackgrounds);
                if (bg) {
                    const transitionDuration = bg.fadeSpeed ? Math.min(bg.fadeSpeed * 0.1, 2000) : 2000;
                    const resumeFade = settings.slideshowState.fadeStartTime > 0 && settings.slideshowState.fadeDuration > 0;
                    await applyBackground(bg.url, transitionDuration, resumeFade);
                    return;
                }
            }
            if (settings.mainBackground) {
                const bg = getBackgroundOrSlideshow(settings.mainBackground.name, tempBackgrounds);
                if (bg) {
                    const transitionDuration = bg.fadeSpeed ? Math.min(bg.fadeSpeed * 0.1, 2000) : 2000;
                    const resumeFade = settings.slideshowState.fadeStartTime > 0 && settings.slideshowState.fadeDuration > 0;
                    await applyBackground(bg.url, transitionDuration, resumeFade);
                    return;
                }
            }
            await clearBackground(2000);
        } catch (e) {}
    }

    function getBackgroundOrSlideshow(name, backgrounds = settings.backgrounds) {
        try {
            const bg = backgrounds.find(b => b.name === name);
            if (bg) return bg;
            const ss = settings.slideshows.find(s => s.name === name);
            if (ss && ss.urls && ss.urls.length > 0) {
                const urls = settings.slideshowState.shuffledOrder.length === ss.urls.length ? settings.slideshowState.shuffledOrder : ss.urls;
                const currentBg = backgrounds.find(b => b.name === urls[currentIndex % urls.length]);
                if (currentBg) return { ...currentBg, fadeSpeed: ss.fadeSpeed };
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    let currentSlideshow = null;
    let currentIndex = settings.slideshowState.currentIndex || 0;
    let lastUpdateTime = Date.now();
    let isSlideshowRunning = false;

    async function runSlideshow(timestamp) {
        try {
            if (!isSlideshowRunning) return;

            const currentUrl = window.location.href;
            let activeSlideshow = null;
            const pageSetting = settings.customPages.find(page => page && currentUrl.includes(page.url));
            if (pageSetting && pageSetting.backgroundName) {
                const ss = settings.slideshows.find(s => s.name === pageSetting.backgroundName);
                if (ss) activeSlideshow = ss;
            }
            if (!activeSlideshow && settings.mainBackground && settings.mainBackground.type === 'slideshow') {
                const ss = settings.slideshows.find(s => s.name === settings.mainBackground.name);
                if (ss) activeSlideshow = ss;
            }

            if (!activeSlideshow || !activeSlideshow.urls || activeSlideshow.urls.length === 0) {
                currentSlideshow = null;
                settings.slideshowState.currentSlideshowName = null;
                settings.slideshowState.shuffledOrder = [];
                settings.slideshowState.lastIndex = -1;
                settings.slideshowState.fadeStartTime = 0;
                settings.slideshowState.fadeDuration = 0;
                saveSettings();
                isSlideshowRunning = false;
                return;
            }

            if (currentSlideshow !== activeSlideshow) {
                currentSlideshow = activeSlideshow;
                settings.slideshowState.currentSlideshowName = currentSlideshow.name;
                if (settings.slideshowState.shuffledOrder.length !== currentSlideshow.urls.length || settings.slideshowState.currentSlideshowName !== currentSlideshow.name) {
                    settings.slideshowState.shuffledOrder = shuffleArray(currentSlideshow.urls);
                    currentIndex = 0;
                    settings.slideshowState.currentIndex = currentIndex;
                    settings.slideshowState.lastIndex = -1;
                } else {
                    currentIndex = settings.slideshowState.currentIndex || 0;
                }
                lastUpdateTime = Date.now();
                saveSettings();
            }

            const elapsed = Date.now() - lastUpdateTime;
            if (elapsed >= currentSlideshow.fadeSpeed) {
                const urls = settings.slideshowState.shuffledOrder;
                let nextIndex = currentIndex % urls.length;
                if (urls.length > 1 && nextIndex === settings.slideshowState.lastIndex) {
                    nextIndex = (nextIndex + 1) % urls.length;
                }
                const bg = settings.backgrounds.find(b => b.name === urls[nextIndex]);
                if (bg) {
                    const transitionDuration = Math.min(currentSlideshow.fadeSpeed * 0.1, 2000);
                    await applyBackground(bg.url, transitionDuration);
                }
                currentIndex = (nextIndex + 1) % urls.length;
                settings.slideshowState.currentIndex = currentIndex;
                settings.slideshowState.lastIndex = nextIndex;
                saveSettings();
                lastUpdateTime = Date.now();
            }

            requestAnimationFrame(runSlideshow);
        } catch (e) {
            isSlideshowRunning = false;
        }
    }

    function startSlideshow() {
        if (!isSlideshowRunning) {
            isSlideshowRunning = true;
            lastUpdateTime = Date.now();
            requestAnimationFrame(runSlideshow);
        }
    }

    let lastUrl = window.location.href;
    let isApplyingBackground = false;
    async function checkNavigation() {
        try {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl && !isApplyingBackground) {
                lastUrl = currentUrl;
                isApplyingBackground = true;
                await checkThemerLink();
                await applyPageBackground();
                startSlideshow();
                isApplyingBackground = false;
            }
            requestAnimationFrame(checkNavigation);
        } catch (e) {
            isApplyingBackground = false;
        }
    }
    try {
        requestAnimationFrame(checkNavigation);
    } catch (e) {}

    let mainUI, settingsUI, aboutUI, themerUI, backgroundOptionsUI, customizeBgUI, manageBgUI, manageSlideshowUI, createSlideshowUI, customizeMainBgUI, customizePageBgUI, pageRulesUI, addBgPopupUI, activeCustomizationsUI, errorPopup, forumOptionsUI, profilesUI, themerLinkUI, themerLinkMainUI;
    try {
        mainUI = document.createElement('div');
        mainUI.id = 'hft-main-ui';
        document.body.appendChild(mainUI);

        settingsUI = document.createElement('div');
        settingsUI.id = 'hft-settings-ui';
        document.body.appendChild(settingsUI);

        aboutUI = document.createElement('div');
        aboutUI.id = 'hft-about-ui';
        document.body.appendChild(aboutUI);

        themerUI = document.createElement('div');
        themerUI.id = 'hft-themer-ui';
        document.body.appendChild(themerUI);

        backgroundOptionsUI = document.createElement('div');
        backgroundOptionsUI.id = 'hft-background-options-ui';
        document.body.appendChild(backgroundOptionsUI);

        customizeBgUI = document.createElement('div');
        customizeBgUI.id = 'hft-customize-bg-ui';
        document.body.appendChild(customizeBgUI);

        manageBgUI = document.createElement('div');
        manageBgUI.id = 'hft-manage-bg-ui';
        document.body.appendChild(manageBgUI);

        manageSlideshowUI = document.createElement('div');
        manageSlideshowUI.id = 'hft-manage-slideshow-ui';
        document.body.appendChild(manageSlideshowUI);

        createSlideshowUI = document.createElement('div');
        createSlideshowUI.id = 'hft-create-slideshow-ui';
        document.body.appendChild(createSlideshowUI);

        customizeMainBgUI = document.createElement('div');
        customizeMainBgUI.id = 'hft-customize-main-bg-ui';
        document.body.appendChild(customizeMainBgUI);

        customizePageBgUI = document.createElement('div');
        customizePageBgUI.id = 'hft-customize-page-bg-ui';
        document.body.appendChild(customizePageBgUI);

        pageRulesUI = document.createElement('div');
        pageRulesUI.id = 'hft-page-rules-ui';
        document.body.appendChild(pageRulesUI);

        addBgPopupUI = document.createElement('div');
        addBgPopupUI.id = 'hft-add-bg-popup-ui';
        document.body.appendChild(addBgPopupUI);

        activeCustomizationsUI = document.createElement('div');
        activeCustomizationsUI.id = 'hft-active-customizations-ui';
        document.body.appendChild(activeCustomizationsUI);

        errorPopup = document.createElement('div');
        errorPopup.id = 'hft-error-popup';
        document.body.appendChild(errorPopup);

        forumOptionsUI = document.createElement('div');
        forumOptionsUI.id = 'hft-forum-options-ui';
        document.body.appendChild(forumOptionsUI);

        profilesUI = document.createElement('div');
        profilesUI.id = 'hft-profiles-ui';
        document.body.appendChild(profilesUI);

        themerLinkUI = document.createElement('div');
        themerLinkUI.id = 'hft-themer-link-ui';
        document.body.appendChild(themerLinkUI);

        themerLinkMainUI = document.createElement('div');
        themerLinkMainUI.id = 'hft-themer-link-main-ui';
        document.body.appendChild(themerLinkMainUI);
    } catch (e) {
        return;
    }

    function showErrorPopup(message) {
        try {
            errorPopup.innerHTML = `
                <h2>${message.includes('Success') ? 'Success' : 'Error'}</h2>
                <p>${message}</p>
                <div class="buttons">
                    <button class="ok">OK</button>
                </div>
            `;
            hideAllUIs();
            errorPopup.style.display = 'flex';
            const okButton = errorPopup.querySelector('.ok');
            if (okButton) {
                okButton.onclick = () => {
                    errorPopup.style.display = 'none';
                    renderMainUI();
                };
            }
        } catch (e) {}
    }

    function hideAllUIs() {
        try {
            [mainUI, settingsUI, aboutUI, themerUI, backgroundOptionsUI, customizeBgUI, manageBgUI, manageSlideshowUI, createSlideshowUI, customizeMainBgUI, customizePageBgUI, pageRulesUI, addBgPopupUI, activeCustomizationsUI, errorPopup, forumOptionsUI, profilesUI, themerLinkUI, themerLinkMainUI].forEach(ui => {
                if (ui) ui.style.display = 'none';
            });
        } catch (e) {}
    }

    function renderMainUI() {
        try {
            mainUI.innerHTML = `
                <div class="header">
                    <h2>HackForums Themer</h2>
                </div>
                <div class="button-container">
                    <button id="hft-themer-btn">Themer</button>
                    <button id="hft-settings-btn">Settings</button>
                </div>
            `;
            hideAllUIs();
            mainUI.style.display = 'flex';
            const themerBtn = document.getElementById('hft-themer-btn');
            const settingsBtn = document.getElementById('hft-settings-btn');
            if (themerBtn) themerBtn.onclick = showThemerUI;
            if (settingsBtn) settingsBtn.onclick = showSettingsUI;
        } catch (e) {
            showErrorPopup('Failed to render UI.');
        }
    }

    function showThemerUI() {
        try {
            renderThemerUI();
        } catch (e) {
            showErrorPopup('Failed to open Themer.');
        }
    }

    function renderThemerUI() {
        try {
            themerUI.innerHTML = `
                <div class="header">
                    <h2>Themer</h2>
                </div>
                <div class="button-container">
                    <button id="hft-background-options-btn">Background Options</button>
                    <button id="hft-forum-options-btn">Forum Options</button>
                    <button id="hft-themer-link-btn">Themer Link</button>
                    <button class="cancel">Close</button>
                </div>
            `;
            hideAllUIs();
            themerUI.style.display = 'flex';
            const backgroundOptionsBtn = document.getElementById('hft-background-options-btn');
            const forumOptionsBtn = document.getElementById('hft-forum-options-btn');
            const themerLinkBtn = document.getElementById('hft-themer-link-btn');
            const cancelBtn = themerUI.querySelector('.cancel');
            if (backgroundOptionsBtn) backgroundOptionsBtn.onclick = showBackgroundOptionsUI;
            if (forumOptionsBtn) forumOptionsBtn.onclick = showForumOptionsUI;
            if (themerLinkBtn) themerLinkBtn.onclick = showThemerLinkUI;
            if (cancelBtn) cancelBtn.onclick = renderMainUI;
        } catch (e) {
            showErrorPopup('Failed to render Themer.');
        }
    }

    function showThemerLinkUI() {
        try {
            renderThemerLinkUI();
        } catch (e) {
            showErrorPopup('Failed to open Themer Link.');
        }
    }

    function renderThemerLinkUI() {
        try {
            themerLinkUI.innerHTML = `
                <div class="header">
                    <h2>Themer Link</h2>
                </div>
                <div class="input-group">
                    <label>Profile URL:</label>
                    <input id="hft-themer-profile-url" placeholder="Enter your profile URL" value="${settings.themerLink.profileUrl}" />
                </div>
                <div class="button-container">
                    <button id="hft-save-themer-link-btn">Save</button>
                    <button class="cancel">Cancel</button>
                </div>
            `;
            hideAllUIs();
            themerLinkUI.style.display = 'flex';
            const saveBtn = document.getElementById('hft-save-themer-link-btn');
            const cancelBtn = themerLinkUI.querySelector('.cancel');
            if (saveBtn) {
                saveBtn.onclick = () => {
                    try {
                        const profileUrl = document.getElementById('hft-themer-profile-url').value.trim();
                        if (!profileUrl.includes('member.php?action=profile')) {
                            showErrorPopup('Please provide a valid profile URL.');
                            return;
                        }
                        settings.themerLink.profileUrl = profileUrl;
                        if (!settings.themerLink.themerId) {
                            settings.themerLink.themerId = generateThemerId();
                        }
                        saveSettings();
                        showErrorPopup('Success: Themer Link ID Set');
                        setTimeout(() => {
                            showThemerLinkMainUI();
                        }, 1000);
                    } catch (e) {
                        showErrorPopup('Failed to save themer link.');
                    }
                };
            }
            if (cancelBtn) cancelBtn.onclick = showThemerUI;
        } catch (e) {
            showErrorPopup('Failed to render Themer Link.');
        }
    }

    function showThemerLinkMainUI() {
        try {
            renderThemerLinkMainUI();
        } catch (e) {
            showErrorPopup('Failed to open Themer Link Main UI.');
        }
    }

    function renderThemerLinkMainUI() {
        try {
            const backgrounds = Array.isArray(settings.backgrounds) ? settings.backgrounds : [];
            const slideshows = Array.isArray(settings.slideshows) ? settings.slideshows : [];
            const profilePage = settings.customPages.find(page => page.url === settings.themerLink.profileUrl) || { backgroundName: '' };
            const soundcloudUrl = settings.themerLink.config?.soundcloudUrl || '';

            const toggleState = {
                disableBanner: settings.profileSettings.disableBanner,
                removeProfileBar: settings.profileSettings.removeProfileBar,
                removeNavbar: settings.profileSettings.removeNavbar,
                removeLogo: settings.profileSettings.removeLogo
            };

            themerLinkMainUI.innerHTML = `
                <div class="header">
                    <h2>Themer Link Customization - ${settings.themerLink.themerId}</h2>
                </div>
                <div class="input-group">
                    <label>Profile Page Background:</label>
                    <select id="hft-themer-page-bg-select">
                        <option value="">None</option>
                        ${backgrounds.map(bg => `
                            <option value="background:${bg.name}" ${profilePage.backgroundName === bg.name ? 'selected' : ''}>Background: ${bg.name}</option>
                        `).join('')}
                        ${slideshows.map(ss => `
                            <option value="slideshow:${ss.name}" ${profilePage.backgroundName === ss.name ? 'selected' : ''}>Slideshow: ${ss.name}</option>
                        `).join('')}
                    </select>
                    <label>Profile Picture Alignment:</label>
                    <select id="hft-themer-picture-alignment">
                        <option value="left" ${settings.profileSettings.pictureAlignment === 'left' ? 'selected' : ''}>Left</option>
                        <option value="center" ${settings.profileSettings.pictureAlignment === 'center' ? 'selected' : ''}>Center</option>
                        <option value="right" ${settings.profileSettings.pictureAlignment === 'right' ? 'selected' : ''}>Right</option>
                    </select>
                    <button id="hft-themer-disable-banner" class="toggle-btn ${toggleState.disableBanner ? 'enabled' : 'disabled'}">Disable profile banner</button>
                    <button id="hft-themer-remove-profile-bar" class="toggle-btn ${toggleState.removeProfileBar ? 'enabled' : 'disabled'}">Remove profile bar</button>
                    <button id="hft-themer-remove-navbar" class="toggle-btn ${toggleState.removeNavbar ? 'enabled' : 'disabled'}">Remove navbar</button>
                    <button id="hft-themer-remove-logo" class="toggle-btn ${toggleState.removeLogo ? 'enabled' : 'disabled'}">Remove logo</button>
                    <label>SoundCloud Player:</label>
                    <input id="hft-themer-soundcloud-url" placeholder="Enter SoundCloud track URL" value="${soundcloudUrl}" />
                </div>
                <div class="button-container">
                    <button id="hft-themer-set-active-btn">Set as Active</button>
                    <button id="hft-themer-export-btn">Export Themer Link</button>
                    <button class="cancel">Cancel</button>
                </div>
            `;
            hideAllUIs();
            themerLinkMainUI.style.display = 'flex';

            const setActiveBtn = document.getElementById('hft-themer-set-active-btn');
            const exportBtn = document.getElementById('hft-themer-export-btn');
            const cancelBtn = themerLinkMainUI.querySelector('.cancel');

            const toggleButtons = [
                'hft-themer-disable-banner',
                'hft-themer-remove-profile-bar',
                'hft-themer-remove-navbar',
                'hft-themer-remove-logo'
            ];
            toggleButtons.forEach(id => {
                const btn = document.getElementById(id);
                if (btn) {
                    btn.onclick = () => {
                        const key = id.replace('hft-themer-', '').replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                        toggleState[key] = !toggleState[key];
                        btn.classList.remove('enabled', 'disabled');
                        btn.classList.add(toggleState[key] ? 'enabled' : 'disabled');
                    };
                }
            });

            if (setActiveBtn) {
                setActiveBtn.onclick = () => {
                    try {
                        const bgValue = document.getElementById('hft-themer-page-bg-select').value;
                        settings.customPages = settings.customPages.filter(page => page.url !== settings.themerLink.profileUrl);
                        if (bgValue) {
                            const [, name] = bgValue.split(':');
                            settings.customPages.push({
                                url: settings.themerLink.profileUrl,
                                backgroundName: name
                            });
                        }
                        settings.profileSettings.pictureAlignment = document.getElementById('hft-themer-picture-alignment').value;
                        settings.profileSettings.disableBanner = toggleState.disableBanner;
                        settings.profileSettings.removeProfileBar = toggleState.removeProfileBar;
                        settings.profileSettings.removeNavbar = toggleState.removeNavbar;
                        settings.profileSettings.removeLogo = toggleState.removeLogo;
                        settings.defaultProfileSettings = { ...settings.profileSettings };
                        settings.themerConfigs[settings.themerLink.profileUrl] = {
                            themerId: settings.themerLink.themerId,
                            profileUrl: settings.themerLink.profileUrl,
                            profileSettings: { ...settings.profileSettings },
                            backgroundUrl: bgValue ? (settings.backgrounds.find(bg => bg.name === name) || {}).url : '',
                            soundcloudUrl: document.getElementById('hft-themer-soundcloud-url').value.trim()
                        };
                        saveSettings();
                        applyPageBackground();
                        applyProfileCustomizations();
                        showErrorPopup('Success: Settings applied successfully.');
                        setTimeout(() => showThemerLinkMainUI(), 1000);
                    } catch (e) {
                        showErrorPopup('Failed to set active.');
                    }
                };
            }

            if (exportBtn) {
                exportBtn.onclick = () => {
                    try {
                        const bgValue = document.getElementById('hft-themer-page-bg-select').value;
                        const bgName = bgValue ? bgValue.split(':')[1] : '';
                        const bgUrl = bgName ? (settings.backgrounds.find(bg => bg.name === bgName) || {}).url : '';
                        const soundcloudUrl = document.getElementById('hft-themer-soundcloud-url').value.trim();
                        const config = {
                            themerId: settings.themerLink.themerId,
                            profileUrl: settings.themerLink.profileUrl,
                            profileSettings: {
                                pictureAlignment: document.getElementById('hft-themer-picture-alignment').value,
                                disableBanner: toggleState.disableBanner,
                                removeProfileBar: toggleState.removeProfileBar,
                                removeNavbar: toggleState.removeNavbar,
                                removeLogo: toggleState.removeLogo
                            },
                            backgroundUrl: bgUrl || '',
                            soundcloudUrl: soundcloudUrl || ''
                        };
                        settings.themerLink.config = config;
                        settings.defaultProfileSettings = { ...config.profileSettings };
                        saveSettings();
                        const blob = new Blob([JSON.stringify(config)], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${settings.themerLink.themerId}.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                        showErrorPopup('Success: Exported successfully, to activate please contact us!');
                        setTimeout(() => showThemerLinkMainUI(), 2000);
                    } catch (e) {
                        showErrorPopup('Failed to export Themer Link.');
                    }
                };
            }

            if (cancelBtn) cancelBtn.onclick = showThemerUI;
        } catch (e) {
            showErrorPopup('Failed to render Themer Link Main UI.');
        }
    }

    function showForumOptionsUI() {
        try {
            renderForumOptionsUI();
        } catch (e) {
            showErrorPopup('Failed to open Forum Options.');
        }
    }

    function renderForumOptionsUI() {
        try {
            forumOptionsUI.innerHTML = `
                <div class="header">
                    <h2>Forum Options</h2>
                </div>
                <div class="button-container">
                    <button id="hft-profiles-btn">Profiles</button>
                    <button id="hft-forum-btn">Forum</button>
                    <button class="cancel">Back</button>
                </div>
            `;
            hideAllUIs();
            forumOptionsUI.style.display = 'flex';
            const profilesBtn = document.getElementById('hft-profiles-btn');
            const forumBtn = document.getElementById('hft-forum-btn');
            const cancelBtn = forumOptionsUI.querySelector('.cancel');
            if (profilesBtn) profilesBtn.onclick = showProfilesUI;
            if (forumBtn) forumBtn.onclick = () => showErrorPopup('Forum options not implemented yet.');
            if (cancelBtn) cancelBtn.onclick = showThemerUI;
        } catch (e) {
            showErrorPopup('Failed to render Forum Options.');
        }
    }

    function showProfilesUI() {
        try {
            renderProfilesUI();
        } catch (e) {
            showErrorPopup('Failed to open Profiles.');
        }
    }

    function renderProfilesUI() {
        try {
            profilesUI.innerHTML = `
                <div class="header">
                    <h2>Profile Settings</h2>
                </div>
                <div class="input-group">
                    <label>Profile Picture Alignment:</label>
                    <select id="hft-picture-alignment">
                        <option value="left" ${settings.defaultProfileSettings.pictureAlignment === 'left' ? 'selected' : ''}>Left</option>
                        <option value="center" ${settings.defaultProfileSettings.pictureAlignment === 'center' ? 'selected' : ''}>Center</option>
                        <option value="right" ${settings.defaultProfileSettings.pictureAlignment === 'right' ? 'selected' : ''}>Right</option>
                    </select>
                    <div class="hft-checkbox">
                        <label class="hft-checkbox-label" for="hft-disable-banner">Disable Profile Banner</label>
                        <input type="checkbox" id="hft-disable-banner" ${settings.defaultProfileSettings.disableBanner ? 'checked' : ''}>
                    </div>
                    <div class="hft-checkbox">
                        <label class="hft-checkbox-label" for="hft-remove-profile-bar">Remove Profile Bar</label>
                        <input type="checkbox" id="hft-remove-profile-bar" ${settings.defaultProfileSettings.removeProfileBar ? 'checked' : ''}>
                    </div>
                    <div class="hft-checkbox">
                        <label class="hft-checkbox-label" for="hft-remove-navbar">Remove Profile Navbar</label>
                        <input type="checkbox" id="hft-remove-navbar" ${settings.defaultProfileSettings.removeNavbar ? 'checked' : ''}>
                    </div>
                    <div class="hft-checkbox">
                        <label class="hft-checkbox-label" for="hft-remove-logo">Remove Logo</label>
                        <input type="checkbox" id="hft-remove-logo" ${settings.defaultProfileSettings.removeLogo ? 'checked' : ''}>
                    </div>
                </div>
                <div class="button-container">
                    <button id="hft-save-profile-btn">Save</button>
                    <button class="cancel">Cancel</button>
                </div>
            `;
            hideAllUIs();
            profilesUI.style.display = 'flex';
            const saveBtn = document.getElementById('hft-save-profile-btn');
            const cancelBtn = profilesUI.querySelector('.cancel');
            if (saveBtn) {
                saveBtn.onclick = () => {
                    try {
                        const newAlignment = document.getElementById('hft-picture-alignment').value;
                        const profileDiv = document.querySelector('.Aligner-item:not(.Aligner-item--fixed) div[style*="position: absolute"]');
                        if (profileDiv) {
                            profileDiv.style.transition = 'all 0.3s ease';
                        }
                        settings.defaultProfileSettings = {
                            pictureAlignment: newAlignment,
                            disableBanner: document.getElementById('hft-disable-banner').checked,
                            removeProfileBar: document.getElementById('hft-remove-profile-bar').checked,
                            removeNavbar: document.getElementById('hft-remove-navbar').checked,
                            removeLogo: document.getElementById('hft-remove-logo').checked
                        };
                        restoreDefaultProfileSettings();
                        applyProfileCustomizations();
                        if (profileDiv) {
                            profileDiv.style.opacity = '0';
                            setTimeout(() => {
                                profileDiv.style.opacity = '1';
                            }, 300);
                        }
                        showForumOptionsUI();
                    } catch (e) {
                        showErrorPopup('Failed to save profile settings.');
                    }
                };
            }
            if (cancelBtn) cancelBtn.onclick = showForumOptionsUI;
        } catch (e) {
            showErrorPopup('Failed to render Profiles.');
        }
    }

    function showBackgroundOptionsUI() {
        try {
            renderBackgroundOptionsUI();
        } catch (e) {
            showErrorPopup('Failed to open Background Options.');
        }
    }

    function renderBackgroundOptionsUI() {
        try {
            backgroundOptionsUI.innerHTML = `
                <div class="header">
                    <h2>Background Options</h2>
                </div>
                <div class="button-container">
                    <button id="hft-customize-main-bg-btn">Customize Main Background</button>
                    <button id="hft-customize-page-bg-btn">Customize Page Background</button>
                    <button id="hft-manage-bg-btn">Manage Backgrounds</button>
                    <button id="hft-manage-slideshow-btn">Manage Slideshows</button>
                    <button id="hft-active-customizations-btn">Manage Active Customizations</button>
                    <button class="cancel">Back</button>
                </div>
            `;
            hideAllUIs();
            backgroundOptionsUI.style.display = 'flex';
            const customizeMainBgBtn = document.getElementById('hft-customize-main-bg-btn');
            const customizePageBgBtn = document.getElementById('hft-customize-page-bg-btn');
            const manageBgBtn = document.getElementById('hft-manage-bg-btn');
            const manageSlideshowBtn = document.getElementById('hft-manage-slideshow-btn');
            const activeCustomizationsBtn = document.getElementById('hft-active-customizations-btn');
            const cancelBtn = backgroundOptionsUI.querySelector('.cancel');
            if (customizeMainBgBtn) customizeMainBgBtn.onclick = showCustomizeMainBgUI;
            if (customizePageBgBtn) customizePageBgBtn.onclick = showPageRulesUI;
            if (manageBgBtn) manageBgBtn.onclick = showManageBgUI;
            if (manageSlideshowBtn) manageSlideshowBtn.onclick = showManageSlideshowUI;
            if (activeCustomizationsBtn) activeCustomizationsBtn.onclick = showActiveCustomizationsUI;
            if (cancelBtn) cancelBtn.onclick = showThemerUI;
        } catch (e) {
            showErrorPopup('Failed to render Background Options.');
        }
    }

    function showSettingsUI() {
        try {
            renderSettingsUI();
        } catch (e) {
            showErrorPopup('Failed to open Settings.');
        }
    }

    function renderSettingsUI() {
        try {
            settingsUI.innerHTML = `
                <div class="header">
                    <h2>Settings</h2>
                </div>
                <div class="button-container">
                    <button id="hft-restore-btn">Restore</button>
                    <button id="hft-about-btn">About</button>
                    <button class="cancel">Close</button>
                </div>
            `;
            hideAllUIs();
            settingsUI.style.display = 'flex';
            const restoreBtn = document.getElementById('hft-restore-btn');
            const aboutBtn = document.getElementById('hft-about-btn');
            const cancelBtn = settingsUI.querySelector('.cancel');
            if (restoreBtn) {
                restoreBtn.onclick = () => {
                    if (confirm('Restore to default settings? This will clear all backgrounds, slideshows, custom pages, and profile settings.')) {
                        resetSettings();
                        renderMainUI();
                    }
                };
            }
            if (aboutBtn) aboutBtn.onclick = showAboutUI;
            if (cancelBtn) cancelBtn.onclick = renderMainUI;
        } catch (e) {
            showErrorPopup('Failed to render Settings.');
        }
    }

    function showAboutUI() {
        try {
            renderAboutUI();
        } catch (e) {
            showErrorPopup('Failed to open About.');
        }
    }

    function renderAboutUI() {
    try {
        aboutUI.innerHTML = `
            <div class="header">
                <h2>About</h2>
            </div>
            <p>Hack Forums Themer</p>
            <p>by <a href="https://hackforums.net/member.php?action=profile&uid=5616027" target="_blank">MarlboroMan</a></p>
            <p>A Hack Forums plugin to customize the forum.</p>
            <p>Version 1.34</p>
            <p>Special thanks to <a href="https://hackforums.net/member.php?action=profile&uid=123" target="_blank">Charlie Sheen</a></p>
            <div class="button-container">
                <button class="cancel">Close</button>
            </div>
        `;
        hideAllUIs();
        aboutUI.style.display = 'flex';
        const cancelBtn = aboutUI.querySelector('.cancel');
        if (cancelBtn) cancelBtn.onclick = showSettingsUI;
    } catch (e) {
        showErrorPopup('Failed to render About.');
    }
}

function showCustomizeBgUI() {
    try {
        renderCustomizeBgUI();
    } catch (e) {
        showErrorPopup('Failed to open Customize Background.');
    }
}

function renderCustomizeBgUI() {
    try {
        customizeBgUI.innerHTML = `
            <div class="header">
                <h2>Customize Background</h2>
            </div>
            <div class="button-container">
                <button id="hft-customize-main-bg-btn">Customize Main Background</button>
                <button id="hft-customize-page-bg-btn">Customize Page Background</button>
                <button id="hft-manage-bg-btn">Manage Backgrounds</button>
                <button id="hft-manage-slideshow-btn">Manage Slideshows</button>
                <button id="hft-active-customizations-btn">Manage Active Customizations</button>
                <button class="cancel">Back</button>
            </div>
        `;
        hideAllUIs();
        customizeBgUI.style.display = 'flex';
        const customizeMainBgBtn = document.getElementById('hft-customize-main-bg-btn');
        const customizePageBgBtn = document.getElementById('hft-customize-page-bg-btn');
        const manageBgBtn = document.getElementById('hft-manage-bg-btn');
        const manageSlideshowBtn = document.getElementById('hft-manage-slideshow-btn');
        const activeCustomizationsBtn = document.getElementById('hft-active-customizations-btn');
        const cancelBtn = customizeBgUI.querySelector('.cancel');
        if (customizeMainBgBtn) customizeMainBgBtn.onclick = showCustomizeMainBgUI;
        if (customizePageBgBtn) customizePageBgBtn.onclick = showPageRulesUI;
        if (manageBgBtn) manageBgBtn.onclick = showManageBgUI;
        if (manageSlideshowBtn) manageSlideshowBtn.onclick = showManageSlideshowUI;
        if (activeCustomizationsBtn) activeCustomizationsBtn.onclick = showActiveCustomizationsUI;
        if (cancelBtn) cancelBtn.onclick = showThemerUI;
    } catch (e) {
        showErrorPopup('Failed to render Customize Background.');
    }
}

function showManageBgUI() {
    try {
        renderManageBgUI();
    } catch (e) {
        showErrorPopup('Failed to open Manage Backgrounds.');
    }
}

function renderManageBgUI() {
    try {
        const backgrounds = Array.isArray(settings.backgrounds) ? settings.backgrounds : [];
        manageBgUI.innerHTML = `
            <div class="header">
                <h2>Manage Backgrounds</h2>
            </div>
            <div class="button-container">
                <button id="hft-add-bg-btn">Add Background</button>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${backgrounds.length ? backgrounds.map((bg, index) => `
                            <tr>
                                <td>${bg.name}</td>
                                <td><button class="remove-bg" data-index="${index}">✕</button></td>
                            </tr>
                        `).join('') : '<tr><td colspan="2">No backgrounds added.</td></tr>'}
                    </tbody>
                </table>
            </div>
            <div class="button-container">
                <button class="cancel">Back</button>
            </div>
        `;
        hideAllUIs();
        manageBgUI.style.display = 'flex';

        // Attach event listener to the "Add Background" button
        const addBgBtn = document.getElementById('hft-add-bg-btn');
        if (addBgBtn) addBgBtn.onclick = showAddBgPopupUI;

        // Attach event listeners to each remove button
        const removeButtons = manageBgUI.querySelectorAll('.remove-bg');
        removeButtons.forEach(btn => {
            btn.removeEventListener('click', btn._clickHandler); // Remove any existing listeners to prevent duplicates
            const index = parseInt(btn.dataset.index);
            const clickHandler = () => {
                try {
                    const name = settings.backgrounds[index].name;
                    // Remove the background
                    settings.backgrounds.splice(index, 1);
                    // Remove the background from any slideshows
                    settings.slideshows.forEach(ss => {
                        ss.urls = ss.urls.filter(url => url !== name);
                    });
                    // Remove the background from custom pages
                    settings.customPages = settings.customPages.filter(page => page.backgroundName !== name);
                    // Clear main background if it matches the removed background
                    if (settings.mainBackground && settings.mainBackground.name === name) {
                        settings.mainBackground = null;
                    }
                    // Save updated settings
                    saveSettings();
                    // Re-apply background to reflect changes
                    applyPageBackground();
                    // Re-render the UI
                    renderManageBgUI();
                } catch (e) {
                    showErrorPopup('Failed to remove background.');
                }
            };
            btn._clickHandler = clickHandler; // Store the handler for removal later
            btn.addEventListener('click', clickHandler);
        });


        const cancelBtn = manageBgUI.querySelector('.cancel');
        if (cancelBtn) cancelBtn.onclick = showBackgroundOptionsUI;
    } catch (e) {
        showErrorPopup('Failed to render Manage Backgrounds.');
    }
}
function showAddBgPopupUI() {
    try {
        renderAddBgPopupUI();
    } catch (e) {
        showErrorPopup('Failed to open Add Background.');
    }
}

function renderAddBgPopupUI() {
    try {
        addBgPopupUI.innerHTML = `
            <div class="header">
                <h2>Add Background</h2>
            </div>
            <div class="input-group">
                <label>Background URL:</label>
                <input id="hft-bg-url" placeholder="Enter image URL" />
                <label>Background Name:</label>
                <input id="hft-bg-name" placeholder="Enter unique name" />
            </div>
            <div class="button-container">
                <button id="hft-save-bg-btn">Save</button>
                <button class="cancel">Cancel</button>
            </div>
        `;
        hideAllUIs();
        addBgPopupUI.style.display = 'flex';
        const saveBtn = document.getElementById('hft-save-bg-btn');
        const cancelBtn = addBgPopupUI.querySelector('.cancel');
        if (saveBtn) {
            saveBtn.onclick = () => {
                try {
                    const url = document.getElementById('hft-bg-url').value.trim();
                    const name = document.getElementById('hft-bg-name').value.trim();
                    if (!url) {
                        showErrorPopup('Please provide a valid URL.');
                        return;
                    }
                    if (!name || settings.backgrounds.some(bg => bg.name === name)) {
                        showErrorPopup('Please provide a unique name.');
                        return;
                    }
                    settings.backgrounds.push({ name, url });
                    saveSettings();
                    applyPageBackground();
                    renderManageBgUI();
                } catch (e) {
                    showErrorPopup('Failed to save background.');
                }
            };
        }
        if (cancelBtn) cancelBtn.onclick = renderManageBgUI;
    } catch (e) {
        showErrorPopup('Failed to render Add Background.');
    }
}

function showManageSlideshowUI() {
    try {
        renderManageSlideshowUI();
    } catch (e) {
        showErrorPopup('Failed to open Manage Slideshows.');
    }
}

function renderManageSlideshowUI() {
    try {
        const slideshows = Array.isArray(settings.slideshows) ? settings.slideshows : [];
        manageSlideshowUI.innerHTML = `
            <div class="header">
                <h2>Manage Slideshows</h2>
            </div>
            <div class="button-container">
                <button id="hft-create-slideshow-btn">Create New Slideshow</button>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${slideshows.length ? slideshows.map((ss, index) => `
                            <tr>
                                <td>${ss.name}</td>
                                <td><button class="remove-slideshow" data-index="${index}">✕</button></td>
                            </tr>
                        `).join('') : '<tr><td colspan="2">No slideshows added.</td></tr>'}
                    </tbody>
                </table>
            </div>
            <div class="button-container">
                <button class="cancel">Back</button>
            </div>
        `;
        hideAllUIs();
        manageSlideshowUI.style.display = 'flex';
        const createSlideshowBtn = document.getElementById('hft-create-slideshow-btn');
        if (createSlideshowBtn) createSlideshowBtn.onclick = showCreateSlideshowUI;
        manageSlideshowUI.querySelectorAll('.remove-slideshow').forEach(btn => {
            btn.onclick = (e) => {
                const index = parseInt(e.target.dataset.index);
                const name = settings.slideshows[index].name;
                settings.slideshows.splice(index, 1);
                if (currentSlideshow && currentSlideshow.name === name) {
                    currentSlideshow = null;
                }
                if (settings.mainBackground && settings.mainBackground.name === name) {
                    settings.mainBackground = null;
                }
                settings.customPages = settings.customPages.filter(page => page.backgroundName !== name);
                saveSettings();
                applyPageBackground();
                startSlideshow();
                renderManageSlideshowUI();
            };
        });
        const cancelBtn = manageSlideshowUI.querySelector('.cancel');
        if (cancelBtn) cancelBtn.onclick = showBackgroundOptionsUI;
    } catch (e) {
        showErrorPopup('Failed to render Manage Slideshows.');
    }
}

function showCreateSlideshowUI() {
    try {
        renderCreateSlideshowUI();
    } catch (e) {
        showErrorPopup('Failed to open Create Slideshow.');
    }
}

function renderCreateSlideshowUI() {
    try {
        const backgrounds = Array.isArray(settings.backgrounds) ? settings.backgrounds : [];
        createSlideshowUI.innerHTML = `
            <div class="header">
                <h2>Create Slideshow</h2>
            </div>
            <div class="input-group">
                <label>Slideshow Name:</label>
                <input id="hft-slideshow-name" placeholder="Enter slideshow name" />
                <label>Select Backgrounds:</label>
                <div class="checkbox-container">
                    ${backgrounds.length ? backgrounds.map((bg, index) => `
                        <div class="hft-checkbox">
                            <label class="hft-checkbox-label" for="hft-bg-${index}">${bg.name}</label>
                            <input type="checkbox" id="hft-bg-${index}" class="bg-checkbox" value="${bg.name}">
                        </div>
                    `).join('') : '<p>No backgrounds available.</p>'}
                </div>
                <label>Speed:</label>
                <input id="hft-fade-speed" type="range" min="0" max="4" value="2" />
                <span id="hft-speed-label">Normal</span>
            </div>
            <div class="button-container">
                <button id="hft-save-slideshow-btn">Save</button>
                <button class="cancel">Cancel</button>
            </div>
        `;
        hideAllUIs();
        createSlideshowUI.style.display = 'flex';
        const speedInput = document.getElementById('hft-fade-speed');
        const speedLabel = document.getElementById('hft-speed-label');
        if (speedInput && speedLabel) {
            speedInput.oninput = () => {
                const labels = ['Slowest', 'Slow', 'Normal', 'Fast', 'Fastest'];
                speedLabel.textContent = labels[speedInput.value] || 'Normal';
            };
        }
        const saveBtn = document.getElementById('hft-save-slideshow-btn');
        const cancelBtn = createSlideshowUI.querySelector('.cancel');
        if (saveBtn) {
            saveBtn.onclick = () => {
                try {
                    const name = document.getElementById('hft-slideshow-name').value.trim();
                    if (!name || settings.slideshows.some(ss => ss.name === name)) {
                        showErrorPopup('Please provide a unique slideshow name.');
                        return;
                    }
                    const urls = Array.from(document.querySelectorAll('.bg-checkbox:checked')).map(checkbox => checkbox.value);
                    if (!urls.length) {
                        showErrorPopup('Please select at least one background.');
                        return;
                    }
                    const fadeSpeed = [1200000, 600000, 120000, 12000, 20000][parseInt(document.getElementById('hft-fade-speed').value)] || 120000;
                    settings.slideshows.push({
                        name,
                        urls,
                        fadeSpeed
                    });
                    saveSettings();
                    applyPageBackground();
                    renderManageSlideshowUI();
                } catch (e) {
                    showErrorPopup('Failed to save slideshow.');
                }
            };
        }
        if (cancelBtn) cancelBtn.onclick = renderManageSlideshowUI;
    } catch (e) {
        showErrorPopup('Failed to render Create Slideshow.');
    }
}

function showCustomizeMainBgUI() {
    try {
        renderCustomizeMainBgUI();
    } catch (e) {
        showErrorPopup('Failed to open Customize Main Background.');
    }
}

function renderCustomizeMainBgUI() {
    try {
        const backgrounds = Array.isArray(settings.backgrounds) ? settings.backgrounds : [];
        const slideshows = Array.isArray(settings.slideshows) ? settings.slideshows : [];
        customizeMainBgUI.innerHTML = `
            <div class="header">
                <h2>Customize Main Background</h2>
            </div>
            <div class="input-group">
                <label>Select Background or Slideshow:</label>
                <select id="hft-main-bg-select">
                    <option value="">None</option>
                    ${backgrounds.map(bg => `
                        <option value="background:${bg.name}" ${settings.mainBackground && settings.mainBackground.type === 'background' && settings.mainBackground.name === bg.name ? 'selected' : ''}>Background: ${bg.name}</option>
                    `).join('')}
                    ${slideshows.map(ss => `
                        <option value="slideshow:${ss.name}" ${settings.mainBackground && settings.mainBackground.type === 'slideshow' && settings.mainBackground.name === ss.name ? 'selected' : ''}>Slideshow: ${ss.name}</option>
                    `).join('')}
                </select>
            </div>
            <div class="button-container">
                <button id="hft-save-main-bg-btn">Save</button>
                <button class="cancel">Cancel</button>
            </div>
        `;
        hideAllUIs();
        customizeMainBgUI.style.display = 'flex';
        const saveBtn = document.getElementById('hft-save-main-bg-btn');
        const cancelBtn = customizeMainBgUI.querySelector('.cancel');
        if (saveBtn) {
            saveBtn.onclick = () => {
                try {
                    const value = document.getElementById('hft-main-bg-select').value;
                    if (value) {
                        const [type, name] = value.split(':');
                        settings.mainBackground = { type, name };
                    } else {
                        settings.mainBackground = null;
                    }
                    saveSettings();
                    applyPageBackground();
                    startSlideshow();
                    showBackgroundOptionsUI();
                } catch (e) {
                    showErrorPopup('Failed to save main background.');
                }
            };
        }
        if (cancelBtn) cancelBtn.onclick = showBackgroundOptionsUI;
    } catch (e) {
        showErrorPopup('Failed to render Customize Main Background.');
    }
}

function showPageRulesUI() {
    try {
        renderPageRulesUI();
    } catch (e) {
        showErrorPopup('Failed to open Custom Page Rules.');
    }
}

function renderPageRulesUI() {
    try {
        const customPages = Array.isArray(settings.customPages) ? settings.customPages : [];
        pageRulesUI.innerHTML = `
            <div class="header">
                <h2>Custom Page Rules</h2>
            </div>
            <div class="button-container">
                <button id="hft-add-page-rule-btn">Create New Rule</button>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Page URL</th>
                            <th>Background</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${customPages.length ? customPages.map((page, index) => `
                            <tr>
                                <td>${page.url}</td>
                                <td>${page.backgroundName}</td>
                                <td><button class="remove-page" data-index="${index}">✕</button></td>
                            </tr>
                        `).join('') : '<tr><td colspan="3">No custom page rules added.</td></tr>'}
                    </tbody>
                </table>
            </div>
            <div class="button-container">
                <button class="cancel">Back</button>
            </div>
        `;
        hideAllUIs();
        pageRulesUI.style.display = 'flex';
        const addRuleBtn = document.getElementById('hft-add-page-rule-btn');
        if (addRuleBtn) addRuleBtn.onclick = showCustomizePageBgUI;
        pageRulesUI.querySelectorAll('.remove-page').forEach(btn => {
            btn.onclick = (e) => {
                const index = parseInt(e.target.dataset.index);
                settings.customPages.splice(index, 1);
                saveSettings();
                applyPageBackground();
                startSlideshow();
                renderPageRulesUI();
            };
        });
        const cancelBtn = pageRulesUI.querySelector('.cancel');
        if (cancelBtn) cancelBtn.onclick = showBackgroundOptionsUI;
    } catch (e) {
        showErrorPopup('Failed to render Custom Page Rules.');
    }
}

function showCustomizePageBgUI() {
    try {
        renderCustomizePageBgUI();
    } catch (e) {
        showErrorPopup('Failed to open Customize Page Background.');
    }
}

function renderCustomizePageBgUI() {
    try {
        const backgrounds = Array.isArray(settings.backgrounds) ? settings.backgrounds : [];
        const slideshows = Array.isArray(settings.slideshows) ? settings.slideshows : [];
        customizePageBgUI.innerHTML = `
            <div class="header">
                <h2>Customize Page Background</h2>
            </div>
            <div class="input-group">
                <label>Page URL:</label>
                <input id="hft-page-url" placeholder="Enter page URL" />
                <label>Select Background or Slideshow:</label>
                <select id="hft-page-bg-select">
                    <option value="">None</option>
                    ${backgrounds.map(bg => `
                        <option value="background:${bg.name}">Background: ${bg.name}</option>
                    `).join('')}
                    ${slideshows.map(ss => `
                        <option value="slideshow:${ss.name}">Slideshow: ${ss.name}</option>
                    `).join('')}
                </select>
            </div>
            <div class="button-container">
                <button id="hft-save-page-bg-btn">Save</button>
                <button class="cancel">Cancel</button>
            </div>
        `;
        hideAllUIs();
        customizePageBgUI.style.display = 'flex';
        const saveBtn = document.getElementById('hft-save-page-bg-btn');
        const cancelBtn = customizePageBgUI.querySelector('.cancel');
        if (saveBtn) {
            saveBtn.onclick = () => {
                try {
                    const pageUrl = document.getElementById('hft-page-url').value.trim();
                    const value = document.getElementById('hft-page-bg-select').value;
                    if (!pageUrl) {
                        showErrorPopup('Please provide a page URL.');
                        return;
                    }
                    if (!value) {
                        showErrorPopup('Please select a background or slideshow.');
                        return;
                    }
                    const [, name] = value.split(':');
                    settings.customPages.push({ url: pageUrl, backgroundName: name });
                    saveSettings();
                    applyPageBackground();
                    startSlideshow();
                    renderPageRulesUI();
                } catch (e) {
                    showErrorPopup('Failed to save page background.');
                }
            };
        }
        if (cancelBtn) cancelBtn.onclick = renderPageRulesUI;
    } catch (e) {
        showErrorPopup('Failed to render Customize Page Background.');
    }
}

function showActiveCustomizationsUI() {
    try {
        renderActiveCustomizationsUI();
    } catch (e) {
        showErrorPopup('Failed to open Manage Active Customizations.');
    }
}

function renderActiveCustomizationsUI() {
    try {
        const customPages = Array.isArray(settings.customPages) ? settings.customPages : [];
        const mainBg = settings.mainBackground ? {
            type: settings.mainBackground.type === 'background' ? 'Main Background' : 'Main Slideshow',
            name: settings.mainBackground.name
        } : null;
        activeCustomizationsUI.innerHTML = `
            <div class="header">
                <h2>Active Customizations</h2>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Name</th>
                            <th>Page URL</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${mainBg ? `
                            <tr>
                                <td>${mainBg.type}</td>
                                <td>${mainBg.name}</td>
                                <td>All Pages</td>
                                <td><button class="remove-main-bg">✕</button></td>
                            </tr>
                        ` : ''}
                        ${customPages.length ? customPages.map((page, index) => `
                            <tr>
                                <td>Page Rule</td>
                                <td>${page.backgroundName}</td>
                                <td>${page.url}</td>
                                <td><button class="remove-page" data-index="${index}">✕</button></td>
                            </tr>
                        `).join('') : ''}
                        ${!mainBg && !customPages.length ? '<tr><td colspan="4">No active customizations.</td></tr>' : ''}
                    </tbody>
                </table>
            </div>
            <div class="button-container">
                <button class="cancel">Back</button>
            </div>
        `;
        hideAllUIs();
        activeCustomizationsUI.style.display = 'flex';
        const removeMainBgBtn = activeCustomizationsUI.querySelector('.remove-main-bg');
        if (removeMainBgBtn) {
            removeMainBgBtn.onclick = () => {
                settings.mainBackground = null;
                saveSettings();
                applyPageBackground();
                startSlideshow();
                renderActiveCustomizationsUI();
            };
        }
        activeCustomizationsUI.querySelectorAll('.remove-page').forEach(btn => {
            btn.onclick = (e) => {
                const index = parseInt(e.target.dataset.index);
                settings.customPages.splice(index, 1);
                saveSettings();
                applyPageBackground();
                startSlideshow();
                renderActiveCustomizationsUI();
            };
        });
        const cancelBtn = activeCustomizationsUI.querySelector('.cancel');
        if (cancelBtn) cancelBtn.onclick = showBackgroundOptionsUI;
    } catch (e) {
        showErrorPopup('Failed to render Manage Active Customizations.');
    }
}

function makeDraggable(element) {
    try {
        let isDragging = false;
        let currentX, currentY;

        const onMouseDown = (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TABLE' || e.target.classList.contains('toggle-btn')) return;
            isDragging = true;
            const rect = element.getBoundingClientRect();
            currentX = e.clientX - rect.left;
            currentY = e.clientY - rect.top;
            element.style.cursor = 'grabbing';
            element.style.width = `${rect.width}px`;
            element.style.height = `${rect.height}px`;
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const newLeft = e.clientX - currentX;
            const newTop = e.clientY - currentY;
            const maxLeft = window.innerWidth - element.offsetWidth;
            const maxTop = window.innerHeight - element.offsetHeight;
            element.style.left = `${Math.max(0, Math.min(newLeft, maxLeft))}px`;
            element.style.top = `${Math.max(0, Math.min(newTop, maxTop))}px`;
            if (element.id !== 'hft-main-ui') {
                element.style.transform = 'none';
            }
        };

        const onMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = 'move';
                element.style.width = '';
                element.style.height = '';
            }
        };

        element.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        element.addEventListener('remove', () => {
            element.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        });
    } catch (e) {}
}

try {
    [mainUI, settingsUI, aboutUI, themerUI, backgroundOptionsUI, customizeBgUI, manageBgUI, manageSlideshowUI, createSlideshowUI, customizeMainBgUI, customizePageBgUI, pageRulesUI, addBgPopupUI, activeCustomizationsUI, errorPopup, forumOptionsUI, profilesUI, themerLinkUI, themerLinkMainUI].forEach(makeDraggable);
} catch (e) {}

try {
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === 'F6') {
            e.preventDefault();
            const newDisplay = mainUI.style.display === 'none' ? 'flex' : 'none';
            hideAllUIs();
            mainUI.style.display = newDisplay;
            if (newDisplay === 'flex') {
                renderMainUI();
            }
        }
    });
} catch (e) {}

try {
    const faLink = document.createElement('link');
    faLink.rel = 'stylesheet';
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(faLink);

    applyPageBackground();
    checkThemerLink();
    startSlideshow();
} catch (e) {
    showErrorPopup('Failed to initialize. Try resetting settings.');
}
})();