/**
 * Initilization UI 
 */
(function () {
    // variable for storing quiz
    var quiz;

    // variable for store multiple choice
    var answers = [];

    // variable to handling and display question
    var quizPos = 0;

    // get the quiz from quiz.json by AJAX 
    quiz = get_data().soal; // array soal

    // click event
    document.addEventListener('click', function(evtObj) {
        var target = "";

        // check for class and id availability
        if (evtObj.target.className) {
            target = evtObj.target.className;
        } else if (evtObj.target.id) {
            target = evtObj.target.id;
        }

        // go to handling click function
        handleClick(target, evtObj);
    });

    function handleClick(elementTarget, evt) {
        console.log('click event');
        console.log(elementTarget);
    
        if (elementTarget == 'btn-start' || elementTarget == 'btnStart') {
            // display none to opening container
            document.getElementById('opening').style.display = 'none';

            // display question container
            document.getElementById('question').style.display = 'block';

            // display quiz
            displayQuestion(quizPos, quiz);

        } else if (elementTarget == 'btn-next') {
            // get to next question
            quizPos = quizPos + 1;

            // clear quiz container children
            prepareQuizContainer();

            // display quiz
            displayQuestion(quizPos, quiz);

        } else if (elementTarget == 'btn-prev') {
            // get to next question
            quizPos = quizPos - 1;

            // clear quiz container children
            prepareQuizContainer();

            // display quiz
            displayQuestion(quizPos, quiz, answers);
        } else if (elementTarget == 'answer') {
            // handle the answer
            answerResult = handleAnswer(evt, quizPos);

            // store the answer 
            answers[quizPos] = answerResult;

            console.log(answers)
        } else if (elementTarget == 'btn-finish') {
            // hide the quiz container and display finish section
            document.getElementById('question').style.display = 'none';

            // display finish section
            document.getElementById('finish').style.display = 'block';

        } else if (elementTarget == 'btn-proceed') {
            // hide the finish section
            document.getElementById('finish').style.display = 'none';

            // display the score of quiz
            document.getElementById('score').style.display = 'block';

            // calculate the score
            calculateScore(answers, quiz);
        } else if (elementTarget == 'btn-restart') {

            // clear the answers and restart the quiz position
            answer = [];
            quizPos = 0;
            // restart from the begining
            restart();
            
        } else {
            console.log('Not supported yet');
        }
    }

})()

/**
 * function for handling question
 */
function displayQuestion(quizPos, quiz, answers) {
    var quizCont = document.getElementById('question');
    var soal;

    try {
        soal = quiz[quizPos];

        // create P tag
        var objP = document.createElement('P');
        objP.appendChild(document.createTextNode(soal.nomor + '. ' + soal.soal));
        
        var objHR = document.createElement('HR');

        // Create div element as parent with class option-group
        var parentDIV = document.createElement('DIV');
        parentDIV.className = 'option-group';

        for (var i = 0; i < soal.option.length; i++) {
            // create label
            var objLabel = document.createElement('LABEL');
            objLabel.className = 'answer';

            // create span 
            var objSpan = document.createElement('SPAN');
            objSpan.className = 'rounded';

            // append to label as child
            objLabel.appendChild(objSpan);
            objLabel.appendChild(document.createTextNode(soal.option[i]));

            // append to parent DIV with option-group class as child
            parentDIV.appendChild(objLabel);
        }

        // get quiz container
        var quizCont = document.getElementById('question');
        quizCont.appendChild(objP);
        quizCont.appendChild(objHR);
        quizCont.appendChild(parentDIV);
        quizCont.appendChild(objHR);

        // add button to question container
        addButton(quizCont, quizPos, quiz.length);

        // check if the question has been answered
        if (answers !== undefined) {
            displayTheAnswer(quiz, quizPos, answers);
        }

    } catch (err) {
        console.log("Error: " + err);
        console.log("Stackrace: " + err.stack);
    }
}

/**
 * function for adding button in question 
 */
function addButton(quizCont, quizPos, length) {
    // build button group div
    var objDivButton = document.createElement('DIV');
    objDivButton.className = 'btn-group-1';

    if (quizPos == 0) {
        var objNextBtn = document.createElement('BUTTON');
        objNextBtn.className = "btn-next";
        objNextBtn.id = "btnNext";
        objNextBtn.innerHTML = 'Next';

        // append buttons to button group div
        objDivButton.appendChild(objNextBtn);

    } else if (quizPos == length - 1) {
        var objPrevBtn = document.createElement('BUTTON');
        var objFinishBtn = document.createElement('BUTTON');

        objPrevBtn.className = "btn-prev";
        objPrevBtn.id = "btnPrev";
        objPrevBtn.innerHTML = 'Previous';

        objFinishBtn.className = "btn-finish";
        objFinishBtn.id = "btnFinish";
        objFinishBtn.innerHTML = 'Finish';

        // append buttons to button group div
        objDivButton.appendChild(objPrevBtn);
        objDivButton.appendChild(objFinishBtn);

    } else {
        var objPrevBtn = document.createElement('BUTTON');
        var objNextBtn = document.createElement('BUTTON');

        objPrevBtn.className = "btn-prev";
        objPrevBtn.id = "btnPrev";
        objPrevBtn.innerHTML = 'Previous';

        objNextBtn.className = "btn-next";
        objNextBtn.id = "btnNext";
        objNextBtn.innerHTML = 'Next';

        // append buttons to button group div
        objDivButton.appendChild(objPrevBtn);
        objDivButton.appendChild(objNextBtn);
    }

    // append button group div to quiz container
    quizCont.appendChild(objDivButton);
}

/**
 * Answer handling
 */
function handleAnswer(eventTarget, quizPos) {
    var objOptionAnswer = document.getElementsByClassName('answer');

    // turn off all rounded circle
    var x = 0;
    while (x < objOptionAnswer.length) {
        //console.log(tmpObj);
        var objOption = objOptionAnswer[x];
        objOption.children[0].className = 'rounded';
        x++;
    }

    eventTarget.target.children[0].className = 'rounded round-fill';

    result = {
        'nomor': quizPos + 1,
        'answer': eventTarget.target.innerText
    };

    return result;
}

/**
 * Function for clearing quiz container content for the next/prev question
 */
function prepareQuizContainer() {
    var objQuizContainer = document.getElementById('question');

    console.log(objQuizContainer.children);

    while (objQuizContainer.hasChildNodes()) {
        objQuizContainer.removeChild(objQuizContainer.childNodes[0]);
    }
}

/**
 * Function for calculate the score 
 */
function calculateScore(answer, quiz) {
    var quizLength = quiz.length;
    var i = 0;
    var total = 0;
    var status = "";
    var classColorSetting = "";

    while (i < quizLength) {
        if (answer[i].answer == quiz[i].answer) {
            total += quiz[i].score;
        }
        i++;
    }

    if (total >= 60) {
        status = "Well done it!";
        classColorSetting = "points-green";
    } else {
        status = "Not good. Better luck next time.";
        classColorSetting = "points-red";
    }

    // display score
    document.getElementById('points').innerHTML = total;
    document.getElementById('points').className = classColorSetting;
    // display status
    document.getElementById('points-stat').innerHTML = status;
}

/**
 * Function for restart the question
 */
function restart() {
    // close the score section
    document.getElementById('score').style.display = 'none';
    // display opening of quiz
    document.getElementById('opening').style.display = "block";
    // clear the quiz container
    prepareQuizContainer();
}

/** 
 * Function for display the question answers
 */
function displayTheAnswer(quiz, quizPos, answers) {
    var options = quiz[quizPos].option;
    var ans = answers[quizPos].answer;
    var ansPos = 0;

    for (var i = 0; i < options.length; i++) {
        if (option[i] == ans) {
            ansPos = i;
            break;
        }
    }

    document.getElementsByClassName('answer')[ansPos].className = 'rounded round-fill';

}