// ==UserScript==
// @name       Rep Charts
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.1.1
// @description  Display graphical information on reputation.php
// @require https://code.jquery.com/jquery-3.1.1.js
// @require https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.bundle.min.js
// @match      *://hackforums.net/reputation.php?uid=*
// @match      *://hackforums.net/repsgiven.php?uid=*
// @copyright  2016+
// @updateURL https://github.com/xadamxk/HF-Userscripts/raw/master/Rep%20Charts/Rep%20Charts.user.js
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 1.1.1: Added support for repsgiven.php
// version 1.1.0: Added Rep Timeline chart, bug fixes, auto-scale
// version 1.0.1: Added percentes to legend/tooltips
// version 1.0.0: Initial Release
// ------------------------------ Dev Notes -----------------------------
// TODO: Implement graph with post activity?
// TODO: Tooltip summaries?
// ------------------------------ SETTINGS ------------------------------
// Debug
var debug = true; // Default: false
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
var totRepTotal = (posRepTotal + neuRepTotal + negRepTotal);
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
//$(tableDTotal).css("background","#393939");
//$(tableDTotal).css("height","250");
$(tableDTotal).css("float","left");
$(".trow1 table:eq(0) tbody:eq(0) tr:eq(0) td:eq(0)").after(tableDTotal);
// Canvas
var canvasTotal = document.createElement('canvas');
canvasTotal.id = "repCanvas";
//$(canvasTotal).css("margin", "auto");
$(canvaslastRep).css("vertical-align", "middle");
$("#insertedTableD").append(canvasTotal);
// Canvas instance
var repChartTotalCanvas = document.getElementById('repCanvas').getContext('2d');
// Total rep pie chart
var repChartTotal = new Chart(repChartTotalCanvas, {
    type: 'pie',
    data: {
        labels: ["Positives ("+((posRepTotal/totRepTotal)*100).toFixed(1)+"%)", 
                 "Neutrals ("+((neuRepTotal/totRepTotal)*100).toFixed(1)+"%)", 
                 "Negatives ("+((negRepTotal/totRepTotal)*100).toFixed(1)+"%)"],
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
            position: 'top',
            labels: {
                boxWidth: 20,
                fontSize: 12,
            }
        },
    }
});

// lastRep Pie Chart
var weekPos = parseInt($(".tborder tbody tr:eq(2) td table tbody tr td:eq(2) table tbody tr:eq(1) td:eq(1) span").text());
var weekNeu = parseInt($(".tborder tbody tr:eq(2) td table tbody tr td:eq(2) table tbody tr:eq(1) td:eq(2) span").text());
var weekNeg = parseInt($(".tborder tbody tr:eq(2) td table tbody tr td:eq(2) table tbody tr:eq(1) td:eq(3) span").text());
var weekTot = (weekPos + weekNeu + weekNeg);
var monthPos = parseInt($(".tborder tbody tr:eq(2) td table tbody tr td:eq(2) table tbody tr:eq(2) td:eq(1) span").text());
var monthNeu = parseInt($(".tborder tbody tr:eq(2) td table tbody tr td:eq(2) table tbody tr:eq(2) td:eq(2) span").text());
var monthNeg = parseInt($(".tborder tbody tr:eq(2) td table tbody tr td:eq(2) table tbody tr:eq(2) td:eq(3) span").text());
var monthTot = (monthPos + monthNeu + monthNeg);
var sixmonthPos = parseInt($(".tborder tbody tr:eq(2) td table tbody tr td:eq(2) table tbody tr:eq(3) td:eq(1) span").text());
var sixmonthNeu = parseInt($(".tborder tbody tr:eq(2) td table tbody tr td:eq(2) table tbody tr:eq(3) td:eq(2) span").text());
var sixmonthNeg = parseInt($(".tborder tbody tr:eq(2) td table tbody tr td:eq(2) table tbody tr:eq(3) td:eq(3) span").text());
var sixmonthTot = (sixmonthPos + sixmonthNeu + sixmonthNeg);
if(debug){
    console.log("Week Vals: " + weekPos + ", " + weekNeu + ", " + weekNeg + ", " + weekTot);
    console.log("Month Vals: " + monthPos + ", " + monthNeu + ", " + monthNeg+ ", " + monthTot);
    console.log("Six Month Vals: " + sixmonthPos + ", " + sixmonthNeu + ", " + sixmonthNeg+ ", " + sixmonthTot);
}
// Table Row (created new table row above "Comments" - removed
//var tableRowlastRep = document.createElement('tr');
//tableRowlastRep.id = "insertedTableRowlastRep";
//$(".quick_keys tr:eq(2)").after(tableRowlastRep);

// Table D
var tableDlastRep = document.createElement('td');
tableDlastRep.id = "insertedTableDlastRep";
//$(tableDlastRep).css("background","#393939");
$(tableDlastRep).css("height", "250");
$("#insertedTableD").after(tableDlastRep); //$("#insertedTableRowlastRep").append(tableDlastRep);
// Canvas
var canvaslastRep = document.createElement('canvas');
canvaslastRep.id = "repCanvaslastRep";
$(canvaslastRep).css("vertical-align", "middle");
$("#insertedTableDlastRep").append(canvaslastRep);
// Canvas instance
var repChartlastRepCanvas = document.getElementById('repCanvaslastRep').getContext('2d');
var barOptions_stacked = {
    title: {
        display: true,
        fontColor: "#cccccc",
        text:'Timeline'
    },
    tooltips: {
        enabled: true
    },
    hover :{
        animationDuration: 100
    },
    scales: {
        // Bottom-Labels (Rep)
        xAxes: [{
            ticks: {
                display: true,
                beginAtZero:true,
                fontFamily: "'Open Sans Bold', sans-serif",
                fontSize:11,

            },
            scaleLabel:{
                display:true
            },
            gridLines: {
            }, 
            stacked: true
        }],
        // Left-Labels (Time)
        yAxes: [{
            gridLines: {
                display:false,
                color: "#fff",
                zeroLineColor: "#fff",
                zeroLineWidth: 0
            },
            ticks: {
                display: true,
                fontFamily: "'Open Sans Bold', sans-serif",
                fontSize:11
            },
            stacked: true
        }]
    },
    legend:{
        display:true,
        fullWidth: true,
        labels: {
            boxWidth: 20,
            fontSize: 12,
        }
    },
    // Data labels 
    //animation: {
    //onComplete: function () {
    //var chartInstance = this.chart;
    //var ctx = chartInstance.ctx;
    //ctx.font = "9px Open Sans";
    //ctx.fillStyle = "#fff";

    //Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) {
    //var meta = chartInstance.controller.getDatasetMeta(i);
    //Chart.helpers.each(meta.data.forEach(function (bar, index) {
    //data = dataset.data[index];
    //if(i===0){
    //ctx.fillText(data, 70, bar._model.y+4);
    //} else {
    //ctx.fillText(data, bar._model.x-10, bar._model.y+4);
    //}
    //}),this);
    //}),this);
    //}
    //},
    //pointLabelFontFamily : "Quadon Extra Bold",
    //scaleFontFamily : "Quadon Extra Bold",
};
var repChartlastRep = new Chart(repChartlastRepCanvas, {
    type: 'horizontalBar',
    data: {
        labels: ["Week", "Month", "6 Months"],
        datasets: [{
            backgroundColor: [
                posRepColor,
                posRepColor,
                posRepColor
            ],
            data: [weekPos, monthPos, sixmonthPos],
            label: "Positives"
        },{
            backgroundColor: [
                neuRepColor,
                neuRepColor,
                neuRepColor
            ],
            data: [weekNeu, monthNeu, sixmonthNeu],
            label: "Neutrals"
        },{
            backgroundColor: [
                negRepColor,
                negRepColor,
                negRepColor
            ],
            data: [weekNeg, monthNeg, sixmonthNeg],
            label: "Negatives"
        }]
    },

    options: barOptions_stacked,
});