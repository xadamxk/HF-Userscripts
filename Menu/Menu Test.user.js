// ==UserScript==
// @name       Menu Test
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.5
// @description  Add's button to page
// @require https://code.jquery.com/jquery-3.1.1.js
// @require https://raw.githubusercontent.com/xadamxk/myUserJS-API/master/jMod/jmod.js
// @match      *://hackforums.net/usercp.php*
// @copyright  2016+
// @updateURL 
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// EXAMPLE: http://myuserjs.org/API/Demo/settings.html
// ==/UserScript==
// 'onBeforeClose': tOnBeforeCloseCB, // Optional
// 'onAfterClose': tOnAfterCloseCB // Optional

$("strong:contains('Menu')").append($("<button>").text("Settings").attr("id", "scriptMenuButton").addClass("button").css("margin-left", "20px"));
$( "#scriptMenuButton" ).click(function showMenu(){
    // BEGINNING OF SETTINGS
    var SettingsTest = function(){

        var SettingOptions = {
            title: 'xScript Settings',
            settings: [
                {
                    name: 'HFNN_SectionFID',
                    description: 'Section/ FID',
                    tooltip: {
                        innerHTML: 'Forum ID to Search (#s only)',
                        placement: 'top'
                    },
                    icon: {
                        name: 'fa-newspaper-o',
                        tooltip: {
                            innerHTML: '(Default:162)',
                            placement: 'left'
                        }
                    },
                    tab: 'HF News Notifier',
                    section: 'HF News Notifier Settings',
                    type: 'input',
                    'default': jMod.Settings.get('HFNN_SectionFID'),
                },
                {
                    name: 'HFNN_PreviewImage',
                    tab: 'HF News Notifier',
                    section: 'HF News Notifier Settings',
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
                    ]
                },
                {
                    name: 'HFNN_TitleFilterToggle',
                    description: 'Title Filter',
                    options: {
                        'TRUE': {
                            label: 'Filter unread thread results by keyword',
                            on: 'ON',
                            off: 'OFF',
                        },
                    },
                    tab: 'HF News Notifier',
                    section: 'HF News Notifier Settings',
                    type: 'toggle',
                    'default': jMod.Settings.get('HFNN_TitleFilterToggle'),
                },
                {
                    name: 'HFNN_FilterString',
                    description: 'Filter String(s)',
                    tooltip: {
                        innerHTML: 'Seperate keywords by commas example: PP,BTC',
                        placement: 'top'
                    },
                    icon: {
                        name: 'fa-filter',
                        tooltip: {
                            innerHTML: '(Default:Edition)',
                            placement: 'left'
                        }
                    },
                    tab: 'HF News Notifier',
                    section: 'HF News Notifier Settings',
                    type: 'input',
                    'default': jMod.Settings.get('HFNN_FilterString'),
                },
                {
                    name: 'HFNN_DebugConsoleToggle',
                    description: 'Debug Toggle',
                    options: {
                        'TRUE': {
                            label: ' Show console.log statements for debugging purposes',
                            on: 'ON',
                            off: 'OFF',
                        },
                    },
                    tab: 'HF News Notifier',
                    section: 'HF News Notifier Settings',
                    type: 'toggle',
                    'default': jMod.Settings.get('HFNN_TitleFilterBool'),
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
                console.log('Section URL: ', jMod.Settings.get('Section FID'));
                console.log('Title Filter: ', jMod.Settings.get('TitleFilterBool'));
                console.log('Filter Strings:', jMod.Settings.get('Filter String'));
                console.log('Debug: ', jMod.Settings.get('Debug Console Toggle'));
            }
        };
        // Load JSON into settings
        jMod.Settings(SettingOptions);
        // ?
        //jMod.API.addGlyphicons();


        setTimeout(function(){
            // Show menuthe settings dialog
            console.log('Show jMod Settings');
            jMod.Settings.show();
        },100);
    };

    // ?
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
});


