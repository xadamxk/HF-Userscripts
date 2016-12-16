// ==UserScript==
// @name       Rep Charts
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.0
// @description  Display graphical information on reputation.php
// @require https://code.jquery.com/jquery-3.1.1.js
// @require https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.bundle.min.js
// @match      *hackforums.net/reputation.php?uid=*
// @copyright  2016+
// @updateURL 
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 1.0.0: Initial Release
// ------------------------------ Dev Notes -----------------------------
// TODO: Add table row for more graphs?
// TODO: Implement graph with post activity?
// TODO: Tooltips
// ------------------------------ SETTINGS ------------------------------
// Debug
var debug = false; // Default: false
// Rep text colors
var posRepColor = "#32CD32"; // Default: ##32CD32
var neuRepColor = "#666666"; // Default: #666666
var negRepColor = "#CC3333"; // Default: #CC3333
// ------------------------------ ON PAGE LOAD ------------------------------
// Grab rep total values
var username = $(".largetext strong span").text();
var posRepTotal = parseInt($(".smalltext a:eq(0)").text());
var neuRepTotal = parseInt($(".smalltext a:eq(1)").text());
var negRepTotal = parseInt($(".smalltext a:eq(2)").text());
// Debug info
if (debug){
    console.log("Username: "+username);
    console.log("Positive Rep Totoal: "+posRepTotal);
    console.log("Neutral Rep Totoal: "+neuRepTotal);
    console.log("Negative Rep Total: "+negRepTotal);
}
// Table D
var tableDTotal = document.createElement('td');
tableDTotal.id = "insertedTableD";
//$(tableD).css("width","450");
$(tableDTotal).css("float","left");
$(".trow1 table:eq(0) tbody:eq(0) tr:eq(0) td:eq(0)").after(tableDTotal);
// Canvas
var canvasTotal = document.createElement('canvas');
canvasTotal.id = "repCanvas";
$(canvasTotal).css("margin", "auto");
$(canvasTotal).css("display", "block");
$("#insertedTableD").append(canvasTotal);
// Canvas instance
var repChartTotalCanvas = document.getElementById('repCanvas').getContext('2d');
// Total rep pie chart
var repChartTotal = new Chart(repChartTotalCanvas, {
    type: 'pie',
    data: {
        labels: ["Positives", "Neutrals", "Negatives"],
        datasets: [{
            backgroundColor: [
                posRepColor,
                neuRepColor,
                negRepColor
            ],
            data: [posRepTotal, neuRepTotal, negRepTotal]
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
            text: username + '\'s Reputation Summary',
            fontSize: 18
        },
        legend: {
            display: true,
            fullWidth: true,
            position: 'left',
            labels: {
                boxWidth: 20,
                fontSize: 12,
            }
        },
    }
});