// ==UserScript==
// @name        Pandora: Always Listening
// @namespace   https://github.com/xadamxk/HF-Scripts
// @version     0.0.2
// @description Automatically enable the 'still listening' feature on Pandora
// @author      xadamxk
// @require     https://code.jquery.com/jquery-3.1.1.js
// @include     http://*pandora.com/*
// @include     https://*pandora.com/*
// @grant       none
// @copyright   2016+
// @updateURL   https://github.com/xadamxk/HF-Userscripts/raw/master/Small%20Scripts/PandoraAlwaysListening.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/raw/master/Small%20Scripts/PandoraAlwaysListening.user.js
// ==/UserScript==
// Credit to original author: https://greasyfork.org/en/scripts/1816-pandora-freemium/code

extendPlayTime();

function extendPlayTime() {
    var $stillListeningEl = $('A.still_listening');
    if ($stillListeningEl.length) {
        $stillListeningEl[0].click();
    }
    if (playExtendedCount > -1)
        setTimeout(extendPlayTime, 2000);
}
