import testData from "./data/test-data.js";
const titleNode = document.querySelector("#test-title");
const questionNode = document.querySelector("#question");
const answersNode = document.querySelector("#answers");
const backNode = document.querySelector("#back");
const nextNode = document.querySelector("#next");
const endNode = document.querySelector("#end");
const startButton = document.querySelector("#start");
const timeContainer = document.querySelector('#time-container');
const userData = document.querySelector('#user-data');
const userPointsContainer = document.querySelector('.user-points');
const userPoint = document.querySelector('.points');
let questionsLength = 0;
let correctAnswers = [];
const questionContainerNode = document.querySelector("#question-container");
const questionTimeNode = document.querySelector("#question-time");
const totalTimeNode = document.querySelector("#total-time");
localStorage.clear();
localStorage.setItem("current-question-idx", "0");
localStorage.setItem("test-data", JSON.stringify(testData));
const getCorrectAnswers = () => {
    const questionsArray = testData;
    questionsArray.questions.forEach((item) => {
        correctAnswers.push(item.correctAnswer);
    });
    localStorage.setItem('correctAnswers', correctAnswers.toLocaleString());
};
const getQuestionLength = () => {
    const questionsArray = testData;
    questionsLength = questionsArray.questions.length;
};
const createEmptyTimeArray = () => {
    localStorage.setItem('questionTimes', new Array(questionsLength).fill(-1).toLocaleString());
};
const createEmptyQuestionArray = () => {
    localStorage.setItem('answers', new Array(questionsLength).fill(null).toLocaleString());
};
const getTimeArray = (index) => {
    const times = localStorage.getItem('questionTimes');
    if (times) {
        const timeArray = times.split(',').map(Number);
        return timeArray[index] == -1 ? 0 : timeArray[index];
    }
    return -1;
};
const setTimeArray = (index, value) => {
    const times = localStorage.getItem('questionTimes');
    if (times) {
        let timeArray = times.split(',').map(Number);
        timeArray[index] = value;
        localStorage.setItem('questionTimes', timeArray.toLocaleString());
    }
};
const setAnswerArray = (index, answer) => {
    var _a;
    console.log(answer);
    let answerArray = (_a = localStorage.getItem('answers')) === null || _a === void 0 ? void 0 : _a.split(',');
    answerArray[index] = answer;
    localStorage.setItem('answers', answerArray.toLocaleString());
};
getCorrectAnswers();
getQuestionLength();
createEmptyTimeArray();
createEmptyQuestionArray();
let totalTime = 0;
titleNode.innerHTML = testData.title;
const hiddenBtn = () => {
    backNode.style.display = "none";
    nextNode.style.display = "none";
    timeContainer.style.display = "none";
    userPointsContainer.style.display = 'none';
};
hiddenBtn();
document.addEventListener("keyup", (event) => {
    if (questionContainerNode.style.display != "none") {
        if (event.code.toLocaleLowerCase() === "ArrowRight".toLocaleLowerCase()) {
            nextNode.dispatchEvent(new Event("click"));
        }
        else if (event.code.toLocaleLowerCase() === "ArrowLeft".toLocaleLowerCase()) {
            backNode.dispatchEvent(new Event("click"));
        }
    }
});
document.addEventListener("DOMContentLoaded", () => {
    //   const startButton = document.querySelector("#start") as HTMLButtonElement;
    questionContainerNode.style.display = "none";
    endNode.style.display = "none";
    startButton.addEventListener("click", () => {
        totalTimeCounter();
        displayQuestion();
        startCounter(parseInt(localStorage.getItem("current-question-idx")));
        questionContainerNode.style.display = "flex";
        backNode.style.display = "inline";
        nextNode.style.display = "inline";
        startButton.style.display = "none";
        timeContainer.style.display = "block";
        userData.style.display = 'none';
    });
});
let currentIntervalId = null;
const startCounter = (currentIdx) => {
    if (currentIntervalId !== null) {
        clearInterval(currentIntervalId);
    }
    let time = parseInt(getTimeArray(currentIdx).toString() || '0', 10);
    questionTimeNode.innerHTML = `${time}`;
    currentIntervalId = window.setInterval(() => {
        time++;
        questionTimeNode.innerHTML = `${time / 10}`;
        setTimeArray(currentIdx, time);
    }, 100);
};
const stopCounter = () => {
    if (currentIntervalId !== null) {
        clearInterval(currentIntervalId);
        currentIntervalId = null;
    }
    if (totalTime != null) {
        clearInterval(totalTime);
        totalTime = 0;
    }
};
const totalTimeCounter = () => {
    let time = 0;
    totalTime = window.setInterval(() => {
        time++;
        totalTimeNode.innerHTML = `${time / 10}`;
    }, 100);
};
const displayQuestion = () => {
    const currentIdx = parseInt(localStorage.getItem("current-question-idx"));
    const currentQuestion = JSON.parse(localStorage.getItem("test-data")).questions[currentIdx];
    questionNode.innerHTML = currentQuestion.question;
    backNode.disabled = currentIdx === 0;
    nextNode.disabled = currentIdx === questionsLength - 1;
    displayAnswers(currentQuestion.answers);
    startCounter(currentIdx);
    // updateTotalTime();
};
const displayAnswers = (answers) => {
    var _a;
    const currentIdx = parseInt(localStorage.getItem("current-question-idx"));
    let userAnswer = (_a = localStorage.getItem('answers')) === null || _a === void 0 ? void 0 : _a.split(',')[currentIdx];
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
            setAnswerArray(currentIdx, inputElement.value.toString());
            updateEndButtonVisibility();
        });
    });
};
const checkAllAnswered = () => {
    return localStorage.getItem('answers').split(',').every(answer => {
        return answer !== '';
    });
};
const updateEndButtonVisibility = () => {
    endNode.style.display = checkAllAnswered() ? "inline" : "none";
    endNode.disabled = false;
};
backNode.addEventListener("click", () => {
    const currentIdx = parseInt(localStorage.getItem("current-question-idx"), 10);
    if (backNode.disabled) {
        return;
    }
    localStorage.setItem("current-question-idx", (currentIdx - 1).toString());
    displayQuestion();
});
nextNode.addEventListener("click", () => {
    const currentIdx = parseInt(localStorage.getItem("current-question-idx"), 10);
    if (nextNode.disabled) {
        return;
    }
    localStorage.setItem("current-question-idx", (currentIdx + 1).toString());
    displayQuestion();
});
const userPoints = () => {
    const correctAnswers = localStorage.getItem('correctAnswers').split(',');
    const userAnswers = localStorage.getItem('answers').split(',');
    let points = 0;
    correctAnswers.forEach((item, index) => {
        if (item == userAnswers[index]) {
            points++;
        }
    });
    return points;
};
endNode.addEventListener("click", () => {
    stopCounter();
    questionContainerNode.style.display = "none";
    timeContainer.style.display = "none";
    endNode.style.display = "none";
    userPointsContainer.style.display = 'block';
    userPoint.innerHTML = userPoints().toString();
});
