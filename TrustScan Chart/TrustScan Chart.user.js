// ==UserScript==
// @name       HF Trust Scan Score
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.0
// @description Add's weights to HF's Trust Scan
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://hackforums.net/trustscan.php?uid=*
// @copyright  2016+
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 1.0.1: Public Release
// version 1.0.0: Beta Release
// ------------------------------ Classes -----------------------------
class TSItem {
    constructor(label, level, value) {
        this.label = label;
        this.level = level;
        this.value = value;
    }
}
// ------------------------------ Settings ------------------------------
var table = $( "table").find("strong:contains(Trust Scan of )").parent().parent().parent().parent();
var trustScanList= [];

var gauth2FA = new TSItem();
gauth2FA.label = "Gauth/2FA:";
gauth2FA.level = 9;
trustScanList.push(gauth2FA);

var lastGauth = new TSItem();
lastGauth.label = "Last Gauth/2FA Validation";
lastGauth.level = 6;
trustScanList.push(lastGauth);

var numCountryLogins = new TSItem();
numCountryLogins.label = "Number of Unique Country Logins (last 30 days)";
numCountryLogins.level = 9;
trustScanList.push(numCountryLogins);

var numLoginIPs = new TSItem();
numLoginIPs.label = "Number of Unique Login IP's (last 30 days)";
numLoginIPs.level = 3;
trustScanList.push(numLoginIPs);

var numISPs = new TSItem();
numISPs.label = "Number of Unique ISP's (last 30 days)";
numISPs.level = 6;
trustScanList.push(numISPs);

var registrationLastIP = new TSItem();
registrationLastIP.label = "Matching registration and last IP";
registrationLastIP.level = 3;
trustScanList.push(registrationLastIP);

var regionLastIP = new TSItem();
regionLastIP.label = "Matching region of registration and latest IP";
regionLastIP.level = 3;
trustScanList.push(regionLastIP);

var countryLastIP = new TSItem();
countryLastIP.label = "Matching country of registration and latest IP";
countryLastIP.level = 6;
trustScanList.push(countryLastIP);

var ipMatchMembers = new TSItem();
ipMatchMembers.label = "Latest IP Matching Other Members";
ipMatchMembers.level = 6;
trustScanList.push(ipMatchMembers);

var dealDisputes = new TSItem();
dealDisputes.label = "Deal Disputes (Claimant/Defendant)";
dealDisputes.level = 9;
trustScanList.push(dealDisputes);

//var usernameChange = new TSItem();
//usernameChange.label = "Last Username Change";
//usernameChange.level = 6;
//trustScanList.push(usernameChange);

var specialCharUsername = new TSItem();
specialCharUsername.label = "Special Characters in Username";
specialCharUsername.level = 3;
trustScanList.push(specialCharUsername);

var accountAge = new TSItem();
accountAge.label = "Account Age";
accountAge.level = 6;
trustScanList.push(accountAge);

console.log(trustScanList);
// ------------------------------ Script ------------------------------
for (var tsListIndex = 0; tsListIndex < trustScanList.length; tsListIndex++) {
    table.find("td").each(function( tableIndex ) {
        //
        if ($(this).text().includes(trustScanList[tsListIndex].label)){
            trustScanList[tsListIndex].level = getStatLevel($(this));
        }
    });
}


function getStatLevel(leftCol){
    var level, tsColor;
    // Just incase a cell doesn't have any value, default to Red
    if (leftCol.parent().children().hasClass("red") || leftCol.parent().children().children().hasClass("red")){
        tsColor = "red";
    } else if (leftCol.parent().children().hasClass("yellow") || leftCol.parent().children().children().hasClass("yellow")){
        tsColor = "yellow";
    } else if (leftCol.parent().children().hasClass("green") || leftCol.parent().children().children().hasClass("green")){
        tsColor = "green";
    } else {
        tsColor = "none";
    }
    switch(tsColor) {
            /*
            Red (low): 1
            Yellow (medium): 2
            Green (high): 3
            Normal (none): 0
            */
        case "none": level = 0;
            break;
        case "red": level = 1;
            break;
        case "yellow": level = 2;
            break;
        case "green": level = 3;
            break;
            // Normal
        default: level = -1;
            break;
    }
    console.log(leftCol.text() + "=" + level);
    return level;
}