// ==UserScript==
// @name       Quick Rep
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.2.1
// @description Makes giving reputation on HF easier.
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://hackforums.net/showthread.php?tid=*
// @match      *://hackforums.net/private.php?action=read&pmid=*
// @copyright  2016+
// @updateURL https://github.com/xadamxk/HF-Userscripts/raw/master/Quick%20Rep/Quick%20Rep.user.js
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
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
// Rep queue compat?
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
// Debug: Show console.log statements for debugging purposes
var debug = false; // (Default: false)
// ------------------------------ ON PAGE LOAD ------------------------------
// Global Vars
var uidArray = [];
var my_key;
var my_uid;
var my_pid;
var my_rid;
var my_repOptions;
var my_comments;
var repIndex;
var ajaxSuccess = false;
var errorFound = false;
var repComment;
var repLink;

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
                    else if (errorBlock.includes("You have already given as many reputation ratings as you are allowed to for today")){
                        // Rep Queue logic
                        //      Remove errorFound & return, add new var that lets it run until the $.Post event, then put info in queue.
                        errorFound = true;
                        window.alert(permError + errorBlock);
                        return;
                    }
                    // Self rep
                    else if (errorBlock.includes("You cannot add to your own reputation")){
                        errorFound = true;
                        window.alert(permError + "You can't rep yourself dumb dumb :P");
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
                                // Rep comment is empty - use appropriate default
                                if ($("#repComment"+index).val().length === 0){
                                    $.post("/reputation.php",
                                           {
                                        "my_post_key": my_key,
                                        "action" : "do_add",
                                        "uid": my_uid,
                                        "pid": my_pid,
                                        "rid": my_rid,
                                        "reputation": $("#repSelect"+index).val(),
                                        "comments": default_comment
                                    },
                                           function(data,status){
                                        // Success prompt
                                        // Notification
                                        repLink = next_loc;
                                        repComment = $("#repSelect"+index+" option:selected").text() + "\nRep Reasoning: "+ default_comment;
                                        notififyMe(repComment, repLink);
                                        // Remove rep elements
                                        $("#repButton"+index).trigger("click");
                                    });
                                }
                                // Custom comment but too short
                                else if ($("#repComment"+index).val().length < 11)
                                    window.alert("Rep comments must be atleast 10 chars.");

                                // Input over 10 chars
                                else{
                                    $.post("/reputation.php",
                                           {
                                        "my_post_key": my_key,
                                        "action" : "do_add",
                                        "uid": my_uid,
                                        "pid": my_pid,
                                        "rid": my_rid,
                                        "reputation": $("#repSelect"+index).val(),
                                        "comments": $("#repComment"+index).val()
                                    },
                                           function(data,status){
                                        // Success prompt
                                        // Notification
                                        repLink = next_loc;
                                        repComment = $("#repSelect"+index+" option:selected").text() + "\nRep Reasoning: "+ $("#repComment"+index).val();
                                        notififyMe(repComment, repLink);
                                        // Remove rep elements
                                        $("#repButton"+index).trigger("click");
                                    });
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

function notififyMe(repComment, repLink){
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
        var notification = new Notification('Rep Added Successfully!', { //http://www.simpleimageresizer.com/_uploads/photos/9c5055c8/test_4_75.png
            icon: 'https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/Quick%20Rep/NotificationIcon.png',
            body: repComment,
        });

        notification.onclick = function () {
            window.location = repLink;
            window.location.reload();
        };
        setTimeout(function() { notification.close(); }, notificationTimeout);
    }
}