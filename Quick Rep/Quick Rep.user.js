// ==UserScript==
// @name         Quick Rep
// @author       xadamxk
// @namespace    https://github.com/xadamxk/HF-Scripts
// @version      1.1.0
// @description  Makes giving reputation on HF easier.
// @require      https://code.jquery.com/jquery-3.1.1.js
// @match        *://hackforums.net/showthread.php?tid=*
// @copyright    2016+
// @updateURL    https://github.com/xadamxk/HF-Userscripts/raw/master/Quick%20Rep/Quick%20Rep.user.js
// @iconURL      https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource     MainCSS https://gist.githubusercontent.com/josefandersson/27da32a2f684e7e319537e42790e1061/raw/bdddc19b21d22c1f727e6638f5c35de17dba65ba/quick_rep.css
// ==/UserScript==


// SETTINGS
const _REP_BUTTON_LABEL = 'Rep';
const _BASIC_QUICK_REP  = false;
const _DEBUG            = true;

// VARIABLES
var uids = []; // key=element index, value=uid(Integer)

// Add CSS styling
GM_addStyle(GM_getResourceText('MainCSS'));


/* Create a reputation button on each post. When the reputation button is
   clicked, a form will be displayed. If the form already exists, the form will
   instead be removed. */
function createReputationButtons() {
    // Loop through every post on the page.
    $("#posts .tborder").each(( index, element ) => {
        var post = $( element );

        // Get the trustscan button. (We use it to get the uid of the poster.)
        let tsButton = post.find(".bitButton[title='Trust Scan']");
        uids[index] = parseInt(tsButton.attr("href").split("uid=")[1]);

        // Create the reputation button and add it to DOM.
        var repButton = createElement('a', { 'id':`repButton_${ index }`, 'href':'#', className:'bitButton', 'innerText':_REP_BUTTON_LABEL });
        tsButton.parent().append(repButton);

        // When the button is clicked, open the reputation form.
        $(repButton).on('click', e => { e.preventDefault(); openReputationForm( index, post, repButton ); });
    });
}


/* Toggle the reputation form for post. If the form already exists then remove
   it from existance, else, create it and add it to DOM. Note that fields will
   be shaded out and have no value until reputation data is fetched from the
   server. */
function toggleReputationForm( post_index, post, rep_button ) {
    var form = post.find('div.qr_pd');

    // If the form already exists we'll just delete it and be done with it.
    if (form.length > 0) { return form.remove(); }


    // Create the form.
    // Elements id's
    let cmt_id    = `repCmt_${ post_index }`;
    let rating_id = `rating_${ post_index }`;
    var rate_id   =   `rate_${ post_index }`;

    // This div will contain the inputs.
    let container = createElement('div', { 'className':'qr_pd' });

    // To put the label and inputs on different lines we'll put them in different paragraphs.
    let label_container = createElement('p', { 'className':'qr_pc' }, container);
    let input_container = createElement('p', { 'className':'qr_pc' }, container);
    let selec_container = createElement('p', { 'className':'qr_pc' }, container);

    // Create the comment input field.
              createElement('label', { 'htmlFor':cmt_id, 'innerText':'Your comments on this user:', 'className':'smalltext qr_lbl' }, label_container);
    var inp = createElement('input', { 'id'     :cmt_id, 'disabled' :true, 'className':'qr_inp'                                    }, input_container);

    // Create the span where the result of requests will be put.
    var res = createElement('span', { 'className':'qr_re', 'innerText':' ' }, label_container);

    // Create the rating select element.
    var select = createElement('select', { 'id':rating_id, 'className':'button qr_sel', 'disabled':true }, selec_container);

    // Create the 'add rating' button.
    var btn = createElement('button', { 'className':'button qr_btn', 'innerText':'Add rating', 'id':rate_id, 'disabled':true }, selec_container);

    // Add the elements to DOM.
    form = $( container );
    form.insertAfter(rep_button);

    // Get reputation data from server.
    getReputationWindow( post_index, my => {
        // Check for errors.
        if (my.error) {
            form.remove(); // Remove the form...
            return window.alert(my.error);
        }

        // Make the inputs and button interactable so that we can change their values.
        inp.disabled = false; select.disabled = false; btn.disabled = false;

        // The rating options.
        $(my.rep_options).each(( subindex, subelement ) => {
            createElement('option', { 'value':subelement.value, 'innerText':subelement.innerText }, select); });

        // Set the values of the input fields.
        inp.value            = my.comments;
        select.selectedIndex = my.rep_index;

        // When the 'add rating' button is clicked.
        $('body').on('click', `#${ rate_id }`, e => {
            e.preventDefault();

            // Disabled all the fields while we wait for a response.
            inp.disabled = true; select.disabled = true; btn.disabled = true;

            // The link to this post.
            var post_url = 'https://hackforums.net/' + post.find("strong a:eq(0)").attr('href');

            // The POST data to be sent.
            var data = { my_post_key:my.key, action:'do_add', uid:my.uid, pid:my.pid, rid:my.rid, reputation:select.value };

            // If the comment has a length of 0, then we'll just put a link to the post as the comment instead.
            if (inp.value.length === 0) { data.comments = post_url; }

            // A comment is not allowed to be shorter than 10 characters.
            else if (inp.value <= 10) {
                inp.disabled = false; select.disabled = false; btn.disabled = false;
                window.alert("Rep comments must be atleast 10 chars.");
            }

            // Send the custom comment.
            else { data.comments = inp.value; }

            $.post('/reputation.php', data, (d, s) => {
                // Enabled all the fields again.
                inp.disabled = false; select.disabled = false; btn.disabled = false;

                // Display the "updated!" text for 3.5 seconds.
                res.innerText = 'Updated!';
                setTimeout(() => { res.innerText = ' '; }, 3500);
            });
        });
    });

    return form;
}


/* Get the HTML for the reputation popup window from HF. This is used to fetch
   any previously given reputation to the author of the post and also if we've
   got permission to give the specific user a reputation or not. The fetched
   data is passed to callback. */
function getReputationWindow( post_index, callback ) {
    $.ajax({
        url: `https://hackforums.net/reputation.php?action=add&uid=${ uids[post_index] }`, cache: false,
        success: function(res) {
            var resp_jquery = $(res);

            // Something makes it <not possible> for us to give the reputation.
            // Check and see what the error is.
            if (resp_jquery.find("blockquote").html() !== undefined) {
                // The errors that can occur.
                var errors = {
                    'You have already given as many reputation ratings as you are allowed to for today':'You have already given as many reputation ratings as you are allowed to for today.',
                    'You do not have permission to give reputation ratings to users':'You do not have permission to give reputation ratings to users.',
                    'You cannot add to your own reputation':"You can't rep yourself dumb dumb :P",
                    'You cannot add a reputation to users of this user group':'You cannot add a reputation to users of this user group.'
                };

                // Loop through possible errors and alert it to the user if it occured.
                for (var err in errors)
                    if (resp_jquery.find('blockquote').html().includes(err))
                        return callback({ error:errors[err] }); // Pass error to callback.
            }

            // Grab data from reputation popup html and pass it to callback.
            let data = {
                key:         resp_jquery.find('[name=my_post_key]').val(),  uid:       resp_jquery.find('[name=uid]').val(),
                pid:         resp_jquery.find('[name=pid]').val(),          rid:       resp_jquery.find('[name=rid]').val(),
                comments:    resp_jquery.find('[name=comments]').val(),     rep_index: resp_jquery.find("#reputation :selected").index(),
                rep_options: resp_jquery.children(3).children().children().children().children().siblings(6).children().siblings(7),
            };

            // Pass data to callback.
            callback(data);
        }
    }).fail( e => { console.log('QUICK REP ERROR:', e); cb(false); });
}


/* Open the default HF reputation popup or create an input form for changing
   the poster's reputation. */
function openReputationForm( post_index, post, rep_button ) {
    // Open the default HF reputation popup.
    if (_BASIC_QUICK_REP) return MyBB.reputation( uids[index] );

    // Toggle the form.
    toggleReputationForm( post_index, post, rep_button );
}


// Custom function for creating elements easier.
function createElement(name, attributes, parent = null) {
    var element = document.createElement(name);
    for (var a in attributes) { element[a] = attributes[a]; }
    if (parent !== null && parent !== undefined && parent.appendChild) parent.appendChild(element);
    return element;
}

// Create the reputation buttons.
createReputationButtons();
