// ==UserScript==
// @name       HF Scratch Card
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.0
// @description Click cards to auto scratch them
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://hackforums.net/scratchcard.php?action=play
// @copyright  2018+
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 1.0.0: Beta Release
// ------------------------------ Dev Notes -----------------------------
//
// ------------------------------ SETTINGS ------------------------------
// ------------------------------ Script ------------------------------
var myPostKey = document.getElementsByTagName('head')[0].innerHTML.split('my_post_key = "')[1].split('";')[0]
var dataGameSettings = null;
var dataGameState = null;
var gameState = null;
var noPrizeDialog = null;
var prizeDialog =  null;
var dialogOverlay = null;
var openedCells = 0;

function handleCardResult() {
    var prize = gameState.prize;
    var payout = parseFloat(gameState.pay_out, 10);

    if (!prize) {
        if (openedCells > 2) {
            $("#container").find(".scratch_card_end_game_no_prize_dialog").show();
            $("#container").find(".scratch_card_dialog_overlay").show();
        }
    } else {
        var dialogBody = "You won " + prize + "byte(s)!";
        alert(dialogBody);
        // START
        $(".scratch_card_dialog_body").html(dialogBody);
        // show the correct button
        $(".scratch_card_dialog_button").hide();
        if (prize.win_redirect_url) {
            var $button = $(".scratch_card_dialog_button_collect_prize");
            $button.data("url", prize.win_redirect_url);
            $button.show();
        } else {
            $(".scratch_card_dialog_button_play_again").show();
        }

        $(".scratch_card_end_game_with_prize_dialog").show();
        $(".scratch_card_dialog_overlay").show();
        // END
        ScratchcardSounds.playSound('win');

    }

    ScratchCardsBalanceChange(ScratchCards.balance);
}

function generatePrizeText(prize, payout) {
    if (prize.prize_name) {
        return "You won " + prize.prize_name;
    } else {
        return "You won " + this.formatPayout();
    }
};

$(".cnv_scratch").click(function() {
    dataGameSettings = JSON.parse($(".scratch_card").attr("data-game-settings"));
    dataGameState = JSON.parse($(".scratch_card").attr("data-game-state"));
    noPrizeDialog = $("#container").find(".scratch_card_end_game_no_prize_dialog")[0];
    prizeDialog =  $("#container").find(".scratch_card_end_game_with_prize_dialog")[0];
    dialogOverlay = $("#container").find(".scratch_card_dialog_overlay")[0];

    if (dataGameState){
        if (dataGameState.opened_cells){
            openedCells = dataGameState.opened_cells.length;
            console.log("HFGS Opened Cards: "+openedCells);
        }
    } else {
        location.href = location;
    }

    generateRequestForCells($(this).index(".cnv_scratch"));

});

function generateRequestForCells(index) {

    var params = {
        action: "open",
        game_type: dataGameSettings.id,
        game_id: dataGameState.game_id,
        client_open_cells: openedCells,
        cell_num: index,
        my_post_key: myPostKey,
        game_order_id: dataGameState.order_id
    };
    $.ajax({
        url: "https://hackforums.net/scratchcards_action.php",
        type: "POST",
        data: params,
        dataType: "json",
        timeout: 10000,
        success: function(data){
            if (!data.success) {
                console.log(data);
                alert("HFGS request failed.");
            } else {
                openedCells = openedCells + 1;
                ScratchCards.balance = data.balance;
                gameState = data.game_state;
                gameState = data;
                $(".cnv_scratch:eq(" + index + ")").hide();
                handleCardResult();
            }
        },
        error: function() {
            alert("Scratch card # " + cellNum + " has already been scratched.");
        }
    });
}