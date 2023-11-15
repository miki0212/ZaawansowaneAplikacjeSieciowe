import testData from "./data/test-data.js";
import { counterUserPoints, getQuestionLength, setAnswerArray, showCorrectAnswers, startCounter, stopCounter, totalTimeCounter } from "./helper.js";
import { localStoriageInitialize } from "./localStorageInitialize.js";
import { getLocalStorageItem, setLocalStorageItem } from "./localStorageItems/LocalStorageItems.js";
const titleNode = document.querySelector("#test-title");
const questionNode = document.querySelector("#question");
const answersNode = document.querySelector("#answers");
const backNode = document.querySelector("#back");
const nextNode = document.querySelector("#next");
const endNode = document.querySelector("#end");
const startNode = document.querySelector("#start");
const timeContainer = document.querySelector('#time-container');
const userData = document.querySelector('#user-data');
const userPointsContainer = document.querySelector('#user-result');
const userPoint = document.querySelector('.points');
const questionContainerNode = document.querySelector("#question-container");
const questionTimeNode = document.querySelector("#question-time");
const totalTimeNode = document.querySelector("#total-time");
const questionCounterNode = document.querySelector('#question-counter');
const usernameNode = document.querySelector('#username');
const usernameDiv = document.querySelector('#user-name');
const correctAnswerNode = document.querySelector('#correct-answers');
titleNode.innerHTML = testData.title;
let totalTime = 0;
let currentIntervalId = null;
const displayQuestion = () => {
    const currentIdx = parseInt(getLocalStorageItem('current-question-idx'));
    const currendRandomIndex = getLocalStorageItem('random-questions-index-array').split(',').map(Number)[currentIdx];
    const currentQuestion = JSON.parse(getLocalStorageItem('test-data')).questions[currendRandomIndex];
    const questionsLength = getQuestionLength();
    questionNode.innerHTML = currentQuestion.question;
    backNode.disabled = currentIdx === 0;
    nextNode.disabled = currentIdx === questionsLength - 1;
    displayAnswers(currentQuestion.answers);
    currentIntervalId = startCounter(currentIdx, currentIntervalId, questionTimeNode);
};
const displayAnswers = (answers) => {
    var _a;
    const currentIdx = parseInt(getLocalStorageItem("current-question-idx"));
    const currendRandomIndex = getLocalStorageItem('random-questions-index-array').split(',').map(Number)[currentIdx];
    let userAnswer = (_a = getLocalStorageItem('user-answers')) === null || _a === void 0 ? void 0 : _a.split(',')[currendRandomIndex];
    let answersMarkup = answers
        .map((answer) => {
        const isChecked = answer.content === userAnswer;
        return `
            <div ${isChecked ? 'class="selected radio-btn"' : 'class="radio-btn"'}>
                <input type="radio" name="answer" id="answer${answer.id}" value="${answer.content}" ${isChecked ? "checked" : ""} />
                <label class="answer-label" for="answer${answer.id}">${answer.content}</label>
            </div>
        `;
    })
        .join("");
    answersNode.innerHTML = answersMarkup;
    answersNode.querySelectorAll("input").forEach((inputElement) => {
        inputElement.addEventListener("click", () => {
            answersNode
                .querySelectorAll("div")
                .forEach((div) => div.classList.remove("selected"));
            inputElement.parentElement.classList.add("selected");
            const currendRandomIndex = getLocalStorageItem('random-questions-index-array').split(',').map(Number)[currentIdx];
            setAnswerArray(currendRandomIndex, inputElement.value.toString());
            updateEndButtonVisibility();
        });
    });
};
const checkAllAnswered = () => {
    return getLocalStorageItem('user-answers').split(',').every(answer => {
        return answer !== '';
    });
};
const bindHandlers = () => {
    //Ustawianie elementów na display none
    document.addEventListener("DOMContentLoaded", () => contetLoadedHandler());
    //Obsługa strzałek lewo-prawo
    document.addEventListener("keyup", (evt) => arrowHandler(evt));
    //Przyciski
    startNode.addEventListener("click", (evt) => startNodeHandler(evt));
    backNode.addEventListener("click", (evt) => backNodeHandler(evt));
    nextNode.addEventListener("click", (evt) => nextNodeHandler(evt));
    endNode.addEventListener("click", (evt) => endNodeHandler(evt));
};
bindHandlers();
//Handlers
const contetLoadedHandler = () => {
    // localStoriageInitialize();
    localStorage.clear();
    questionContainerNode.style.display = "none";
    endNode.style.display = "none";
    backNode.style.display = "none";
    nextNode.style.display = "none";
    timeContainer.style.display = "none";
    userPointsContainer.style.display = 'none';
};
const arrowHandler = (evt) => {
    var _a, _b;
    if (questionContainerNode.style.display != "none") {
        evt.preventDefault();
        if (evt.code.toLocaleLowerCase() === "ArrowRight".toLocaleLowerCase()) {
            evt.stopImmediatePropagation();
            nextNode.dispatchEvent(new Event("click"));
        }
        else if (evt.code.toLocaleLowerCase() === "ArrowLeft".toLocaleLowerCase()) {
            evt.stopImmediatePropagation();
            backNode.dispatchEvent(new Event("click"));
        }
        if (evt.code.toLocaleLowerCase() === "Arrowup".toLocaleLowerCase()) {
            // const radioBTNArray : HTMLInputElement[] = document.querySelectorAll('input[type="radio"]') as HTMLInputElement;
            const radioBTNNodeList = document.querySelectorAll('input[type="radio"]');
            const radioBTNArray = Array.from(radioBTNNodeList);
            let idx = 0;
            for (let i = 0; i < 4; i++) {
                (_a = radioBTNArray[i].parentElement) === null || _a === void 0 ? void 0 : _a.classList.remove('selected');
                if (radioBTNArray[i].checked) {
                    idx = i;
                    break;
                }
                if (i === 3) {
                    idx = 0;
                }
            }
            if (idx === 0) {
                idx = 3;
            }
            else {
                idx--;
            }
            radioBTNArray[idx].checked = true;
            (_b = radioBTNArray[idx].parentElement) === null || _b === void 0 ? void 0 : _b.classList.add('selected');
            const currentIdx = parseInt(getLocalStorageItem('current-question-idx'));
            const currendRandomIndex = getLocalStorageItem('random-questions-index-array').split(',').map(Number)[currentIdx];
            setAnswerArray(currendRandomIndex, radioBTNArray[idx].value);
        }
    }
};
const startNodeHandler = (evt) => {
    localStorage.clear();
    //FIXME:
    if (usernameNode.value != '') {
        console.log(usernameNode.value);
        setLocalStorageItem('username', usernameNode.value);
    }
    //FIXME:
    if (getLocalStorageItem('username') != '') {
        totalTime = 0;
        currentIntervalId = 0;
        userPointsContainer.style.display = 'none';
        localStoriageInitialize(usernameNode.value || " ");
        questionCounterNode.innerHTML = `Pytanie 1 / ${getLocalStorageItem('question-length')}`;
        totalTimeCounter(totalTime, totalTimeNode);
        displayQuestion();
        questionContainerNode.style.display = "flex";
        backNode.style.display = "inline";
        nextNode.style.display = "inline";
        startNode.style.display = "none";
        timeContainer.style.display = "block";
        userData.style.display = 'none';
    }
};
const backNodeHandler = (evt) => {
    const currentIdx = parseInt(localStorage.getItem("current-question-idx"), 10);
    if (backNode.disabled) {
        return;
    }
    localStorage.setItem("current-question-idx", (currentIdx - 1).toString());
    questionCounterNode.innerHTML = `Pytanie ${currentIdx} / ${getLocalStorageItem('question-length')}`;
    displayQuestion();
};
const nextNodeHandler = (evt) => {
    const currentIdx = parseInt(localStorage.getItem("current-question-idx"), 10);
    if (nextNode.disabled) {
        return;
    }
    localStorage.setItem("current-question-idx", (currentIdx + 1).toString());
    questionCounterNode.innerHTML = `Pytanie ${currentIdx + 2} / ${getLocalStorageItem('question-length')}`;
    displayQuestion();
};
const endNodeHandler = (evt) => {
    stopCounter(currentIntervalId);
    stopCounter(totalTime);
    usernameDiv.innerHTML = getLocalStorageItem('username');
    questionContainerNode.style.display = "none";
    timeContainer.style.display = "none";
    //TODO :
    // if(endNode.style.display != 'none'){
    //   console.log('TEST')
    //   startNode.style.display = 'block'
    // }
    startNode.style.display = 'block';
    endNode.style.display = "none";
    userPointsContainer.style.display = 'flex';
    showCorrectAnswers(correctAnswerNode);
    userPoint.innerHTML = counterUserPoints();
};
const updateEndButtonVisibility = () => {
    endNode.style.display = checkAllAnswered() ? "inline" : "none";
    endNode.disabled = false;
};
