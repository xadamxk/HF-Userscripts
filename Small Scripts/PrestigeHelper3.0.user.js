// ==UserScript==
// @name            Prestige Helper 3.0
// @namespace       Xerotic
// @description     Tools to help calculate prestige. Updated by Adam
// @require         http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @include         *hackforums.net/member.php?action=profile&uid=*
// @version         3.0
// ==/UserScript==

var repCoeff = 18.2;
var postCoeff = 50.4;
var threadCoeff = 12.6;
var timeCoeff = 97000;
var awardCoeff = 20.5;

var $table = $("table.tborder:contains(Forum Info)")
// Posts
var $table_posts = $table.find("td:contains(posts per day)")
var posts_data =  parseInt($table_posts.html().split('(')[0].replace(',','')) / postCoeff;
// Threads
var $table_threads = $table.find("td:contains(threads per day)")
var threads_data = parseInt($table_threads.html().split('(')[0].replace(',','')) / threadCoeff;
// Rep
var $table_rep = $table.find("strong[class^='reputation_']")
var rep_data =  parseInt($table_rep.html().replace(",", "")) / repCoeff;
// Awards
var $table_awards = $table.find("tr:contains(Awards) td:nth-child(2)").children().first()
var awards_data = parseInt($table_awards.html()) * awardCoeff;
// Prestige
var $table_prestige = $table.find("tr:contains(Prestige) td:nth-child(2)")
// Online Time
online_time = 0
var $table_time = $table.find("tr:contains(Time Spent Online) td:nth-child(2)")
var time_data = $table_time.html().split(", ")
time_data.forEach(function(e, i) {
  var temp_arr = e.split(" ")
  var temp_time = parseInt(temp_arr[0])
  switch(temp_arr[1]) {
    case "Year":
    case "Years":
      temp_time = temp_time * 365*24*60*60
      break
    case "Month":
    case "Months":
      temp_time = temp_time * 31*24*60*60
      break
    case "Week":
    case "Weeks":
      temp_time = temp_time * 7*24*60*60
      break
    case "Day":
    case "Days":
      temp_time = temp_time * 24*60*60
      break
    case "Hour":
    case "Hours":
      temp_time = temp_time * 60*60
      break
    case "Minute":
    case "Minutes":
      temp_time = temp_time * 60
      break
    case "Second":
    case "Seconds":
      temp_time = temp_time * 1
      break
  }
  online_time += temp_time
})
var time_data = online_time/timeCoeff;
// Append Values
$table_time.append("  (" + online_time + " seconds) <span class='smalltext' style='color:gold'>" + time_data + "</span>")
$table_posts.append("  <span class='smalltext' style='color:gold'>" + posts_data + "</span>")
$table_threads.append("  <span class='smalltext' style='color:gold'>" + threads_data + "</span>")
$table_rep.parent().append("  <span class='smalltext' style='color:gold'>" + rep_data + "</span>")
$table_awards.parent().append("  <span class='smalltext' style='color:gold'>" + awards_data + "</span>")
// Total
$table_prestige.append("  <span class='smalltext' style='color:gold'>" + (time_data + posts_data + threads_data + rep_data + awards_data) + "</span>")
