// ==UserScript==
// @name       HF Trust Scan Score
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.0
// @description Add's weights to HF's Trust Scan
// @require https://code.jquery.com/jquery-3.1.1.js
// @require https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.bundle.min.js
// @match      *://hackforums.net/trustscan.php?uid=*
// @copyright  2016+
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 1.0.1: Public Release
// version 1.0.0: Beta Release
// ------------------------------ Dev Notes  ----------------------------
// Add IF conditional on None to check for default (gray?) text
// tcat class is DARK
// ------------------------------ Classes -----------------------------
class TSItem {
    constructor(label, weight, color, finalWeight) {
        this.label = label; // Label
        this.weight = weight; // Weight
        this.color = color; // Color
        this.finalWeight = finalWeight; // Actual Score
        this.set();
    }
    set() {
        this.label = "";
        this.weight = 0;
        this.color = 0;
        this.finalWeight = 0;
    }
}
class TSOverall {
    constructor(totalOveral, totalActual, countRed, countYellow, countGreen) {
        this.totalOveral = totalOveral;
        this.totalActual = totalActual;
        this.countRed = countRed;
        this.countYellow = countYellow;
        this.countGreen = countGreen;
        this.set();
    }
    set() {
        this.totalOveral = 0;
        this.totalActual = 0;
        this.countRed = 0;
        this.countYellow = 0;
        this.countGreen = 0;
    }
}
// ------------------------------ Settings ------------------------------
var trustScanList= [];

var gauth2FA = new TSItem();
gauth2FA.label = "Gauth/2FA:";
gauth2FA.weight = 9;
trustScanList.push(gauth2FA);

var lastGauth = new TSItem();
lastGauth.label = "Last Gauth/2FA Validation";
lastGauth.weight = 6;
trustScanList.push(lastGauth);

var numCountryLogins = new TSItem();
numCountryLogins.label = "Number of Unique Country Logins (last 30 days)";
numCountryLogins.weight = 9;
trustScanList.push(numCountryLogins);

var numLoginIPs = new TSItem();
numLoginIPs.label = "Number of Unique Login IP's (last 30 days)";
numLoginIPs.weight = 3;
trustScanList.push(numLoginIPs);

var numISPs = new TSItem();
numISPs.label = "Number of Unique ISP's (last 30 days)";
numISPs.weight = 6;
trustScanList.push(numISPs);

var registrationLastIP = new TSItem();
registrationLastIP.label = "Matching registration and last IP";
registrationLastIP.weight = 3;
trustScanList.push(registrationLastIP);

var regionLastIP = new TSItem();
regionLastIP.label = "Matching region of registration and latest IP";
regionLastIP.weight = 3;
trustScanList.push(regionLastIP);

var countryLastIP = new TSItem();
countryLastIP.label = "Matching country of registration and latest IP";
countryLastIP.weight = 6;
trustScanList.push(countryLastIP);

var ipMatchMembers = new TSItem();
ipMatchMembers.label = "Latest IP Matching Other Members";
ipMatchMembers.weight = 6;
trustScanList.push(ipMatchMembers);

var dealDisputes = new TSItem();
dealDisputes.label = "Deal Disputes (Claimant/Defendant)";
dealDisputes.weight = 9;
trustScanList.push(dealDisputes);

//var usernameChange = new TSItem();
//usernameChange.label = "Last Username Change";
//usernameChange.weight = 6;
//trustScanList.push(usernameChange);

var specialCharUsername = new TSItem();
specialCharUsername.label = "Special Characters in Username";
specialCharUsername.weight = 3;
trustScanList.push(specialCharUsername);

var accountAge = new TSItem();
accountAge.label = "Account Age";
accountAge.weight = 6;
trustScanList.push(accountAge);

// ------------------------------ Script ------------------------------
var trustScanListStats = new TSOverall();
var TSSearchDiv = $( "table").find("strong:contains(Trust Scan Search)").parent().parent().parent().parent().parent();
TSSearchDiv.after("<br>").after($("<table>").css("width", "100%").css("margin-right", "auto").css("margin-left", "0px").attr('id', 'hfxTSDiv').attr('border', 0).attr('cellspacing', 1)
                                .attr('cellpadding', 4).attr('colspan', 6).addClass('tborder')).append('<tbody>').attr('colspan', 6);
// Insert thead (title, thread hyperlink)
$('#hfxTSDiv').append($('<tr>').append($('<td>').addClass('thead').attr('colspan', 2).append($('<strong>').text("HFX: Trust Scan Graph"))
                                       .append($('<a>').attr('href', '')
                                               .append($('<strong>').text('Brought to you by HFX').addClass('float_right')))));
//
$('#hfxTSDiv').append($('<tr>')
                      .append($('<td>').append($('<strong>').text('Overall:')).addClass('trow1').attr('colspan', 1).attr('align', 'left').css("font-size", "14px").css("width", "80%")
                             .append($('<div>').attr("id","hfxTSGraph").addClass('trow1').css('float', 'right').css("font-size", "14px").css("width", "50%")))
                      .append($('<td>').attr("id","hfxTSFinalScore").append("Calculating...").addClass('trow1').attr('colspan', 1).attr('align', 'left').css("font-size", "14px").css("width", "20%")));

// .append($('<td>').attr("id","hfxTSGraph").addClass('trow1').attr('colspan', 1).attr('align', 'left').css("font-size", "14px").css("width", "50%")));

var table = $( "table").find("strong:contains(Trust Scan of )").parent().parent().parent().parent();
for (var tsListIndex = 0; tsListIndex < trustScanList.length; tsListIndex++) {
    table.find("td").each(function( tableIndex ) {
        //
        if ($(this).text().includes(trustScanList[tsListIndex].label)){
            // Get Color Level
            trustScanList[tsListIndex].color = getStatLevel($(this));
            // Get Final weight
            trustScanList[tsListIndex].finalWeight = (trustScanList[tsListIndex].weight/3) * trustScanList[tsListIndex].color;
            // Add to final stats
            trustScanListStats.totalOveral += trustScanList[tsListIndex].weight;
            trustScanListStats.totalActual += trustScanList[tsListIndex].finalWeight;
            switch (trustScanList[tsListIndex].color){
                case 0:
                    break;
                case 1: trustScanListStats.countRed++;
                    break;
                case 2: trustScanListStats.countYellow++;
                    break;
                case 3: trustScanListStats.countGreen++;
                    break;
                    // Normal
                default: break;
            }
        }
    });
}

console.log(trustScanListStats);
$("#hfxTSFinalScore").text(trustScanListStats.totalActual + "/" + trustScanListStats.totalOveral +
                           " (" + parseFloat(Math.round(((trustScanListStats.totalActual/trustScanListStats.totalOveral)*100) * 100) / 100).toFixed(2) + "%)");

console.log(trustScanList);

var canvasTotal = document.createElement('canvas');
canvasTotal.id = "hfxTSCanvas";
//$(canvaslastRep).css("vertical-align", "middle");
$("#hfxTSGraph").append(canvasTotal);
// Canvas instance
var hfxTSCanvas = document.getElementById('hfxTSCanvas').getContext('2d');
// Total rep pie chart
var hfxTSChart = new Chart(hfxTSCanvas, {
    type: 'pie',
    data: {
        labels: ["Flags",
                 "Warnings",
                 "Confirmations"],
        datasets: [{
            backgroundColor: [
                "#ff0000",
                "#ffff00",
                "#00D01D"
            ],
            data: [trustScanListStats.countRed, trustScanListStats.countYellow, trustScanListStats.countGreen]
        }]
    },
    options: {
        cutoutPercentage: 50,
        animateRotate: true,
        hover: {
            animationDuration: 750
        },
        title: {
            display: true,
            fontColor: "#cccccc",
            text: 'Trust Scan Summary',
            fontSize: 18
        },
        legend: {
            display: true,
            fullWidth: true,
            position: 'top',
            labels: {
                fontColor: "white",
                boxWidth: 20,
                fontSize: 12,
            },
        },
    }
});

// ------------------------------ Functions ------------------------------
function getStatLevel(leftCol){
    var level, tsColor;
    if (leftCol.parent().children().hasClass("red") || leftCol.parent().children().children().hasClass("red")){
        tsColor = "red";
    } else if (leftCol.parent().children().hasClass("yellow") || leftCol.parent().children().children().hasClass("yellow")){
        tsColor = "yellow";
    } else if (leftCol.parent().children().hasClass("green") || leftCol.parent().children().children().hasClass("green")){
        tsColor = "green";
    }
    // Need to add conditional to check for gray
    else {
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
    return level;
}