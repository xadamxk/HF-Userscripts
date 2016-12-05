// ==UserScript==
// @name       Menu Test
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.4
// @description  Add's button to page
// @require https://code.jquery.com/jquery-3.1.1.js
// @require https://raw.githubusercontent.com/xadamxk/myUserJS-API/master/jMod/jmod.js
// @match      *://hackforums.net/usercp.php*
// @copyright  2016+
// @updateURL 
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// EXAMPLE: http://myuserjs.org/API/Demo/settings.html
// ==/UserScript==

$("strong:contains('Menu')").append($("<button>").text("Settings").attr("id", "scriptMenuButton").addClass("button").css("margin-left", "20px"));
$( "#scriptMenuButton" ).click(function showMenu(){
    console.log('jMod.Settings Found');
    // BEGINNING OF SETTINGS
    var SettingsTest = function(){
        console.log('jMod.Settings Test');

        var SettingOptions = {
            title: 'xScript Settings',
            settings: [
                {
                    name: 'Setting 1',
                    description: 'Section URL',
                    tooltip: {
                        innerHTML: 'Which section to search',
                        placement: 'top'
                    },
                    icon: {
                        name: 'fa-microphone',
                        tooltip: {
                            innerHTML: 'icon tooltip',
                            placement: 'right'
                        }
                    },
                    tab: 'HF News Notifier',
                    section: 'Settings',
                    type: 'input',
                    'default': 'https://hackforums.net/forumdisplay.php?fid=162'
                },
                {
                    name: 'Element 1',
                    tab: 'HF News Notifier',
                    section: 'Settings',
                    type: 'element',
                    innerHTML: [
                        'Image Example: ',
                        {
                            type: 'img',
                            attributes: {
                                src: "https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/HF%20News%20Notifier/HFNNCapture2.png",
                                height: "75px"
                            }
                        },
                        {
                            type: 'span',
                            className: 'glyphicon glyphicon-plus'
                        }
                    ]
                },
                {
                    name: 'Title Filter Toggle',
                    description: 'Title Filter',
                    options: {
                        'val1': {
                            label: 'Filter unread thread results by keyword',
                            on: 'ON',
                            off: 'OFF',
                            tooltip: {
                                innerHTML: 'Title Filter Search',
                                placement: 'left'
                            }
                        },
                    },
                    tab: 'HF News Notifier',
                    section: 'Settings',
                    type: 'toggle',
                    'default': 'val1'
                },
                {
                    name: '',
                    description: '',
                    tooltip: {
                        innerHTML: 'Seperate keywords by commas ex.PP,BTC',
                        placement: 'top'
                    },
                    tab: 'HF News Notifier',
                    section: 'Settings',
                    type: 'input',
                    'default': 'Edition',
                    depend: {
                        'Title Filter Toggle': ['val1']
                    }
                },
            ],
            tabs: [
                // (optional) Additional Custom tab
                {
                    name: 'About',
                    innerHTML: [
                        {
                            type: 'h1',
                            innerHTML: 'About'
                        },
                        {
                            type: 'p',
                            innerHTML: 'Coming Soon.'
                        }
                    ]
                },
                // (optional) Adding information about a tab referenced by a setting
            ],
            // (optional) Change the order of the tabs. Tabs left out will be added after in the order they are referenced by your settings
            tabOrder: ['About', 'HF News Notifier'],
            // (optional) Set the active tab
            activeTab: 'HF News Notifier',
            // (optional) callback that fires before the settings dialog closes
            onBeforeHide: function(e){
                // Save vals here?
                console.log('Settings on before hide');
            }
        };

        jMod.Settings(SettingOptions);


        setTimeout(function(){
            // Show the settings dialog
            console.log('Show jMod Settings');
            jMod.Settings.show();
            console.log('Setting 1 Value: ', jMod.Settings.get('Setting 1'));
            console.log('Setting 1 Default: ', jMod.Settings.getDefault('Setting 1'));
        },100);
    };
    jMod.API.addGlyphicons();

    jMod.onReady = SettingsTest;
    // Check & Remove Additional Tabs from prototype.js bug
    var filterArray = ['clear','clone','compact','detect','each','eachSlice','filter','first','flatten','forEach','grep','inGroupsOf','include',
                       'inject','inspect','intersect','invoke','last','max','min','partition','pluck','reject','reverse','size','sortBy','uniq','without','zip']; //29
    console.log("Prototype length: "+filterArray.length);
    var menuArray = $('.modal-body div ul li a').toArray();
    console.log("Menu Length: "+menuArray.length);

    for (i = 0; i < filterArray.length; i++){
        for (j = 0; j < menuArray.length; j++){
            // Check menu text for filter text
            if ($(menuArray[j]).text().includes(filterArray[i])){
                //console.log('removed :'+prototypeMethods[i]);
                $(menuArray[j]).parent().remove();
            }
        }
    }
    // TODO: Close button fix or temp reoad page fix
    //location.reload();
    //$("#scriptMenuButton").text("Reload Page").attr("#scriptMenuButton","#reloadPage");
    //$( "#reloadPage" ).click(function reloadPage(){
    //location.reload();
    //});
});


