// ==UserScript==
// @name                        HackForums Slot Bot
// @namespace           Xerotic
// @description         Bot to automatically play HF Slots.
// @include                     https://hackforums.net/slots.php
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @version                     0.0.1
// @grant                       none
// ==/UserScript==
// 'This script is dangerous' -Adam

(function() {
    var $j = jQuery.noConflict();

    // Load HF Slot Bot data or create a new object if none exists
    var HSB = localStorage.getItem('hf-slot-bot');

    if(HSB === null) {
        HSB = {
            totalSpins: 0,
            totalBet: 0,
            totalWon: 0,
            logs: [],

        }
    } else {
        HSB = JSON.parse(HSB);
    }

    // Set up some variables to keep track of this session
    var botRunning = false;
    var ajaxInterval = 1000;
    var startBet = 1;
    var maxBet = 24;
    var spinsPerAmount = 6;
    var betMultiplier = 2;
    var currentBet = startBet;
    var currentSpin = 1;
    var latestWin = 0;
    var sessionSpins = 0;
    var sessionBet = 0;
    var sessionWon = 0;
    var credits = Math.max(0, parseInt($j('#credits').text()));
    var latestAjax = 0;

    // Add the control buttons and status text
    $j('#PageContainer').parent().append('<button id="ToggleSlotBot">Start Slot Bot</button><button id="ResetSlotBot" style="margin-left: 5px;">Reset Bet</button><button id="LocalStorageRemove" style="margin-left: 5px;">Remove Logs</button><span style="margin-left: 10px;" id="SlotBotStatus">Not started</span><div id="SlotBotInfo" style="width: 180px; padding: 15px; border: 1px solid #222; margin-top: 15px;"></div>');

    var totalNet = HSB.totalWon - HSB.totalBet;
    var totalNetColor = "";

    if(totalNet > 0) {
        totalNetColor = "green";
    } else if(totalNet < 0) {
        totalNetColor = "red";
    } else {
        totalNetColor = "#949494";
    }

    // Append each status bit to the SlotBotInfo div
    $j('#SlotBotInfo').append('<span style="display: inline-block; width: 100px;">Credits:</span><span id="SlotBotCredits">' + credits + '</span><br />');
    $j('#SlotBotInfo').append('<span style="display: inline-block; width: 100px;">Latest Win:</span><span id="SlotBotLatestWin">0</span><br />');
    $j('#SlotBotInfo').append('<span style="display: inline-block; width: 100px;">Current Bet:</span><span id="SlotBotBet">' + currentBet + '</span><br />');
    $j('#SlotBotInfo').append('<span style="display: inline-block; width: 100px;">Current Spin:</span><span id="SlotBotSpin">' + currentSpin + '</span><br /><br />');
    $j('#SlotBotInfo').append('<span style="display: inline-block; width: 100px;">Session Spins:</span><span id="SlotBotSessionSpins">' + sessionSpins + '</span><br />');
    $j('#SlotBotInfo').append('<span style="display: inline-block; width: 100px;">Session Bet:</span><span id="SlotBotSessionBet">' + sessionBet + '</span><br />');
    $j('#SlotBotInfo').append('<span style="display: inline-block; width: 100px;">Session Won:</span><span id="SlotBotSessionWon">' + sessionWon + '</span><br />');
    $j('#SlotBotInfo').append('<span style="display: inline-block; width: 100px;">Session Net:</span><span id="SlotBotSessionNet">0</span><br /><br />');
    $j('#SlotBotInfo').append('<span style="display: inline-block; width: 100px;">Total Spins:</span><span id="SlotBotTotalSpins">' + HSB.totalSpins + '</span><br />');
    $j('#SlotBotInfo').append('<span style="display: inline-block; width: 100px;">Total Bet:</span><span id="SlotBotTotalBet">' + HSB.totalBet + '</span><br />');
    $j('#SlotBotInfo').append('<span style="display: inline-block; width: 100px;">Total Won:</span><span id="SlotBotTotalWon">' + HSB.totalWon + '</span><br />');
    $j('#SlotBotInfo').append('<span style="display: inline-block; width: 100px;">Total Net:</span><span id="SlotBotTotalNet" style="color: ' + totalNetColor + ';">' + totalNet + '</span><br />');

    // Updates the SlotBotInfo spans based on their current variable value
    function updateInfoBox() {
        var sessionNet = sessionWon - sessionBet;
        totalNet = HSB.totalWon - HSB.totalBet;

        $j('#SlotBotCredits').text(credits);
        $j('#SlotBotLatestWin').text(latestWin);
        $j('#SlotBotBet').text(currentBet);
        $j('#SlotBotSpin').text(currentSpin);
        $j('#SlotBotSessionSpins').text(sessionSpins);
        $j('#SlotBotSessionBet').text(sessionBet);
        $j('#SlotBotSessionWon').text(sessionWon);
        $j('#SlotBotSessionNet').text(sessionNet);
        $j('#SlotBotTotalSpins').text(HSB.totalSpins);
        $j('#SlotBotTotalBet').text(HSB.totalBet);
        $j('#SlotBotTotalWon').text(HSB.totalWon);
        $j('#SlotBotTotalNet').text(totalNet);

        var sessionColor = "";
        var totalColor = "";

        if(sessionNet > 0) {
            sessionColor = "green";
        } else if(sessionNet < 0) {
            sessionColor = "red";
        } else {
            sessionColor = "";
        }

        if(totalNet > 0) {
            totalColor = "green";
        } else if(totalNet < 0) {
            totalColor = "red";
        } else {
            totalColor = "";
        }

        $j('#SlotBotSessionNet').css('color', sessionColor);
        $j('#SlotBotTotalNet').css('color', totalColor);
    }

    // Handle the bet amount logic
    function checkCreditAmount() {
        if(currentSpin > spinsPerAmount) {
            currentSpin = 1;

            if(currentBet >= maxBet) {
                currentBet = startBet;
            } else {
                currentBet = currentBet * betMultiplier;
            }

            if(currentBet > credits) {
                currentBet = credits;
            }

            if(currentBet > maxBet) {
                currentBet = maxBet;
            }
        }
    }

    // Function in the event of AJAX error
    function slotBotErrorAjax(data) {
        console.log(data);
        if(data.status == 503) {
            // 503 error (too many requests) attempt to start again
            runSlotBotRateLimit();
        } else {
            botRunning = false;
        }
    }

    // Function to handle a successful AJAX call
    function slotBotSuccessAjax(data) {
        HSB.logs.push(data);
        credits = data.credits;
        sessionSpins++;
        HSB.totalSpins++;

        // Check to see if it was a "blank" win... if so, just spin again
        var blank_win = false;
        if(data.prize != null) {
            if(data.prize.payoutCredits == currentBet) {
                blank_win = true;
            }
        }

        // No blank win, let us proceed as normal
        if(blank_win == false) {
            currentSpin++;
            sessionBet += currentBet;
            HSB.totalBet += currentBet;

            if(data.prize != null) {
                sessionWon += data.prize.payoutCredits;
                HSB.totalWon += data.prize.payoutCredits;
                latestWin = data.prize.payoutCredits;
                currentBet = startBet;
                currentSpin = 1;
            }

            checkCreditAmount();
        }

        // Update the localstorage after every successful AJAX
        localStorage.setItem('hf-slot-bot', JSON.stringify(HSB));

        // Update our visual guide displayed on the page
        updateInfoBox();

        // Start the next request (based on rate limit)
        runSlotBotRateLimit();
    }

    // Time the next AJAX request based on our rate limit.
    function runSlotBotRateLimit() {
        // Rate limiting. We don't want to send too many requests!
        var time_check = Date.now() - latestAjax;

        if(botRunning) {
            if(time_check >= ajaxInterval) {
                runSlotBot();
            } else {
                setTimeout(runSlotBot, (ajaxInterval - time_check));
            }
        }
    }

    // Time to attempt to spin the slot machine
    function runSlotBot() {
        checkCreditAmount();

        if(currentBet < 1) {
            $j('#SlotBotStatus').text('Insufficient Funds!');
        } else if(botRunning) {
            console.log('Sending request...');
            latestAjax = Date.now();

            $.ajax({
                url: '/slots/spin.php',
                type: "POST",
                data: { bet : currentBet, windowID: windowID, machine_name: machineName, my_post_key: my_post_key},
                dataType: "json",
                timeout: 10000,
                success: function(data){
                    if(!data.success) {
                        slotBotErrorAjax(data);
                    } else {
                        slotBotSuccessAjax(data);
                    }
                },
                error: function(data) {
                    slotBotErrorAjax(data);
                }
            });
        }
    }

    $j('#ResetSlotBot').click(function() {
        currentBet = startBet;
        currentSpin = 1;
    });

    $j('#ToggleSlotBot').click(function() {
        if(botRunning) {
            botRunning = false;
            $j('#SlotBotStatus').text('Slot Bot Stopped');
            $j(this).text('Start Slot Bot');
        } else {
            botRunning = true;
            $j('#SlotBotStatus').text('Running...');
            $j(this).text('Stop Slot Bot');

            runSlotBot();
        }
    });

    $j('#LocalStorageRemove').click(function() {
        localStorage.removeItem('hf-slot-bot');
    });

})();