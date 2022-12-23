// ==UserScript==
// @name       HF Filter Memberlist Results
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.0
// @description Hide closed users on memberlist
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://hackforums.net/memberlist.php/*
// @match      *://hackforums.net/memberlist.php*
// @copyright  2021+
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 1.0.0: Release
// ------------------------------ Dev Notes -----------------------------
const closedUsergroup = "group38";
const normalUsergroup = "group2";
const minimumPostCount = 1;
const hints = [
    "Who am I? I am Hack Forums. When you find me I will be hidden but I am obvious because I am Hack Forums. You must PM me and when you do you will be granted a special award for I am Hack Forums and you are not. I have posted before but under a different name, before I was Hack Forums. It's been years since my last post and I no longer visit HF. I never upgraded even though I am Hack Forums. If you are mixed up by this riddle then you will never find me.",
    "Do not call or text this number 312-097-6485.",
    "I enjoying surfing and playing baseball. I am Hack Forums."
];
// ------------------------------ SCRIPT ------------------------------
const currentPage = window.location.href;
if(currentPage.includes("?action=search")){
    // Append normal user group
    $('select[name="group_choice"]').append($("<option>").attr({"value": "2"}).text("Normal"))
} else {
    $(".memberlistprofile")[0].scrollIntoView();
    $( ".memberlistprofile" ).each(function( index ) {
        const usergroup = $(this).find(".memberlistname > strong > a > span").attr("class");
        if(usergroup === closedUsergroup || usergroup !== normalUsergroup){
            $(this).hide();
        } else {
            const postCount = parseInt($(this).find(".infothead-lower > .float-left").text().replace(" Posts: ", "").replace(",", ""));
            if(postCount <= minimumPostCount){
                $(this).hide();
            }
        }
    });

    hints.forEach((hint, index) => {
        $(".memberlist-top").before($("<div>").text(`${index+1}. ${hint}`).addClass("tcat").append("<hr />"))
    });

    document.onkeydown = (e) => {
        e = e || window.event;
        switch (e.key) {
            case "ArrowLeft":
                return $(".pagination_previous:eq(0)")[0] ? $(".pagination_previous:eq(0)")[0].click() : null;
                break;
            case "ArrowRight":
                return $(".pagination_next:eq(0)")[0] ? $(".pagination_next:eq(0)")[0].click() : null;
        }
    };
}
