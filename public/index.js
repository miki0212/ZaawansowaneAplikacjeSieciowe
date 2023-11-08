import testData from "./data/test-data.js";
const titleNode = document.querySelector("#test-title");
const questionNode = document.querySelector("#question");
const answersNode = document.querySelector("#answers");
const backNode = document.querySelector("#back");
const nextNode = document.querySelector("#next");
const endNode = document.querySelector("#end");
const questionTimeNode = document.querySelector("#question-time");
const totalTimeNode = document.querySelector("#total-time");
// console.log(testData)
titleNode.innerHTML = testData.title;
let currentIntervalId;
localStorage.setItem("current-question-idx", "0");
localStorage.setItem("test-data", JSON.stringify(testData));
const startCounter = () => {
    let time = 0;
    currentIntervalId = setInterval(() => {
        questionTimeNode.innerHTML = `${++time}`;
    }, 1000);
};
const stopCounter = () => {
    clearInterval(currentIntervalId);
    questionTimeNode.innerHTML = '0';
};
const displayQuestion = () => {
    const currentIdx = parseInt(localStorage.getItem("current-question-idx"));
    const currentQuestion = JSON.parse(localStorage.getItem("test-data")).questions[currentIdx];
    questionNode.innerHTML = currentQuestion.question;
    displayAnswers(currentQuestion.answers);
    startCounter();
};
const displayAnswers = (answers) => {
    const answersRadio = answers.map(answer => {
        return `<div>
        <input type="radio" name="answer" id="${answer.id}" value="${answer.content}" />
        <label  for="${answer.id}">${answer.content}</label>
    </div>`;
    });
    answersNode.innerHTML = answersRadio.join("");
};
nextNode.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    stopCounter();
    const currentIdx = parseInt(localStorage.getItem("current-question-idx"));
    localStorage.setItem("current-question-idx", `${currentIdx + 1}`);
    displayQuestion();
});
backNode.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    stopCounter();
    const currentIdx = parseInt(localStorage.getItem("current-question-idx"));
    localStorage.setItem("current-question-idx", `${currentIdx - 1}`);
    displayQuestion();
});
displayQuestion();
