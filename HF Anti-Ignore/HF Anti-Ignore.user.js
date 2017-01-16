// ==UserScript==
// @name       HF Anti-Ignore
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.5
// @description Counteracts HF's ignore feature.
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://hackforums.net/member.php?action=profile&uid=*
// @copyright  2016+
// @updateURL https://github.com/xadamxk/HF-Userscripts/raw/master/HF%20Anti-Ignore/HF%20Anti-Ignore.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/raw/master/HF%20Anti-Ignore/HF%20Anti-Ignore.user.js
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 1.0.5: Removed 'Global Ignore' description
// version 1.0.4: Added [Rate] to Reputation
// version 1.0.3: Added posts per day and percent of total posts
// version 1.0.2: Fixed ASCII char bug
// version 1.0.1: Public Release
// version 1.0.0: Beta Release
// ------------------------------ Dev Notes -----------------------------
// 'Global Ignore' has been removed: https://hackforums.net/showthread.php?tid=5522733&pid=53823545#pid53823545
// ------------------------------ SETTINGS ------------------------------
var debug = false;
var totalPosts = 53790000;
// ------------------------------ Page Load -----------------------------
$( "table" ).each(function( index ) {
    if ($(this).find(".smalltext strong").text() == "Ignore Error"){
        var uid = window.location.href .replace( /[^0-9]/g, '');
        var username = $(this).find("tbody tr:eq(1) td").text();
        username = username.substring(username.lastIndexOf("The member ")+11,username.lastIndexOf(" has"));
        // Append table
        $(".quick_keys").append("<br>").append($("<table>").css("width","50%").css("margin-right","auto").css("margin-left","0px").attr('id', 'antiIgnore').attr('border', 0).attr('cellspacing', 1)
                                               .attr('cellpadding',4).attr('colspan',6).addClass('tborder')).append('<tbody>').attr('colspan',6);
        // Insert thead (title, thread hyperlink)
        $('#antiIgnore').append($('<tr>').append($('<td>').addClass('thead').attr('colspan',2).append($('<strong>').text("Loading "+username+"'s Forum Info ..."))
                                                 .append($('<a>').attr('href','https://hackforums.net/showthread.php?tid=5515646')
                                                         .append($('<strong>').text('Anti-Ignore Userscript').addClass('float_right')))));
        var errorTable = $(this);
        $.ajax({
            method: "POST",
            url: "https://hackforums.net/memberlist.php",
            data: {
                username: username,
                website: "",
                sort: "username",
                order: "descending",
                submit: "Search"
            }})
            .done(function( msg ) {
            // Turn result into DOM element rather than array of elements
            var searchResult = $('<div>').append(msg);
            // Grab values from results
            var resultTables = $(searchResult).find("table");
            // Member stats from search page
            var userAvatar = "";
            var userUsergroup = "";
            var userUsertitle = "";
            var userUserbar = "";
            var userUserstar = 0;
            var userUserstarURL = "";
            var userJoinDate = "";
            var userLastVisit = "";
            var userReputation = 0;
            var userRepColor = "";
            var userPostCount = 0;
            // Loop each table in results
            $(resultTables).each(function(resultIndex) {
                // We want the 'Member List' table
                if (($(this).find(".thead div:eq(1) strong").text()) === "Member List"){
                    // We want the user that matches the username (username -> a -> column -> row)
                    var desiredRow = $(resultTables[resultIndex]).find("span:contains("+username+")").parent().parent().parent();
                    userAvatar = $(desiredRow).find("td:eq(0) img").attr("src");
                    userUsergroup = $(desiredRow).find("td:eq(1) a:eq(0) span").attr("class");
                    userUsertitle = $(desiredRow).find("td:eq(1) .smalltext").text();
                    userUserbar = $(desiredRow).find("td:eq(1) .smalltext img").attr("src");
                    userUserstar = $(desiredRow).find(".userstars img").length;
                    userUserstarURL = $(desiredRow).find(".userstars img:eq(0)").attr("src");
                    userJoinDate = $(desiredRow).find("td:eq(2)").text();
                    userLastVisit = $(desiredRow).find("td:eq(3)").text();
                    userReputation = $(desiredRow).find("td:eq(4)").text();
                    if (userReputation > 0){
                        userRepColor = "reputation_positive";
                    }
                    else if (userReputation > 0){
                        userRepColor = "reputation_negative";
                    }
                    else {
                        userRepColor = "reputation_neutral";
                    }
                    userPostCount = $(desiredRow).find("td:eq(5)").text();
                    if (debug){
                        console.log("Avatar: "+userAvatar);
                        console.log("Usergroup: "+userUsergroup);
                        console.log("Avatar: "+userUsertitle);
                        console.log("Userbar: "+userUserbar);
                        console.log("Userstar: "+userUserstar);
                        console.log("UserstarURL: "+userUserstarURL);
                        console.log("Join Date: "+userJoinDate);
                        console.log("Last Visit: "+userLastVisit);
                        console.log("Reputation: "+userReputation);
                        console.log("Post Count: "+userPostCount);
                    }
                    //if ($(resultTables[resultIndex]).find() === username){}
                }
            });

            // Description table row
            //$('#antiIgnore').append($('<tr>').append($('<td>').attr('colspan',2).addClass('tcat smalltext').append("Description")));
            // Join Date
            $('#antiIgnore').append($('<tr>')
                                    .append($('<td>').append($('<strong>').text('Joined:')).addClass('tcat').attr('colspan',1).attr('align','left').css("font-size","14px").css("width","25%"))
                                    .append($('<td>').append(userJoinDate).addClass('tcat').attr('colspan',1).attr('align','left').css("font-size","14px").css("width","75%")));
            // Last Visit
            $('#antiIgnore').append($('<tr>')
                                    .append($('<td>').append($('<strong>').text('Last Visit:')).addClass('tcat').attr('colspan',1).attr('align','left').css("font-size","14px").css("width","25%"))
                                    .append($('<td>').append(userLastVisit).addClass('tcat').attr('colspan',1).attr('align','left').css("font-size","14px").css("width","75%")));
            // Total Post
            var joinDateShort = userJoinDate.replace(',','').split(/[,]/)[0];
            // Fix month format
            var dateArray = joinDateShort.split(' ');
            switch(dateArray[0]){
                case 'January': dateArray[0] = "01";
                    break;
                case 'February': dateArray[0] = "02";
                    break;
                case 'March': dateArray[0] = "03";
                    break;
                case 'April': dateArray[0] = "04";
                    break;
                case 'May': dateArray[0] = "05";
                    break;
                case 'June': dateArray[0] = "06";
                    break;
                case 'July': dateArray[0] = "07";
                    break;
                case 'August': dateArray[0] = "08";
                    break;
                case 'September': dateArray[0] = "09";
                    break;
                case 'October': dateArray[0] = "10";
                    break;
                case 'November': dateArray[0] = "11";
                    break;
                case 'December': dateArray[0] = "12";
                    break;
                default: dateArray[0] = "01";
            }
            joinDateShort = dateArray[0] + "/" + dateArray[1].replace(/\D/g,'') + "/" + dateArray[2];
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!

            var yyyy = today.getFullYear();
            if(dd<10)
                dd='0'+dd;
            if(mm<10)
                mm='0'+mm;
            today = dd+'/'+mm+'/'+yyyy;
            // Math for percentages of posts
            var totPosts = parseInt(userPostCount.replace(',',''));
            var profileAgeDays = parseInt(new Date(today) - new Date(joinDateShort))/ (1000 * 3600 * 24);
            var avgPostDay = Math.round((totPosts/profileAgeDays)*100)/100;
            // Percent of tot posts
            var percTot = Math.round(((totPosts/totalPosts)*100)*100)/100;
            if (debug){
                console.log("Total Posts: "+totPosts);
                console.log("Profile Age (Days): "+profileAgeDays);
                console.log("Avg Posts/Day: "+avgPostDay);
                console.log("Percent of Total Posts: "+percTot/100);
            }
            $('#antiIgnore').append($('<tr>')
                                    .append($('<td>').append($('<strong>').text('Total Posts:')).addClass('tcat').attr('colspan',1).attr('align','left').css("font-size","14px").css("width","25%"))
                                    .append($('<td>').append(userPostCount).addClass('tcat').css("font-size","14px").append(" ("+avgPostDay+" posts per day | "+percTot+" percent of total posts").append($("<br>"))
                                            .append($("<span>").css("font-size","12px").attr('colspan',1).attr('align','left').css("width","75%")
                                                    .append("(")
                                                    .append($("<a>").attr("href","https://hackforums.net/search.php?action=finduserthreads&uid="+uid).text("Find All Threads"))
                                                    .append(" "+String.fromCharCode(8212)+" ")
                                                    .append($("<a>").attr("href","https://hackforums.net/search.php?action=finduser&uid="+uid).text("Find All Posts"))
                                                    .append(" "+String.fromCharCode(8212)+" ")
                                                    .append($("<a>").attr("href","https://hackforums.net/postactivity.php?uid="+uid).text("Post Activity"))
                                                    .append(")")
                                                   )));
            // Time Online
            $('#antiIgnore').append($('<tr>')
                                    .append($('<td>').append($('<strong>').text('Time Spent Online:')).addClass('tcat').attr('colspan',1).attr('align','left').css("font-size","14px").css("width","25%"))
                                    .append($('<td>').append('N/A').addClass('tcat').attr('colspan',1).attr('align','left').css("font-size","14px").css("width","75%")));
            // Reputation
            $('#antiIgnore').append($('<tr>')
                                    .append($('<td>').append($('<strong>').text('Reputation:')).addClass('tcat').attr('colspan',1).attr('align','left').css("font-size","14px").css("width","25%"))
                                    .append($('<td>').append($("<strong>").append(userReputation).addClass(userRepColor)).addClass('tcat').attr('colspan',1).attr('align','left').css("font-size","14px").css("width","75%")
                                            .append(" [")
                                            .append($("<a>").attr("href","https://hackforums.net/reputation.php?uid="+uid).text("Details"))
                                            .append("] [")
                                            .append($("<a>").attr("href","https://hackforums.net/repsgiven.php?uid="+uid).text("Given"))
                                            .append("] [")
                                            .append($("<a>").attr("href","https://hackforums.net/trustscan.php?uid="+uid).text("Trust Scan"))
                                            .append("] [")
                                            .append($("<a>").attr("href","https://hackforums.net/reputation.php?action=add&uid="+uid).text("Rate"))
                                            .append("]")
                                           ));
            // Prestige
            $('#antiIgnore').append($('<tr>')
                                    .append($('<td>').append($('<strong>').text('Prestige:')).addClass('tcat').attr('colspan',1).attr('align','left').css("font-size","14px").css("width","25%"))
                                    .append($('<td>').append('N/A').addClass('tcat').attr('colspan',1).attr('align','left').css("font-size","14px").css("width","75%")));
            // HF XMPP
            $('#antiIgnore').append($('<tr>')
                                    .append($('<td>').addClass('tcat').append($('<strong>')
                                                                              .append($("<a>").attr("href","https://hackforums.net/hfim.php").text('HF IM XMPP:'))
                                                                              .attr('colspan',1).attr('align','left').css("font-size","14px").css("width","25%")))
                                    .append($('<td>').append('N/A').addClass('tcat').attr('colspan',1).attr('align','left').css("font-size","14px").css("width","75%")
                                            .append(" [")
                                            .append($("<a>").attr("href","xmpp:"+uid+"@hackforums.im?roster;name="+uid).text("Add"))
                                            .append("] [")
                                            .append($("<a>").attr("href","https://hackforums.net/misc.php?action=verifysecret&uid="+uid).text("Verify"))
                                            .append("]")
                                           ));
            // Reported Posts
            $('#antiIgnore').append($('<tr>')
                                    .append($('<td>').append($('<strong>').text('Reported Posts:')).addClass('tcat').attr('colspan',1).attr('align','left').css("font-size","14px").css("width","25%"))
                                    .append($('<td>').append($("<span>").append('N/A').css("font-size","14px")).addClass('tcat').attr('colspan',1).attr('align','left').css("width","75%")
                                            .append(" [Latest: N/A]").css("font-size","10px")
                                           ));
            // Awards
            $('#antiIgnore').append($('<tr>')
                                    .append($('<td>').append($('<strong>').text('Awards:')).addClass('tcat').attr('colspan',1).attr('align','left').css("font-size","14px").css("width","25%"))
                                    .append($('<td>').append('N/A').addClass('tcat').attr('colspan',1).attr('align','left').css("font-size","14px").css("width","75%")
                                            .append(" [")
                                            .append($("<a>").attr("href","https://hackforums.net/myawards.php?uid="+uid).text("Details"))
                                            .append("]")
                                           ));
            // Warning Level
            $('#antiIgnore').append($('<tr>')
                                    .append($('<td>').append($('<strong>').text('Warning Level:')).addClass('tcat').attr('colspan',1).attr('align','left').css("font-size","14px").css("width","25%"))
                                    .append($('<td>').addClass('tcat').attr('colspan',1).attr('align','left').css("font-size","14px").css("width","75%")
                                            .append($("<a>").attr("href","https://hackforums.net/ub3rviewwarnings.php?uid="+uid).text("N/A").css("color","white"))
                                           ));
            // Show contact options if 'Universal Profile Ignore'
            if($(errorTable).find("tbody tr:eq(1) td").text().includes("Universal Profile Ignore")){
                // Append table
                $("#antiIgnore").after($("<br>").attr('id', 'antiIgnoreSpacer'));
                $("#antiIgnoreSpacer").after($("<table>").css("width","50%").css("margin-right","auto").css("margin-left","0px").attr('id', 'antiIgnoreContact').attr('border', 0).attr('cellspacing', 1)
                                             .attr('cellpadding',4).attr('colspan',2).addClass('tborder')).append('<tbody>').attr('colspan',2);
                // Insert thead (title, thread hyperlink)
                $('#antiIgnoreContact').append($('<tr>').append($('<td>').addClass('thead').attr('colspan',2).append($('<strong>').text(username+"'s Contact Details"))
                                                                .append($('<a>').attr('href','https://hackforums.net/showthread.php?tid=5515646')
                                                                        .append($('<strong>').text('Anti-Ignore Userscript').addClass('float_right')))));
                // Description table row
                //$('#antiIgnoreContact').append($('<tr>').append($('<td>').attr('colspan',2).addClass('tcat smalltext').append("Description")));
                // Join Date
                $('#antiIgnoreContact').append($('<tr>')
                                               .append($('<td>').append($('<strong>').text('Private Message:')).addClass('tcat').attr('colspan',1).attr('align','left').css("font-size","14px").css("width","25%"))
                                               .append($('<td>').append('').addClass('tcat').attr('colspan',1).attr('align','left').css("font-size","14px").css("width","75%")));
                //
                $('#antiIgnoreContact').append($('<tr>')
                                               .append($('<td>').append($('<strong>').text('Homepage:')).addClass('tcat').attr('colspan',1).attr('align','left').css("font-size","14px").css("width","25%"))
                                               .append($('<td>').addClass('tcat').attr('colspan',1).attr('align','left').css("font-size","14px").css("width","75%")
                                                       .append($("<a>").attr("href","https://hackforums.net/private.php?action=send&uid="+uid).text("Send "+username+" a private message."))));
            } // If universal ignore
            // Change Loading string
            $("#antiIgnore").find("strong:contains(Forum Info ...)").text(username+"'s Forum Info");
            // Generate userUserstarNew
            var userUserstarNew = "";
            for (i=0;i < userUserstar; i++)
                userUserstarNew = userUserstarNew + '<img src="'+userUserstarURL+'" border="0" alt="*">';
            // Append user table
            $("#antiIgnore").before($("<table>").css("width","100%").attr('id', 'antiIgnoreUser').attr('border', 0).attr('cellspacing', 0)
                                    .attr('cellpadding',0).append($('<tbody>').append($("<tr>")
                                                                                      .append($("<td>").addClass("trow1").css("width","75%").css("padding","4px")
                                                                                              .append($("<span>").addClass("largetext")
                                                                                                      .append($("<strong>")
                                                                                                              .append($("<span>").addClass(userUsergroup).text(username))
                                                                                                             )
                                                                                                     )
                                                                                              .append($("<br>"))
                                                                                              .append($("<span>").addClass("smalltext")
                                                                                                      .text(userUsertitle)
                                                                                                      .append($("<br>"))
                                                                                                      .append($("<img>").attr("src",userUserbar).attr("alt",userUsertitle).attr("title",userUsertitle))
                                                                                                      .append($("<br>"))
                                                                                                      .append(userUserstarNew)
                                                                                                      .append($("<br>"))
                                                                                                      .append($("<br>"))
                                                                                                      .append($("<strong>").text("Registration Date: ")).append(userJoinDate)
                                                                                                      .append($("<br>"))
                                                                                                      .append($("<strong>").text("Date of Birth: ")).append("N/A")
                                                                                                      .append($("<br>"))
                                                                                                      .append($("<strong>").text("Local Time: ")).append("N/A")
                                                                                                      .append($("<br>"))
                                                                                                      .append($("<strong>").text("Status: "))
                                                                                                      .append($("<a>").attr("href","https://hackforums.net/online.php").text("N/A"))
                                                                                                      .append($("<br>"))
                                                                                                      .append($("<strong>").text("Username Changes: "))
                                                                                                      .append($("<a>").attr("href","https://hackforums.net/misc.php?action=username_history&uhuid="+uid).text("(?)"))
                                                                                                     )
                                                                                             )
                                                                                      .append($("<td>").addClass("trow1").css("width","25%").css("align","right").css("valign","right")
                                                                                              .append($("<img>").attr("src",userAvatar).css("float","right").css("margin-right","4px"))
                                                                                             )
                                                                                     )
                                                                 )
                                   );
            $("#antiIgnoreUser").after($("<br>"));

        }); // AJAX complete
    } // If ignored
});
