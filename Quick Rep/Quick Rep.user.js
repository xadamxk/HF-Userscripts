// ==UserScript==
// @name       Quick Rep
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    2.0.0
// @description Makes giving reputation on HF easier.
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://hackforums.net/showthread.php?tid=*
// @match      *://hackforums.net/private.php?action=read&pmid=*
// @match      *://hackforums.net/usercp.php
// @copyright  2016+
// @updateURL https://github.com/xadamxk/HF-Userscripts/raw/master/Quick%20Rep/Quick%20Rep.user.js
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 2.0.0: Implemented Rep Stack
//                - Restructured code
//                - and more...
// version 1.2.2: Some very small changes.
// version 1.2.1: - Added logic for conflicting scripts - relating to default response on posts.
//                - Cleaned some code up
// version 1.2.0: Added notifications support
// version 1.1.3: Variable error fix, string changes, and bug fixes
// version 1.1.2: Changed an error string
// version 1.1.1: Added support for PM's - Yani
// version 1.0.5: Added support for the classic userbit - Yani
// version 1.0.4: Edited 1.0.3 change so canned comment was more neutral
// version 1.0.3: Added default response if comment was empty - Mr Whiskey
// version 1.0.2: Bug fix for min rep comment requirements
// version 1.0.1: Bug fix for certain browsers
// version 1.0.0: Initial Release
// ------------------------------ Dev Notes -----------------------------
// The bugs are coming!
// ------------------------------ SETTINGS ------------------------------
// Label for button (visible from /showthread.php?)
var repButtonLabel = "Rep"; // Default: "Rep")
// Enables/Disables basic form of quick rep
//      basicquickRep = true : Opens a new window for giving rep
//      basicquickRep = false : Integrates rep menu into post bit
var basicQuickRep = false; // (Default: false)
// Rep comment box width
var repCommentWidth = "60%"; // (Default: "60%")
// Notification Dismissal Time
var notificationTimeout = 15000; // (Default: 15000)
// Auto Trigger Rep Stack - otherwise only triggers when out of reps
var stackRep = false; // (Default: false)
// Debug: Show console.log statements for debugging purposes
var debug = false; // (Default: false)
// ------------------------------ ON PAGE LOAD ------------------------------
// Global Vars
var uidArray = [];
var ajaxSuccess = false;
var errorFound = false;
var my_key, my_uid, my_pid, my_rid, my_repOptions, my_comments, repIndex;
var repComment, repLink, recipientUsername;
var stackdUID, stackdAmt, stackdReason;

const repLimit = "You have already given as many reputation ratings as you are allowed to for today";
const repSelf = "You cannot add to your own reputation";
const repSelfResp = "You can't rep yourself dumb dumb :P";

if (window.location.href.includes("hackforums.net/showthread.php?tid=") || 
    window.location.href.includes("hackforums.net/private.php?action=read&pmid=")){
    // Each post bit on page
    $(".bitButton[title='Trust Scan']").each(function (index, element) {
        var tsButton = $(element);
        var postMessage = tsButton.parents("table.tborder");
        // Grab UID & create button
        uidArray[index] = parseInt(tsButton.attr("href").split("uid=")[1]);
        tsButton.parent().append($("<a>").text(repButtonLabel).attr("id", "repButton"+index).attr("href", "#").addClass("bitButton"));
        // Standard Quick Rep
        if (basicQuickRep)
            $("body").on("click", "#repButton"+index, function() {MyBB.reputation(uidArray[index]);});
        // Integrated Quick Rep
        else{
            $("body").on("click", "#repButton"+index, function(e) {
                e.preventDefault();
                // ajax call on button click
                $.ajax({
                    url: "https://hackforums.net/reputation.php?action=add&uid="+uidArray[index],
                    cache: false,
                    success: function(response) {
                        // Check for errors
                        // No errors
                        var errorBlock = $(response).find("blockquote").html();
                        var permError = "Permission Error: ";
                        if (errorBlock === undefined){
                            if (debug)
                                console.log("No permission errors!");
                        }
                        // Rep Limit
                        else if (errorBlock.includes(repLimit)){
                            // Rep Stack logic
                            stackRep = true;
                        }
                        // Self rep
                        else if (errorBlock.includes(repSelf)){
                            errorFound = true;
                            window.alert(permError + repSelfResp);
                            return;
                        }
                        // Require Upgrade, Rep Disabled, Other?
                        else {
                            errorFound = true;
                            window.alert(permError + errorBlock);
                            return;
                        }
                        // No Rep Permission Errors
                        if(!errorFound){
                            // Grab rep index
                            repIndex = $(response).find("#reputation :selected").index();
                            // Magical string of justice: $(response).children(3).children().children().children().children().siblings(6)
                            // Post Key
                            my_key = $(response).find('[name=my_post_key]').val();
                            // UID
                            my_uid = $(response).find('[name=uid]').val();
                            // PID
                            my_pid = $(response).find('[name=pid]').val();
                            // RID
                            my_rid = $(response).find('[name=rid]').val();
                            // Select vals
                            my_repOptions = $(response).find('[name=reputation]').children();
                            // Comments
                            my_comments = $(response).find('[name=comments]').val();
                            if (debug){
                                console.log("my_key: "+my_key);
                                console.log("my_uid: "+my_uid);
                                console.log("my_pid: "+my_pid);
                                console.log("my_rid: "+my_rid);
                                console.log("my_repOptions(below): "+my_repOptions);
                                console.log(my_repOptions);
                                console.log("my_comments: "+my_comments);
                            }
                            ajaxSuccess = true;
                        }
                        // Shouldn't run if error, but just incase...
                        if (!errorFound){
                            // Textbox doesn't exist yet
                            if ($(postMessage).find('[id=repComment'+index+']').length === 0){
                                // Append rep reasoning textbox
                                $(postMessage).find("#repButton"+index).after($("<input type='text'>").attr("id", "repComment"+index).val(my_comments)
                                                                              .css("padding","3px 6px")
                                                                              .css("text-shadow","1px 1px 0px #000;")
                                                                              .css("background-color","#072948")
                                                                              .css("margin-left", "5px")
                                                                              .css("width", repCommentWidth)
                                                                              .css("background", "white")
                                                                              .css("box-shadow", "0 1px 0 0 #0F5799")
                                                                              .css("font-family", "arial")
                                                                              .css("font-size", "14px")
                                                                              .css("border", "1px solid #000")
                                                                              .css("margin", "5px")
                                                                              .css("color", "black")
                                                                             ); //.css("", "")
                            }
                            // Textbox already exists
                            else
                                $(postMessage).find("#repComment"+index).remove();

                            // Selectbox doesn't exist
                            if ($(postMessage).find('[id=repSelect'+index+']').length === 0){
                                // Append Rep selection
                                $(postMessage).find("#repComment"+index).after($("<select>").attr("id", "repSelect"+index).css("margin-right", "5px").addClass("button"));
                                // Append rep options from give rep page
                                $(my_repOptions).each(function (subindex, subelement) {
                                    $("#repSelect"+index).append( $('<option></option>').val($(subelement).val()).html($(subelement).text()));
                                });
                                // Set selected index
                                $("#repSelect"+index)[0].selectedIndex = repIndex;
                            }
                            // Selectbox already exists
                            else
                                $(postMessage).find("#repSelect"+index).remove();

                            // Post button doesn't exist
                            if ($(postMessage).find('[id=repPost'+index+']').length === 0){
                                // Append Rep User button
                                $(postMessage).find("#repSelect"+index).after($("<button>").text("Rep User").attr("id", "repPost"+index).addClass("button"));
                                // Click event for button
                                $("body").on("click", "#repPost"+index, function() {
                                    // Check if PM or thread
                                    var default_comment; // If rep comment is empty
                                    var next_loc; // Address to load on success
                                    recipientUsername = $(postMessage).find('.post_author strong .largetext a span').text();

                                    if(window.location.pathname == '/private.php'){
                                        next_loc = window.location.href;
                                        default_comment = 'Regarding your PM.';
                                    } else {
                                        // Cycle through attributes, look for '#' in matching html (counters against other scripts)
                                        for (i = 0; i < $(postMessage).find(".smalltext strong a").length; i++){
                                            if($(postMessage).find(".smalltext strong a")[i].text.includes("#"))
                                                next_loc = "https://hackforums.net/"+$(postMessage).find(".smalltext strong a:eq("+i+")").attr('href');
                                        }
                                        default_comment = "Regarding Thread: " + next_loc;
                                    }
                                    var stackString;
                                    // Rep comment is empty - use appropriate default
                                    if ($("#repComment"+index).val().length === 0){
                                        // Stack Rep - Default
                                        if (stackRep){
                                            // Stack string
                                            stackString = my_uid+"||"+recipientUsername+"||"+$("#repSelect"+index).val()+"||"+default_comment+"|||";
                                            // Make cookie if doesn't already exist
                                            if (document.cookie.replace(/(?:(?:^|.*;\s*)RepStackCookie\s*\=\s*([^;]*).*$)|^.*$/, "$1") === undefined)
                                                document.cookie = 'RepStackCookie=';
                                            // Add stackString to cookie
                                            document.cookie = 'RepStackCookie=' + document.cookie.replace(/(?:(?:^|.*;\s*)RepStackCookie\s*\=\s*([^;]*).*$)|^.*$/, "$1") + stackString;
                                            // Notification
                                            repComment = $("#repSelect"+index+" option:selected").text() + "\nRep Reasoning: "+ default_comment;
                                            notififyMe("Rep Stackd!",repComment, next_loc);
                                        }
                                        else{
                                            // Make $.Post Request
                                            giveRep(index, next_loc, $("#repSelect"+index+" option:selected").text(), $("#repSelect"+index+" option:selected").val(), default_comment);
                                        }
                                        // Remove rep elements
                                        hideRepElements(postMessage,index);
                                    }
                                    // Custom comment but too short
                                    else if ($("#repComment"+index).val().length < 11 && $("#repComment"+index).val().length > 0)
                                        window.alert("Rep comments must be atleast 10 chars.");

                                    // Input over 10 chars
                                    else{
                                        // Stack Rep - Custom
                                        if (stackRep){
                                            var newComment = $("#repComment"+index).val();
                                            // If rep reasoning contains '|' seperator, remove all
                                            newComment = $("#repComment"+index).val();
                                            do{newComment = newComment.replace('|','');}
                                            while (newComment.includes('|'));
                                            // Stack string
                                            stackString = my_uid+"||"+recipientUsername+"||"+$("#repSelect"+index).val()+"||"+newComment+"|||";
                                            // Make cookie if doesn't already exist
                                            if (document.cookie.replace(/(?:(?:^|.*;\s*)RepStackCookie\s*\=\s*([^;]*).*$)|^.*$/, "$1") === undefined)
                                                document.cookie = 'RepStackCookie=';
                                            // Add stackString to cookie
                                            document.cookie = 'RepStackCookie=' + document.cookie.replace(/(?:(?:^|.*;\s*)RepStackCookie\s*\=\s*([^;]*).*$)|^.*$/, "$1") + stackString;
                                            // Notification
                                            repComment = $("#repSelect"+index+" option:selected").text() + "\nRep Reasoning: "+ $("#repComment"+index).val();
                                            notififyMe("Rep Stackd!",repComment, next_loc);
                                        }
                                        else{
                                            // Make $.Post Request
                                            giveRep(index, next_loc,$("#repSelect"+index+" option:selected").text() ,$("#repSelect"+index+" option:selected").val(), $("#repComment"+index).val());
                                        }
                                        // Remove rep elements
                                        hideRepElements(postMessage,index);
                                    }
                                });
                            }
                            // Post button already exists
                            else
                                $(postMessage).find("#repPost"+index).remove();
                        } // no errors
                    }// success
                }); // ajax
            }); // Rep Button onClick
        } // else
    }); // each post
} // url is thread or pm
// UserCP
else{
    // Build rep stack table
    buildStackTable();
}

// remove entry from cookie
function removeEntry(stackIndex){
    // Stackd array
    var stackdRep = document.cookie.replace(/(?:(?:^|.*;\s*)RepStackCookie\s*\=\s*([^;]*).*$)|^.*$/, "$1").split('|||');
    // Precaution incase they delete cookie - should never run
    if (document.cookie.replace(/(?:(?:^|.*;\s*)RepStackCookie\s*\=\s*([^;]*).*$)|^.*$/, "$1") === undefined)
        window.alert("No reps stackd.");

    var newStackString = "";
    // Loop each stackd rep from cookie
    for (i = 0; i < stackdRep.length-1;i++){
        // Don't add selected index
        if(i != stackIndex){
            newStackString = newStackString + stackdRep[i] + "|||";
        }
    }
    // Add stackString back to cookie
    document.cookie = 'RepStackCookie=' +  newStackString;
    // Remove Entry
    $("#repStackTable").remove();
    // Rebuild table
    buildStackTable();
}

function buildStackTable(){
    // IP Table
    var ipTable = $("strong:contains('IP Login History')").parent().parent().parent().parent();
    // Insert table w/tbody before IP Table
    ipTable.before(($("<table>").attr('id', 'repStackTable').attr('border', 0).attr('cellspacing', 1)
                    .attr('cellpadding',4).attr('colspan',6).addClass('tborder')).append('<tbody>').attr('colspan',6));
    // Insert thead (title, thread hyperlink)
    $('#repStackTable').append($('<tr>').append($('<td>').addClass('thead').attr('colspan',6).append($('<strong>').text('Rep Stack'))
                                                .append($('<a>').attr('href','https://hackforums.net/showthread.php?tid=5498344')
                                                        .append($('<strong>').text('Quick Rep Userscript').addClass('float_right')))));
    // Spacing after table
    $('#repStackTable').after($('<br>'));
    // Precaution incase they delete cookie
    if (document.cookie.replace(/(?:(?:^|.*;\s*)RepStackCookie\s*\=\s*([^;]*).*$)|^.*$/, "$1") === undefined)
        document.cookie = 'RepStackCookie=';
    // Array of stack'd reps
    var stackdRep = document.cookie.replace(/(?:(?:^|.*;\s*)RepStackCookie\s*\=\s*([^;]*).*$)|^.*$/, "$1").split('|||');
    var infoString = stackdRep.length > 1 ? "These are the reps you have stackd ("+(stackdRep.length-1)+")." : "No reps stackd.";
    // Info row
    $('#repStackTable').append($('<tr>').append($('<td>').attr('colspan',6).addClass('tcat smalltext').append(infoString)));
    // Header row
    $('#repStackTable').append($('<tr>')
                               .append($('<td>').append($('<strong>').text('User').addClass('smalltext')).addClass('tcat').attr('colspan',1).attr('align','center').attr('width','125'))
                               .append($('<td>').append($('<strong>').text('Amount').addClass('smalltext')).addClass('tcat').attr('colspan',1).attr('align','center').attr('width','75'))
                               .append($('<td>').append($('<strong>').text('Reasoning').addClass('smalltext')).addClass('tcat').attr('colspan',2).attr('align','center'))
                               .append($('<td>').append($('<strong>').text('Submit').addClass('smalltext')).addClass('tcat').attr('colspan',1).attr('align','center').attr('width','100'))
                               .append($('<td>').append($('<strong>').text('Remove').addClass('smalltext')).addClass('tcat').attr('colspan',1).attr('align','center').attr('width','100'))
                              );
    // Add cookie values
    stackdUID = new Array(stackdRep.length);
    stackdAmt = new Array(stackdRep.length);
    stackdReason = new Array(stackdRep.length);
    for (i = stackdRep.length-1; i > -1; i--){ 
        //replaced stack with stack
        //todo: 
        stackdUID[i] = stackdRep[i].split('||')[0];
        stackdAmt[i] = stackdRep[i].split('||')[2];
        stackdReason[i] = stackdRep[i].split('||')[3];
        // Each stack'd rep (snippet above basically)
        $('#repStackTable').append($('<tr>')
                                   .append($('<td>').addClass('tcat').attr('colspan',1).attr('align','center').attr('width','125').append($('<a>').text(stackdRep[i].split('||')[1]).attr("href","/member.php?action=profile&uid="+stackdRep[i].split('||')[0])))
                                   .append($('<td>').append(stackdRep[i].split('||')[2]).addClass('tcat').attr('colspan',1).attr('align','center').attr('width','75'))
                                   .append($('<td>').append(stackdRep[i].split('||')[3]).addClass('tcat').attr('colspan',2).attr('align','left'))
                                   .append($('<td>').append($('<button>').addClass('button').val(i).text('Rep').addClass('repStackAdd')).addClass('tcat').attr('colspan',1).attr('align','center').attr('width','100'))
                                   .append($('<td>').append($('<button>').addClass('button').val(i).text('Remove').addClass('repStackRemove')).addClass('tcat').attr('colspan',1).attr('align','center').attr('width','100'))
                                  );
    }
}

// Event listener for submit
$("button.repStackAdd").click(function(){
    submitRepQuest($(this).val());
});

// Event listener for remove
$("button.repStackRemove").click(function(){
    var confirm = window.confirm('Are you sure you want to remove this stackd rep?');
    if (confirm){
        removeEntry($(this).val());
    }
});

// $.Post Reputation call
function giveRep(index, loc, selectTxt, selectVal, reason){
    //window.alert(loc +','+selectTxt+','+selectVal+','+reason);
    $.post("/reputation.php",
           {
        "my_post_key": my_key,
        "action" : "do_add",
        "uid": my_uid,
        "pid": my_pid,
        "rid": my_rid,
        "reputation": selectVal,
        "comments": reason
    },
           function(data,status){
        // Success prompt- notification
        repComment = selectTxt + "\nRep Reasoning: "+ reason;
        notififyMe("Rep Added Successfully!",repComment, loc);
    });
}

// Hide elements
function hideRepElements(element,index){
    $(element).find("#repComment"+index).remove();
    $(element).find("#repSelect"+index).remove();
    $(element).find("#repPost"+index).remove();
}

// Notifications
function notififyMe(repTitle, repComment, repLink){
    if (Notification.permission !== "granted"){
        Notification.requestPermission().then(function() {
            if (Notification.permission !== "granted"){
                window.alert("Quick Rep Userscript: Please allow desktop notifications!");
            } else{
                notififyMe(repComment, repLink);
            }
        });
    }
    else {
        var notification = new Notification(repTitle, { //http://www.simpleimageresizer.com/_uploads/photos/9c5055c8/test_4_75.png
            icon: 'https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/Quick%20Rep/NotificationIcon.png',
            body: repComment,
        });

        notification.onclick = function () {
            window.location.href = repLink;
            notification.close();
        };
        setTimeout(function() { notification.close(); }, notificationTimeout);
    }
}

// Add button on UserCP
function submitRepQuest(index){
    $.ajax({
        url: "https://hackforums.net/reputation.php?action=add&uid="+stackdUID[index],
        cache: false,
        success: function(response) {
            // Post Key
            my_key = $(response).find('[name=my_post_key]').val();
            // UID
            my_uid = $(response).find('[name=uid]').val();
            // PID
            my_pid = $(response).find('[name=pid]').val();
            // RID
            my_rid = $(response).find('[name=rid]').val();
            // Check for errors
            // No errors
            var errorBlock = $(response).find("blockquote").html();
            var permError = "Permission Error: ";
            if (errorBlock === undefined){
                if (debug)
                    console.log("No permission errors!");
            }
            // Rep Limit
            else if (errorBlock.includes(repLimit)){
                window.alert(permError+repLimit);
                return;
            }
            // Self rep
            else if (errorBlock.includes(repSelf)){
                window.alert(permError + repSelfResp);
                return;
            }
            // Require Upgrade, Rep Disabled, Other?
            else {
                errorFound = true;
                window.alert(permError + errorBlock);
                return;
            }
            // No errors
            if (!errorFound){
                // Rep label logic
                var stackdAmtStr = "";
                if (stackdAmt[index].includes('-'))
                    stackdAmtStr = "Negative ("+stackdAmt[index]+")";
                if (stackdAmt[index] == "0")
                    stackdAmtStr = "Neutral (0)";
                else
                    stackdAmtStr = "Positive (+"+stackdAmt[index]+")";
                // Submit Rep
                giveRep(index, "https://hackforums.net/usercp.php", stackdAmtStr, stackdAmt[index], stackdReason[index]);
                // Remove element from cookie
                removeEntry(index);
            }
        }
    });// Ajax
}
