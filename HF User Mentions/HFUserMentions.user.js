// ==UserScript==
// @name        HF User Mentions
// @author      xadamxk
// @namespace   https://github.com/xadamxk/HF-Scripts
// @version     1.0.0
// @description Adds user mention functionality to threads.
// @require     https://code.jquery.com/jquery-3.1.1.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.12.0/underscore.min.js
// @require     https://raw.githubusercontent.com/podio/jquery-mentions-input/master/jquery.mentionsInput.js
// @require     https://raw.githubusercontent.com/ryankshaw/jquery-elastic/master/jquery.elastic.source.js
// @match       https://hackforums.net/showthread.php?tid=*
// @copyright   2016+
// @iconURL     https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// @resource    jQueryMentionsInputCSS https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/HF%20User%20Mentions/HFUserMentions.css
// @grant       GM_addStyle
// @grant       GM_getResourceText
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 1.0.0: Initial Release
// ------------------------------ Dev Notes -----------------------------
//
// ------------------------------ SETTINGS ------------------------------
const minUsernameLength = 3;
const triggerCharacter = "@"
// ------------------------------ ON PAGE LOAD ------------------------------
const jQueryMentionsInputCSS = GM_getResourceText("jQueryMentionsInputCSS");
GM_addStyle(jQueryMentionsInputCSS);


$("#message").addClass("mention").css({
"background":"#2a2a2a !important",
"color":"#cecece !important"
});

$('#message.mention').mentionsInput({
    onDataRequest:function (mode, query, callback) {
        $.getJSON('https://hackforums.net/xmlhttp.php?action=get_users&query=' + query, function(responseData) {
            let data = responseData.map(user => {
                return {"id":user.id, "name":`@${user.text}@`, "type": "contact"};
            })
            data = _.filter(data, function(item) { return item.id.toLowerCase().indexOf(query.toLowerCase()) > -1 });
            callback.call(this, data);
        });
    },
    minChars: minUsernameLength,
    triggerChar: triggerCharacter,
    showAvatars: false
});
