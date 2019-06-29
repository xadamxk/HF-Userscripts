// ==UserScript==
// @name       HF Modern Customizer
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.0
// @description HF Modern theme your way
// @require     https://code.jquery.com/jquery-3.1.1.js
// @match      *://hackforums.net/*
// @copyright  2016+
// @updateURL
// @downloadURL
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ==/UserScript==
// ------------------------------ Changelog -----------------------------
// v 1.0.0:
// ------------------------------ Dev Notes -----------------------------
// Match the color pallete of existing blue theme:
// - https://www.colorhexa.com/2f3b5d
// possible orange: ffa64d
// ------------------------------ SETTINGS ------------------------------
const colors = {
    cyan: {
        mosaic: "https://github.com/xadamxk/HF-Userscripts/blob/master/HFMC/mosaics/mosaic_cyan.png?raw=true",
        color: "#2f525d"
    },
    purple: {
        mosaic: "//hackforums.net/images/mobale/mosaic_pl.png",
        color: "#3a2f5d"
    },
    green: {
        mosaic: "//hackforums.net/images/mosaic_green.png",
        color: "#3b5d2f" //2f5d51
    },
    green_light: {
        mosaic: "https://github.com/xadamxk/HF-Userscripts/blob/master/HFMC/mosaics/mosaic_green2.png?raw=true",
        color: "#2f5d3a" //2f5d51
    },
    magenta: {
        mosaic: "https://github.com/xadamxk/HF-Userscripts/blob/master/HFMC/mosaics/mosaic_magenta.png?raw=true",
        color: "#5d2f52"
    },
    // Needs lighter mosaic
    pink: {
        mosaic: "https://github.com/xadamxk/HF-Userscripts/blob/master/HFMC/mosaics/mosaic_pink.png?raw=true",
        color: "#5d2f47"
    },
    rainbow: {
        mosaic: "https://t3.ftcdn.net/jpg/01/25/27/70/240_F_125277074_lg9KkZlJYwKIiIiFzciXjnh7edM4cNRD.jpg",
        color: "linear-gradient(to right, red,orange,green,blue,purple)"
    },
    // Needs to be darker
    yellow: {
        mosaic: "https://github.com/xadamxk/HF-Userscripts/blob/master/HFMC/mosaics/mosaic_yellow.png?raw=true",
        color: "#ffe14d"
    }
}
var selectedTheme = colors.magenta;
// ------------------------------ Script ------------------------------
var mosaic = selectedTheme.mosaic;
var color = selectedTheme.color;
// Background mosaic
$("body").css("background", "#0e0e0e url("+mosaic+") fixed");

// style
$(".thead, .shadetabs li a.selected, .pagination .pagination_current").css("background", color);
