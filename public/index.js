import testData from "./data/test-data.js";
const titleNode = document.querySelector("#test-title");
const questionNode = document.querySelector("#question");
const answersNode = document.querySelector("#answers");
const backNode = document.querySelector("#back");
const nextNode = document.querySelector("#next");
const endNode = document.querySelector("#end");
const questionTimeNode = document.querySelector("#question-time");
const totalTimeNode = document.querySelector("#total-time");
localStorage.clear();
localStorage.setItem("current-question-idx", "0");
localStorage.setItem("test-data", JSON.stringify(testData));
titleNode.innerHTML = testData.title;
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.querySelector("#start");
    backNode.style.display = 'inline';
    nextNode.style.display = 'inline';
    endNode.style.display = 'none';
    startButton.addEventListener("click", () => {
        displayQuestion();
        startCounter(parseInt(localStorage.getItem("current-question-idx")));
        startButton.style.display = 'none';
    });
});
let currentIntervalId = null;
const startCounter = (currentIdx) => {
    if (currentIntervalId !== null) {
        clearInterval(currentIntervalId);
    }
    let time = parseInt(localStorage.getItem(`question-time-${currentIdx}`) || '0', 10);
    questionTimeNode.innerHTML = `${time}`;
    currentIntervalId = window.setInterval(() => {
        time++;
        questionTimeNode.innerHTML = `${time}`;
        localStorage.setItem(`question-time-${currentIdx}`, time.toString());
        updateTotalTime();
    }, 1000);
};
const stopCounter = () => {
    if (currentIntervalId !== null) {
        clearInterval(currentIntervalId);
        currentIntervalId = null;
    }
};
const updateTotalTime = () => {
    const testData = JSON.parse(localStorage.getItem("test-data"));
    const totalTimes = testData.questions.map((_, index) => {
        return parseInt(localStorage.getItem(`question-time-${index}`) || '0', 10);
    });
    const totalTime = totalTimes.reduce((a, b) => a + b, 0);
    totalTimeNode.innerHTML = totalTime.toString();
    localStorage.setItem("total-time", totalTime.toString());
};
const displayQuestion = () => {
    const currentIdx = parseInt(localStorage.getItem("current-question-idx"));
    const currentQuestion = JSON.parse(localStorage.getItem("test-data")).questions[currentIdx];
    questionNode.innerHTML = currentQuestion.question;
    backNode.disabled = currentIdx === 0;
    nextNode.disabled = currentIdx === testData.questions.length - 1;
    displayAnswers(currentQuestion.answers);
    startCounter(currentIdx);
    updateTotalTime();
};
const displayAnswers = (answers) => {
    const currentIdx = parseInt(localStorage.getItem("current-question-idx"));
    let answerC = localStorage.getItem(`${currentIdx}-answer`) || '';
    let answersMarkup = answers.map((answer) => {
        const isChecked = answer.content === answerC;
        return `
            <div ${isChecked ? 'class="selected"' : ''}>
                <input type="radio" name="answer" id="answer${answer.id}" value="${answer.content}" ${isChecked ? 'checked' : ''} />
                <label for="answer${answer.id}">${answer.content}</label>
            </div>
        `;
    }).join("");
    answersNode.innerHTML = answersMarkup;
    answersNode.querySelectorAll('input').forEach((inputElement) => {
        inputElement.addEventListener('click', () => {
            answersNode.querySelectorAll('div').forEach(div => div.classList.remove('selected'));
            inputElement.parentElement.classList.add('selected');
            localStorage.setItem(`${currentIdx}-answer`, inputElement.value);
            updateEndButtonVisibility();
        });
    });
};
const checkAllAnswered = () => {
    const testData = JSON.parse(localStorage.getItem("test-data"));
    return testData.questions.every((_, index) => localStorage.getItem(`${index}-answer`) !== null);
};
const updateEndButtonVisibility = () => {
    endNode.style.display = checkAllAnswered() ? 'inline' : 'none';
};
backNode.addEventListener("click", () => {
    const currentIdx = parseInt(localStorage.getItem("current-question-idx"), 10);
    localStorage.setItem("current-question-idx", (currentIdx - 1).toString());
    displayQuestion();
});
nextNode.addEventListener("click", () => {
    const currentIdx = parseInt(localStorage.getItem("current-question-idx"), 10);
    localStorage.setItem("current-question-idx", (currentIdx + 1).toString());
    displayQuestion();
});
endNode.addEventListener("click", () => {
    stopCounter();
    updateTotalTime();
});
