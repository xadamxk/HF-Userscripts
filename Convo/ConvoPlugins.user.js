// ==UserScript==
// @name         HackForums Plugins
// @namespace    https://hackforums.net/
// @version      1.2
// @description  Install and manage community plugins on HackForums. (Convo Notifier removed)
// @author       MarlboroMan
// @match        *://hackforums.net/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// ==/UserScript==

(function() {
    'use strict';

    const style = `
        #hfp-main-ui, #hfp-install-ui, #hfp-success-popup, #hfp-warning-popup, #hfp-manage-ui, #hfp-about-ui, #hfp-welcome-overlay, #hfp-error-popup {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            z-index: 999999;
            color: #e0e0e0;
            cursor: move;
            user-select: none;
        }
        #hfp-main-ui {
            position: fixed;
            top: 20px;
            left: 20px;
            background: #2b2b2b;
            padding: 20px;
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            width: 360px;
            border: 1px solid #502c5c;
            animation: fadeIn 0.5s ease;
            display: none;
            flex-direction: column;
            gap: 12px;
        }
        #hfp-main-ui h2 {
            margin: 0;
            font-size: 18px;
            color: #0cb114;
            font-weight: 600;
        }
        #hfp-main-ui .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        #hfp-main-ui .button-container {
            display: flex;
            gap: 12px;
        }
        #hfp-main-ui button {
            background: #502c5c;
            border: none;
            color: #fff;
            padding: 10px;
            border-radius: 12px;
            font-size: 14px;
            cursor: pointer;
            transition: background 0.3s ease, transform 0.2s ease;
            flex: 1;
        }
        #hfp-main-ui button:hover {
            background: #683a76;
            transform: scale(1.02);
        }
        #hfp-install-ui, #hfp-success-popup, #hfp-warning-popup, #hfp-welcome-overlay, #hfp-error-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2b2b2b;
            padding: 20px;
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            width: 400px;
            border: 1px solid #502c5c;
            animation: fadeIn 0.5s ease;
            display: none;
            flex-direction: column;
            gap: 12px;
        }
        #hfp-install-ui h2, #hfp-success-popup h2, #hfp-warning-popup h2, #hfp-welcome-overlay h2, #hfp-error-popup h2 {
            margin: 0;
            font-size: 18px;
            color: #0cb114;
            font-weight: 600;
            text-align: center;
        }
        #hfp-install-ui textarea {
            width: 100%;
            height: 200px;
            background: #3b3b3b;
            border: none;
            color: #e0e0e0;
            padding: 12px;
            border-radius: 12px;
            font-size: 14px;
            resize: none;
            outline: none;
            box-sizing: border-box;
        }
        #hfp-install-ui .buttons, #hfp-success-popup .buttons, #hfp-warning-popup .buttons, #hfp-welcome-overlay .buttons, #hfp-error-popup .buttons {
            display: flex;
            gap: 12px;
        }
        #hfp-install-ui button, #hfp-success-popup button, #hfp-warning-popup button, #hfp-welcome-overlay button, #hfp-error-popup button {
            background: #502c5c;
            border: none;
            color: #fff;
            padding: 10px;
            border-radius: 12px;
            font-size: 14px;
            cursor: pointer;
            transition: background 0.3s ease, transform 0.2s ease;
            flex: 1;
        }
        #hfp-install-ui button:hover, #hfp-success-popup button:hover, #hfp-warning-popup button:hover, #hfp-welcome-overlay button:hover, #hfp-error-popup button:hover {
            background: #683a76;
            transform: scale(1.02);
        }
        #hfp-install-ui button.cancel, #hfp-warning-popup button.cancel, #hfp-welcome-overlay button.cancel, #hfp-error-popup button.cancel {
            background: #ff4444;
        }
        #hfp-install-ui button.cancel:hover, #hfp-warning-popup button.cancel:hover, #hfp-welcome-overlay button.cancel:hover, #hfp-error-popup button.cancel:hover {
            background: #ff6666;
        }
        #hfp-manage-ui {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2b2b2b;
            padding: 20px;
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            width: 800px;
            border: 1px solid #502c5c;
            animation: fadeIn 0.5s ease;
            display: none;
            flex-direction: column;
            gap: 12px;
            max-height: 80vh;
        }
        #hfp-manage-ui h2 {
            margin: 0;
            font-size: 18px;
            color: #0cb114;
            font-weight: 600;
            text-align: center;
        }
        #hfp-manage-ui .table-container {
            max-height: 400px;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
        }
        #hfp-manage-ui .table-container::-webkit-scrollbar {
            width: 8px;
        }
        #hfp-manage-ui .table-container::-webkit-scrollbar-track {
            background: #3b3b3b;
        }
        #hfp-manage-ui .table-container::-webkit-scrollbar-thumb {
            background: #683a76;
            border-radius: 4px;
        }
        #hfp-manage-ui .table-container::-webkit-scrollbar-thumb:hover {
            background: #ff4444;
        }
        #hfp-manage-ui table {
            width: 100%;
            border-collapse: collapse;
            color: #e0e0e0;
            font-size: 14px;
        }
        #hfp-manage-ui th, #hfp-manage-ui td {
            padding: 12px 16px;
            text-align: left;
            border-bottom: 1px solid #3b3b3b;
        }
        #hfp-manage-ui th {
            background: #3b3b3b;
            font-weight: 600;
        }
        #hfp-manage-ui td .action-buttons {
            display: flex;
            gap: 12px;
        }
        #hfp-manage-ui td button {
            background: #502c5c;
            border: none;
            color: #fff;
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 12px;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        #hfp-manage-ui td button:hover {
            background: #683a76;
        }
        #hfp-manage-ui td button.delete {
            background: #ff4444;
        }
        #hfp-manage-ui td button.delete:hover {
            background: #ff6666;
        }
        #hfp-manage-ui .pagination {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-top: 12px;
        }
        #hfp-manage-ui .pagination button {
            background: #502c5c;
            border: none;
            color: #fff;
            padding: 8px 16px;
            border-radius: 12px;
            font-size: 14px;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        #hfp-manage-ui .pagination button:hover {
            background: #683a76;
        }
        #hfp-manage-ui .pagination button.disabled {
            background: #3b3b3b;
            cursor: not-allowed;
        }
        #hfp-manage-ui .close-btn {
            background: #ff4444;
            align-self: center;
            width: 100px;
        }
        #hfp-manage-ui .close-btn:hover {
            background: #ff6666;
        }
        #hfp-about-ui {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2b2b2b;
            padding: 20px;
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            width: 360px;
            border: 1px solid #502c5c;
            animation: fadeIn 0.5s ease;
            display: none;
            flex-direction: column;
            gap: 12px;
            text-align: center;
        }
        #hfp-about-ui p {
            margin: 0;
            font-size: 14px;
            color: #e0e0e0;
        }
        #hfp-about-ui a {
            color: #ff4444;
            text-decoration: none;
        }
        #hfp-about-ui a:hover {
            text-decoration: underline;
        }
        #hfp-about-ui .close-btn {
            background: #ff4444;
            width: 100px;
            align-self: center;
        }
        #hfp-about-ui .close-btn:hover {
            background: #ff6666;
        }
        #hfp-about-ui .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        #hfp-about-ui .restore-btn {
            background: none;
            border: none;
            color: #0cb114;
            font-size: 18px;
            cursor: pointer;
            transition: color 0.3s ease;
        }
        #hfp-about-ui .restore-btn:hover {
            color: #ff4444;
        }
        #hfp-welcome-overlay {
            background: #2b2b2b;
            width: 400px;
        }
        #hfp-welcome-overlay p {
            font-size: 14px;
            color: #e0e0e0;
            text-align: center;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    GM_addStyle(style);

    // Plugin storage and management
    let plugins = GM_getValue('hfp_plugins', []);
    let pluginStates = GM_getValue('hfp_plugin_states', {});
    let currentPage = 1;
    const pluginsPerPage = 10;
    const isFirstRun = !GM_getValue('hfp_has_run', false);

    // Global store for timers
    window.HFP_Timers = window.HFP_Timers || {};

    // Save plugins to storage
    function savePlugins() {
        GM_setValue('hfp_plugins', plugins);
        GM_setValue('hfp_plugin_states', pluginStates);
    }

    // Reset plugin system to fresh state
    function resetPlugins() {
        plugins = [];
        pluginStates = {};
        for (const timerId in window.HFP_Timers) {
            window.HFP_Timers[timerId].forEach(id => clearInterval(id));
        }
        window.HFP_Timers = {};
        GM_deleteValue('hfp_plugins');
        GM_deleteValue('hfp_plugin_states');
        GM_deleteValue('hfp_has_run');
    }

    // Extract info from script
    function extractMetadata(script) {
        const nameMatch = script.match(/\/\/\s*@name\s+(.+)/);
        const versionMatch = script.match(/\/\/\s*@version\s+(.+)/);
        const authorMatch = script.match(/\/\/\s*@author\s+(.+)/);
        return {
            name: nameMatch ? nameMatch[1].trim() : 'Unnamed Plugin',
            version: versionMatch ? versionMatch[1].trim() : '1.0',
            author: authorMatch ? authorMatch[1].trim() : 'Unknown'
        };
    }

    // Validate Tampermonkey script
    function isValidTampermonkeyScript(script) {
        return script.includes('// ==UserScript==') && script.includes('// ==/UserScript==');
    }

    // Fetch script from URL
    async function fetchScript(url) {
        try {
            const response = await fetch(url, { mode: 'cors' });
            if (!response.ok) throw new Error(`Failed to fetch script: ${response.status}`);
            return await response.text();
        } catch (e) {
            console.error(`[HFP] Error fetching script from ${url}:`, e);
            return null;
        }
    }

    // Execute plugin script with GM_* APIs
    async function executePlugin(script, id) {
        try {
            const metadata = extractMetadata(script);
            const pluginName = metadata.name;
            let pluginFunc;

            if (pluginName === 'HF Convo Notifier') {
                // Use original execution for Notifier
                pluginFunc = new Function('GM_addStyle', 'GM_getValue', 'GM_setValue', 'GM_deleteValue', `
                    return (async () => {
                        try {
                            ${script}
                        } catch (e) {
                            console.error('[HFP] Plugin ${id} (HF Convo Notifier) execution error:', e);
                        }
                    })();
                `);
            } else {
                // Use timer capture for Themer and other plugins
                const pluginScript = `
                    (function() {
                        const hfpSetInterval = function(callback, delay) {
                            const timerId = setInterval(callback, delay);
                            window.HFP_Timers['${id}'] = window.HFP_Timers['${id}'] || [];
                            window.HFP_Timers['${id}'].push(timerId);
                            return timerId;
                        };
                        ${script.replace(/\bsetInterval\b/g, 'hfpSetInterval')}
                    })();
                `;
                pluginFunc = new Function('GM_addStyle', 'GM_getValue', 'GM_setValue', 'GM_deleteValue', `
                    return (async () => {
                        try {
                            ${pluginScript}
                        } catch (e) {
                            console.error('[HFP] Plugin ${id} (${pluginName}) execution error:', e);
                        }
                    })();
                `);
            }

            await pluginFunc(GM_addStyle, GM_getValue, GM_setValue, GM_deleteValue);
            pluginStates[id] = { active: true };
            savePlugins();
            console.log(`[HFP] Plugin ${id} (${pluginName}) executed successfully`);
        } catch (e) {
            console.error(`[HFP] Error executing plugin ${id}:`, e);
            pluginStates[id] = { active: false };
            savePlugins();
        }
    }

    // Monitor and restore plugin DOM elements
    function monitorPluginElements() {
        const themerElements = [
            { id: 'hft-bg-overlay-1', styles: `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: -1;
                opacity: 0;
                transition: opacity 2s ease;
            `},
            { id: 'hft-bg-overlay-2', styles: `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: -1;
                opacity: 0;
                transition: opacity 2s ease;
            `}
        ];
        const notifierElements = [
            { id: 'hfc-setup', styles: `
                position: fixed;
                top: 20px;
                left: 20px;
                background: #2b2b2b;
                color: #e0e0e0;
                padding: 20px;
                border-radius: 20px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                width: 360px;
                border: 1px solid #502c5c;
                animation: fadeIn 0.5s ease;
                z-index: 999999;
                display: none;
            `},
            { id: 'hfc-notifications', styles: `
                position: fixed;
                top: 20px;
                left: 20px;
                background: #2b2b2b;
                color: #e0e0e0;
                padding: 16px;
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                width: 360px;
                height: 500px;
                border: 1px solid #502c5c;
                animation: fadeIn 0.5s ease;
                cursor: move;
                user-select: none;
                display: none;
                flex-direction: column;
                gap: 12px;
                box-sizing: border-box;
                overflow: hidden;
                z-index: 999999;
            `},
            { id: 'hfc-unread-indicator', styles: `
                position: fixed;
                bottom: 10px;
                left: 10px;
                background: #28a745;
                color: #fff;
                padding: 6px 12px;
                border-radius: 12px;
                font-size: 12px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: background 0.5s ease;
                user-select: none;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                z-index: 999999;
            `},
            { id: 'hfc-portable-convo', styles: `
                position: fixed;
                top: 100px;
                left: 100px;
                background: #2b2b2b;
                color: #e0e0e0;
                padding: 16px;
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                width: 360px;
                height: 500px;
                border: 1px solid #502c5c;
                animation: fadeIn 0.5s ease;
                cursor: move;
                user-select: none;
                display: none;
                flex-direction: column;
                gap: 12px;
                box-sizing: border-box;
                overflow: hidden;
                z-index: 999999;
            `}
        ];

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.removedNodes.length > 0) {
                    // Restore Themer elements
                    themerElements.forEach(({ id, styles }) => {
                        if (!document.getElementById(id)) {
                            const element = document.createElement('div');
                            element.id = id;
                            element.style.cssText = styles;
                            document.body.appendChild(element);
                            console.log(`[HFP] Restored Themer element: ${id}`);
                        }
                    });

                    // Restore Notifier static elements
                    notifierElements.forEach(({ id, styles }) => {
                        if (!document.getElementById(id)) {
                            const element = document.createElement('div');
                            element.id = id;
                            element.style.cssText = styles;
                            // Restore saved positions and visibility
                            if (id === 'hfc-notifications') {
                                const pos = JSON.parse(localStorage.getItem('hfc_notifications_position') || '{}');
                                if (pos.top) element.style.top = pos.top;
                                if (pos.left) element.style.left = pos.left;
                                element.style.display = localStorage.getItem('hfc_notifications_visible') || 'none';
                            } else if (id === 'hfc-unread-indicator') {
                                const pos = JSON.parse(localStorage.getItem('hfc_unread_indicator_position') || '{}');
                                if (pos.bottom) element.style.bottom = pos.bottom;
                                if (pos.left) element.style.left = pos.left;
                                element.style.display = 'flex';
                            } else if (id === 'hfc-portable-convo') {
                                const pos = JSON.parse(localStorage.getItem('hfc_portable_convo_position') || '{}');
                                if (pos.top) element.style.top = pos.top;
                                if (pos.left) element.style.left = pos.left;
                                element.style.display = localStorage.getItem('hfc_portable_convo_visible') || 'none';
                            } else if (id === 'hfc-setup') {
                                element.style.display = 'none';
                            }
                            document.body.appendChild(element);
                            console.log(`[HFP] Restored Notifier element: ${id}`);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true });

        // Initialize elements
        themerElements.forEach(({ id, styles }) => {
            if (!document.getElementById(id)) {
                const element = document.createElement('div');
                element.id = id;
                element.style.cssText = styles;
                document.body.appendChild(element);
                console.log(`[HFP] Initialized Themer element: ${id}`);
            }
        });
        notifierElements.forEach(({ id, styles }) => {
            if (!document.getElementById(id)) {
                const element = document.createElement('div');
                element.id = id;
                element.style.cssText = styles;
                document.body.appendChild(element);
                console.log(`[HFP] Initialized Notifier element: ${id}`);
            }
        });
    }

    // Install plugin from script content
    async function installPlugin(script) {
        if (!script || !isValidTampermonkeyScript(script)) {
            console.error('[HFP] Invalid or empty script');
            return false;
        }

        const metadata = extractMetadata(script);
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        plugins.push({
            id,
            script,
            name: metadata.name,
            version: metadata.version,
            author: metadata.author,
            installedDate: new Date().toISOString()
        });
        await executePlugin(script, id);
        savePlugins();
        return true;
    }

    // UI Elements
    const mainUI = document.createElement('div');
    mainUI.id = 'hfp-main-ui';
    document.body.appendChild(mainUI);

    const installUI = document.createElement('div');
    installUI.id = 'hfp-install-ui';
    document.body.appendChild(installUI);

    const warningPopup = document.createElement('div');
    warningPopup.id = 'hfp-warning-popup';
    document.body.appendChild(warningPopup);

    const successPopup = document.createElement('div');
    successPopup.id = 'hfp-success-popup';
    document.body.appendChild(successPopup);

    const manageUI = document.createElement('div');
    manageUI.id = 'hfp-manage-ui';
    document.body.appendChild(manageUI);

    const aboutUI = document.createElement('div');
    aboutUI.id = 'hfp-about-ui';
    document.body.appendChild(aboutUI);

    const welcomeOverlay = document.createElement('div');
    welcomeOverlay.id = 'hfp-welcome-overlay';
    document.body.appendChild(welcomeOverlay);

    const errorPopup = document.createElement('div');
    errorPopup.id = 'hfp-error-popup';
    document.body.appendChild(errorPopup);

    // Show error popup
    function showErrorPopup(message) {
        errorPopup.innerHTML = `
            <h2>Error</h2>
            <p>${message}</p>
            <div class="buttons">
                <button class="ok">OK</button>
            </div>
        `;
        errorPopup.style.display = 'flex';

        errorPopup.querySelector('.ok').onclick = () => {
            errorPopup.style.display = 'none';
            renderMainUI();
        };
    }

    // Render main UI
    function renderMainUI() {
    mainUI.innerHTML = `
        <div class="header">
            <h2>HackForums Plugins</h2>
        </div>
        <div class="button-container">
            <button id="hfp-install-btn">Install Plugins</button>
            <button id="hfp-manage-btn">Manage Plugins</button>
            <button id="hfp-about-btn">About</button>
        </div>
    `;
    const uiVisible = GM_getValue('hfp_ui_visible', true);
    mainUI.style.display = uiVisible ? 'flex' : 'none';
    installUI.style.display = 'none';
    warningPopup.style.display = 'none';
    successPopup.style.display = 'none';
    manageUI.style.display = 'none';
    aboutUI.style.display = 'none';
    welcomeOverlay.style.display = 'none';
    errorPopup.style.display = 'none';

    document.getElementById('hfp-install-btn').onclick = showInstallUI;
    document.getElementById('hfp-manage-btn').onclick = showManageUI;
    document.getElementById('hfp-about-btn').onclick = showAboutUI;
}

    // Show warning popup
    function showWarningPopup() {
        warningPopup.innerHTML = `
            <h2>Warning</h2>
            <p>The installer expects a valid userscript!</p>
            <div class="buttons">
                <button class="ok">OK</button>
                <button class="cancel">Cancel</button>
            </div>
        `;
        warningPopup.style.display = 'flex';
        mainUI.style.display = 'none';

        warningPopup.querySelector('.ok').onclick = () => {
            warningPopup.style.display = 'none';
            renderInstallUI();
        };
        warningPopup.querySelector('.cancel').onclick = () => {
            warningPopup.style.display = 'none';
            renderMainUI();
        };
    }

    // Render install UI
    function renderInstallUI() {
        installUI.innerHTML = `
            <h2>Install Plugin</h2>
            <textarea placeholder="Paste plugin here..."></textarea>
            <div class="buttons">
                <button class="install">Install</button>
                <button class="cancel">Cancel</button>
            </div>
        `;
        installUI.style.display = 'flex';
        mainUI.style.display = 'none';

        const textarea = installUI.querySelector('textarea');
        const installBtn = installUI.querySelector('.install');
        const cancelBtn = installUI.querySelector('.cancel');

        installBtn.onclick = async () => {
            const script = textarea.value.trim();
            if (!script) {
                alert('No script provided.');
                return;
            }
            if (!isValidTampermonkeyScript(script)) {
                alert('Invalid script!');
                return;
            }

            const success = await installPlugin(script);
            if (success) {
                const metadata = extractMetadata(script);
                installUI.style.display = 'none';
                showSuccessPopup(metadata.name);
            } else {
                alert('Failed to install plugin!');
            }
        };

        cancelBtn.onclick = () => {
            installUI.style.display = 'none';
            renderMainUI();
        };
    }

    // Show install UI
    function showInstallUI() {
        showWarningPopup();
    }

    // Show success popup
    function showSuccessPopup(pluginName) {
        successPopup.innerHTML = `
            <h2>Success</h2>
            <p>Plugin "${pluginName}" installed successfully!</p>
            <div class="buttons">
                <button class="ok">OK</button>
            </div>
        `;
        successPopup.style.display = 'flex';

        successPopup.querySelector('.ok').onclick = () => {
            successPopup.style.display = 'none';
            renderMainUI();
        };
    }

    // Render manage UI
    function renderManageUI(page = currentPage) {
        currentPage = page;
        const startIndex = (page - 1) * pluginsPerPage;
        const endIndex = startIndex + pluginsPerPage;
        const paginatedPlugins = plugins.slice(startIndex, endIndex);
        const totalPages = Math.ceil(plugins.length / pluginsPerPage);

        manageUI.innerHTML = `
            <h2>Manage Plugins</h2>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Author</th>
                            <th>Version</th>
                            <th>Installed</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${paginatedPlugins.length === 0 ? '<tr><td colspan="5" style="text-align: center; color: #aaa;">No plugins installed.</td></tr>' : paginatedPlugins.map(plugin => `
                            <tr data-id="${plugin.id}">
                                <td>${plugin.name}</td>
                                <td>${plugin.author}</td>
                                <td>${plugin.version}</td>
                                <td>${new Date(plugin.installedDate).toLocaleDateString()}</td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="toggle">${pluginStates[plugin.id]?.active ? 'Stop' : 'Run'}</button>
                                        <button class="restart">Restart</button>
                                        <button class="delete">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div class="pagination">
                <button class="prev" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
                <button class="next" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
            </div>
            <button class="close-btn">Close</button>
        `;
        manageUI.style.display = 'flex';
        mainUI.style.display = 'none';

        manageUI.querySelectorAll('.toggle').forEach(btn => {
            btn.onclick = async (e) => {
                const id = e.target.closest('tr').dataset.id;
                const plugin = plugins.find(p => p.id === id);
                if (!plugin) return;
                const isActive = pluginStates[id]?.active;
                pluginStates[id] = { active: !isActive };
                if (!isActive) {
                    await executePlugin(plugin.script, id);
                } else {
                    if (window.HFP_Timers[id]) {
                        window.HFP_Timers[id].forEach(timerId => clearInterval(timerId));
                        delete window.HFP_Timers[id];
                    }
                }
                savePlugins();
                renderManageUI(currentPage);
            };
        });

        manageUI.querySelectorAll('.restart').forEach(btn => {
            btn.onclick = async (e) => {
                const id = e.target.closest('tr').dataset.id;
                const plugin = plugins.find(p => p.id === id);
                if (!plugin) return;
                if (window.HFP_Timers[id]) {
                    window.HFP_Timers[id].forEach(timerId => clearInterval(timerId));
                    delete window.HFP_Timers[id];
                }
                pluginStates[id] = { active: true };
                await executePlugin(plugin.script, id);
                savePlugins();
            };
        });

        manageUI.querySelectorAll('.delete').forEach(btn => {
            btn.onclick = (e) => {
                const id = e.target.closest('tr').dataset.id;
                plugins = plugins.filter(p => p.id !== id);
                if (window.HFP_Timers[id]) {
                    window.HFP_Timers[id].forEach(timerId => clearInterval(timerId));
                    delete window.HFP_Timers[id];
                }
                delete pluginStates[id];
                savePlugins();
                const totalPages = Math.ceil(plugins.length / pluginsPerPage);
                if (currentPage > totalPages) {
                    currentPage = totalPages || 1;
                }
                renderManageUI(currentPage);
            };
        });

        const prevBtn = manageUI.querySelector('.prev');
        const nextBtn = manageUI.querySelector('.next');
        if (prevBtn) {
            prevBtn.onclick = () => {
                if (currentPage > 1) {
                    renderManageUI(currentPage - 1);
                }
            };
        }
        if (nextBtn) {
            nextBtn.onclick = () => {
                if (currentPage < totalPages) {
                    renderManageUI(currentPage + 1);
                }
            };
        }

        manageUI.querySelector('.close-btn').onclick = () => {
            manageUI.style.display = 'none';
            renderMainUI();
        };
    }

    // Manage UI
    function showManageUI() {
        renderManageUI();
    }

    // About UI
    function showAboutUI() {
        aboutUI.innerHTML = `
            <div class="header">
                <h2>About HackForums Plugins</h2>
                <button class="restore-btn" title="Reinstall Default Plugins">🔄</button>
            </div>
            <p>A tool to install and manage plugins for HackForums</p>
            <p>Version: 1.1.3</p>
            <p>Author: <a href="https://hackforums.net/member.php?action=profile&uid=5616027" target="_blank">MarlboroMan</a></p>
            <p>Special Thanks to: <a href="https://hackforums.net/member.php?action=profile&uid=1692747" target="_blank">G33K</a> and <a href="https://hackforums.net/member.php?action=profile&uid=123" target="_blank">Charlie Sheen</a></p>
            <button class="close-btn">Close</button>
        `;
        aboutUI.style.display = 'flex';
        mainUI.style.display = 'none';

        aboutUI.querySelector('.restore-btn').onclick = () => {
            if (confirm('Are you sure you want to reinstall default plugins? This will reset all plugins and settings.')) {
                resetPlugins();
                aboutUI.style.display = 'none';
                showWelcomeOverlay();
            }
        };

        aboutUI.querySelector('.close-btn').onclick = () => {
            aboutUI.style.display = 'none';
            renderMainUI();
        };
    }

    // Welcome overlay for first run
    function showWelcomeOverlay() {
        welcomeOverlay.innerHTML = `
            <h2>Welcome!</h2>
            <p>Do you want to install the default plugins?</p>
            <div class="buttons">
                <button class="install">Yes</button>
                <button class="cancel">No</button>
            </div>
        `;
        welcomeOverlay.style.display = 'flex';

        welcomeOverlay.querySelector('.install').onclick = async () => {
            let anySuccess = false;
            for (const url of defaultPlugins) {
                const script = await fetchScript(url);
                if (script) {
                    const success = await installPlugin(script);
                    if (success) {
                        const metadata = extractMetadata(script);
                        console.log(`[HFP] Installed plugin: ${metadata.name}`);
                        anySuccess = true;
                    }
                } else {
                    showErrorPopup(`Failed to fetch plugin from ${url}. Please check the URL and try again.`);
                }
            }
            GM_setValue('hfp_has_run', true);
            welcomeOverlay.style.display = 'none';
            if (!anySuccess) {
                showErrorPopup('No default plugins were installed. Please check the plugin URLs.');
            } else {
                renderMainUI();
            }
        };

        welcomeOverlay.querySelector('.cancel').onclick = async () => {
            for (const url of defaultPlugins) {
                const script = await fetchScript(url);
                if (script) {
                    const metadata = extractMetadata(script);
                    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
                    plugins.push({
                        id,
                        script,
                        name: metadata.name,
                        version: metadata.version,
                        author: metadata.author,
                        installedDate: new Date().toISOString()
                    });
                    pluginStates[id] = { active: false };
                } else {
                    console.error(`[HFP] Skipped plugin due to fetch failure: ${url}`);
                }
            }
            savePlugins();
            GM_setValue('hfp_has_run', true);
            welcomeOverlay.style.display = 'none';
            renderMainUI();
        };
    }

    function makeDraggable(element) {
        let isDragging = false;
        let currentX, currentY;

        element.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'TEXTAREA') return;
            isDragging = true;
            const rect = element.getBoundingClientRect();
            currentX = e.clientX - rect.left;
            currentY = e.clientY - rect.top;
            element.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();

            const newLeft = e.clientX - currentX;
            const newTop = e.clientY - currentY;
            const maxLeft = window.innerWidth - element.offsetWidth;
            const maxTop = window.innerHeight - element.offsetHeight;

            element.style.left = `${Math.max(0, Math.min(newLeft, maxLeft))}px`;
            element.style.top = `${Math.max(0, Math.min(newTop, maxTop))}px`;

            if (element.id !== 'hfp-main-ui') {
                element.style.transform = 'none';
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = 'move';
            }
        });
    }

    // Apply dragging to all UIs
    [mainUI, installUI, warningPopup, successPopup, manageUI, aboutUI, welcomeOverlay, errorPopup].forEach(makeDraggable);

    // Keyboard shortcut (Alt + F5)
    document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key === 'F5') {
        e.preventDefault();
        const isVisible = mainUI.style.display === 'flex';
        const newDisplay = isVisible ? 'none' : 'flex';
        mainUI.style.display = newDisplay;
        GM_setValue('hfp_ui_visible', newDisplay === 'flex');
        if (newDisplay === 'flex') {
            renderMainUI();
        }
        installUI.style.display = 'none';
        warningPopup.style.display = 'none';
        successPopup.style.display = 'none';
        manageUI.style.display = 'none';
        aboutUI.style.display = 'none';
        welcomeOverlay.style.display = 'none';
        errorPopup.style.display = 'none';
    }
});

    // Initialize
    try {
    const uiVisible = GM_getValue('hfp_ui_visible', true);
    mainUI.style.display = uiVisible ? 'flex' : 'none';
    renderMainUI();
    plugins.forEach(async (plugin) => {
        if (pluginStates[plugin.id]?.active) {
            await executePlugin(plugin.script, plugin.id);
        }
    });
    monitorPluginElements();
    if (isFirstRun) {
        showWelcomeOverlay();
    }
} catch (e) {
    showErrorPopup('Failed to initialize plugin manager.');
    console.error('[HFP] Initialization error:', e);
}

    // Default plugins
    const defaultPlugin1 = [
        'https://pub-9c48404209ef462f927f54cd2f4f133c.r2.dev/ConvoWhoIs1.0.txt'
    ];
    const defaultPlugin2 = [
        'https://pub-9c48404209ef462f927f54cd2f4f133c.r2.dev/ConvoSummon1.0.txt'
    ];
    const defaultPlugin3 = [
        'https://pub-9c48404209ef462f927f54cd2f4f133c.r2.dev/ConvoRnM1.0.txt'
    ];
    const defaultPlugin5 = [
        'https://pub-9c48404209ef462f927f54cd2f4f133c.r2.dev/ThemerOne.txt'
    ];

    const defaultPlugins = [
        ...defaultPlugin1,
        ...defaultPlugin2,
        ...defaultPlugin3,
        ...defaultPlugin5
    ];
})();
