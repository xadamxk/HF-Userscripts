// ==UserScript==
// @name       JimBotBulkCreateNewPersons
// @author xadamxk
// @namespace  ya boy adam
// @version    1.0.0
// @description  Makes a bunch of accounts using a csv file
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://jimbotcentral.com:8080/gatekeeper*
// @match      *://jimbotcentral.com:8080/gatekeeper/*
// @copyright  2017+
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 1.0.0: Initial release
// ------------------------------ Dev Notes -----------------------------
// Go to http://jimbotcentral.com:8080/gatekeeper
// Upload the CSV at the bottom of the page
// ------------------------------ SETTINGS ------------------------------
// ------------------------------ Page Load -----------------------------

window.onload = function () {
    $("body").after('<input type="file" name="instance" id="instance">');
    document.getElementById('instance').onchange = function () {

        let file = this.files[0];
        let reader = new FileReader();

        reader.onload = function (progressEvent) {
            //Read file by lines
            let lines = this.result.split('\n');

            // Instantiate arrays (arrays of each column)
            let emailArray = [];//0
            let passwordArray = [];//1
            let fNameArray = [];//2
            let lNameArray = [];//3
            let phoneArray = [];//4
            let aliasArray = [];//5
            let bDayArray = [];//6

            // Loop through CVS for each line
            // Copy values to arrays above
            for (let line = 0; line < lines.length; line++) {
                let values = lines[line].split(',');
                emailArray.push(values[0]);
                passwordArray.push(values[1]);
                fNameArray.push(values[2]);
                lNameArray.push(values[3]);
                phoneArray.push(values[4]);
                aliasArray.push(values[5]);
                bDayArray.push(values[6]);
            }

            // Loop through number of entries
            // Turn arrays into JSON object
            // POST json obj to API
            for (let line = 0; line < bDayArray.length; line++) {
                let newPerson = {
                    'email': emailArray[line],
                    'password': passwordArray[line],
                    'firstName': fNameArray[line],
                    'lastName': lNameArray[line],
                    'phone': phoneArray[line],
                    'alias': aliasArray[line],
                    'birthday': bDayArray[line],
                };
                // Debug
                console.log(newPerson);

                // Post request
                $.post("http://jimbotcentral.com:8080/gatekeeper/rest/v1/persons/new", function (newPerson, status) {
                    // Result
                    console.log(status);
                });
            }
        };
        reader.readAsText(file);
    };
};