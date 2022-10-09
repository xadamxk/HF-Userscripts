// ==UserScript==
// @name        HFX Mobile
// @author      xadamxk
// @namespace   https://github.com/xadamxk/HFX-Mobile
// @require     https://raw.githubusercontent.com/xadamxk/HF-Userscripts/f0ef16fb4952368af9735aa7371ce8654558ed73/JS%20Libraries/GM_config.js
// @version     0.0.2
// @description Enhance your mobile HF Experience!
// @match       https://hackforums.net/*
// @copyright   2022+
// @updateURL   https://github.com/xadamxk/HF-Userscripts/blob/master/HFX%20Mobile/HFX%20Mobile.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/blob/master/HFX%20Mobile/HFX%20Mobile.user.js
// @grant       GM_info
// ------------------------------ Changelog -----------------------------
// v1.0.0: Update and Download URLs
// v0.0.2: Experimenting with settings library
// v0.0.1: Initial commit
// ==/UserScript==
// ------------------------------ Dev Notes -----------------------------
// If new update is available, prompt user (hideUpdateModal in configuration if they dont want to update)
// ------------------------------ SETTINGS ------------------------------
const settingsAccentColor = '#2f3b5d'; // Previously: 072948
// ------------------------------ SCRIPT ------------------------------
initializeSettings();
alert(GM_config.get('enableFavorites'));

function initializeSettings() {
    const recentChanges = getRecentChanges();
    var defaultConfiguration = {
        'enableFavorites': {
            'label': 'Favorites',
            'section': ['Global', "Side-wide modifications."],
            'title': "Adds favorites to the HF header.",
            'type': 'checkbox',
            'default': true,
        },
        'enableCompactPosts': {
            'label': 'Compact Posts',
            'section': ['Threads', "Thread modifications."],
            'title': "Condense author information in posts.",
            'type': 'checkbox',
            'default': true,
            'class': 'test'
        },
        'HFXMversion': {
            'title': 'About HFX Mobile',
            'section': ["About HFX Mobile",
                `Author: ${GM_info.script.author}<br>` +
                (true ? `<a href='${GM_info.script.updateURL}'>New Update Available (click to update)</a>` : `Up to date`) + `<br>` + // GM_info.scriptWillUpdate
                recentChanges],
            'value': '0',
            'type': 'hidden'
        },
    };

    // Instance of settings
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
    GM_config.open();
}

function getRecentChanges() {
    // Get Changelog from meta block
    var scriptMetadata = GM_info.scriptMetaStr.split('//') || [];
    return scriptMetadata.find((metadataRow) => {
        return metadataRow.includes(GM_info.script.version) && !metadataRow.includes('@version')
    }) || 'No Changelog Entry Found.';
}