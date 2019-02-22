// this is closure
function get_data() {
    // variable for storing json data
    var quizData = "";

    // invoke the asynx ajax call to json file
    quizData = getJSONData();

    // display the result: debugging result
    console.log(quizData);

    return quizData;
}

function getJSONData() {
    // Variable to store result from Ajax process
    var data = "";

    // create Ajax variable
    var xmlHttp = new XMLHttpRequest();
            
    // set the MIME
    xmlHttp.overrideMimeType('application/json');

    // open the connection
    xmlHttp.open('GET', 'quiz.json', false);

    // set function for readystatechange event
    xmlHttp.onreadystatechange = function(response) {
        if (xmlHttp.readyState == 4 && xmlHttp.status == '200') {
            // Parse the json data
            var data_json = response.currentTarget.responseText;
            data = JSON.parse(data_json);
        }
    }

    // send the request
    xmlHttp.send();

    // return the result
    return data;
}