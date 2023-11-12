import testData from "./data/test-data.js";
import { counterUserPoints, getQuestionLength, setAnswerArray, startCounter, stopCounter, totalTimeCounter } from "./helper.js";
import { localStoriageInitialize } from "./localStorageInitialize.js";
import { getLocalStorageItem } from "./localStorageItems/LocalStorageItems.js";
const titleNode = document.querySelector("#test-title");
const questionNode = document.querySelector("#question");
const answersNode = document.querySelector("#answers");
const backNode = document.querySelector("#back");
const nextNode = document.querySelector("#next");
const endNode = document.querySelector("#end");
const startNode = document.querySelector("#start");
const timeContainer = document.querySelector('#time-container');
const userData = document.querySelector('#user-data');
const userPointsContainer = document.querySelector('.user-points');
const userPoint = document.querySelector('.points');
const questionContainerNode = document.querySelector("#question-container");
const questionTimeNode = document.querySelector("#question-time");
const totalTimeNode = document.querySelector("#total-time");
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
    const currentIdx = parseInt(localStorage.getItem("current-question-idx"));
    let userAnswer = (_a = localStorage.getItem('user-answers')) === null || _a === void 0 ? void 0 : _a.split(',')[currentIdx];
    let answersMarkup = answers
        .map((answer) => {
        const isChecked = answer.content === userAnswer;
        return `
            <div ${isChecked ? 'class="selected"' : ""}>
                <input type="radio" name="answer" id="answer${answer.id}" value="${answer.content}" ${isChecked ? "checked" : ""} />
                <label for="answer${answer.id}">${answer.content}</label>
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
    return localStorage.getItem('user-answers').split(',').every(answer => {
        return answer !== '';
    });
};
const bindHandlers = () => {
    document.addEventListener("DOMContentLoaded", () => contetLoadedHandler());
    document.addEventListener("keyup", (evt) => arrowHandler(evt));
    startNode.addEventListener("click", (evt) => startNodeHandler(evt));
    backNode.addEventListener("click", (evt) => backNodeHandler(evt));
    nextNode.addEventListener("click", (evt) => nextNodeHandler(evt));
    endNode.addEventListener("click", (evt) => endNodeHandler(evt));
};
bindHandlers();
//Handlers
const contetLoadedHandler = () => {
    localStoriageInitialize();
    questionContainerNode.style.display = "none";
    endNode.style.display = "none";
    backNode.style.display = "none";
    nextNode.style.display = "none";
    timeContainer.style.display = "none";
    userPointsContainer.style.display = 'none';
};
const arrowHandler = (evt) => {
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
    }
};
const startNodeHandler = (evt) => {
    localStoriageInitialize();
    totalTimeCounter(totalTime, totalTimeNode);
    displayQuestion();
    questionContainerNode.style.display = "flex";
    backNode.style.display = "inline";
    nextNode.style.display = "inline";
    startNode.style.display = "none";
    timeContainer.style.display = "block";
    userData.style.display = 'none';
};
const backNodeHandler = (evt) => {
    const currentIdx = parseInt(localStorage.getItem("current-question-idx"), 10);
    if (backNode.disabled) {
        return;
    }
    localStorage.setItem("current-question-idx", (currentIdx - 1).toString());
    displayQuestion();
};
const nextNodeHandler = (evt) => {
    const currentIdx = parseInt(localStorage.getItem("current-question-idx"), 10);
    if (nextNode.disabled) {
        return;
    }
    localStorage.setItem("current-question-idx", (currentIdx + 1).toString());
    displayQuestion();
};
const endNodeHandler = (evt) => {
    stopCounter(currentIntervalId);
    stopCounter(totalTime);
    questionContainerNode.style.display = "none";
    timeContainer.style.display = "none";
    //TODO :
    // if(endNode.style.display != 'none'){
    //   console.log('TEST')
    //   startNode.style.display = 'block'
    // }
    endNode.style.display = "none";
    userPointsContainer.style.display = 'block';
    userPoint.innerHTML = counterUserPoints();
};
const updateEndButtonVisibility = () => {
    endNode.style.display = checkAllAnswered() ? "inline" : "none";
    endNode.disabled = false;
};
