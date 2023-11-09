import testData from "./data/test-data.js";
const titleNode = document.querySelector("#test-title");
const questionNode = document.querySelector("#question");
const answersNode = document.querySelector("#answers");
const backNode = document.querySelector("#back");
const nextNode = document.querySelector("#next");
const endNode = document.querySelector("#end");
const questionTimeNode = document.querySelector("#question-time");
const totalTimeNode = document.querySelector("#total-time");
const totalAnswer = 2;
let answer = 0;
localStorage.clear();
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
    const isAtStart = currentIdx === 0;
    const isAtEnd = currentIdx === testData.questions.length - 1;
    backNode.disabled = isAtStart;
    nextNode.disabled = isAtEnd;
    displayAnswers(currentQuestion.answers);
    startCounter();
};
const displayAnswers = (answers) => {
    const currentIdx = parseInt(localStorage.getItem("current-question-idx"));
    let answerC = '';
    if (localStorage.getItem(`${currentIdx}answer`)) {
        answerC = localStorage.getItem(`${currentIdx}answer`).toString();
    }
    const answersRadio = answers.map((answer, index) => {
        return `<div ${answer.content === answerC ? 'class="choose"' : ''}>
        <input type="radio" name="answer" id="${answer.id}"  value="${answer.content}" ${answer.content === answerC ? 'checked' : ''}/>
        <label  for="${answer.id}">${answer.content}</label>
    </div>`;
    });
    answersNode.innerHTML = answersRadio.join("");
    answersNode.querySelectorAll('input').forEach((e, index, data) => {
        e.addEventListener('click', () => {
            data.forEach(e => {
                var _a;
                (_a = e.parentElement) === null || _a === void 0 ? void 0 : _a.classList.remove('choose');
            });
            if (!localStorage.getItem(`${currentIdx}answer`)) {
                answer++;
            }
            if (totalAnswer == answer) {
                console.log("Answers : " + answer);
                endNode.style.display = 'flex';
            }
            localStorage.setItem(`${currentIdx}answer`, e.value);
            const actualAnswer = localStorage.getItem(`${currentIdx}answer`);
            if (actualAnswer === e.value) {
                e.parentElement.classList.add('choose');
            }
        });
    });
};
nextNode.addEventListener("click", (e) => {
    //get selected answer
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    const selectedValue = selectedAnswer ? selectedAnswer.value : null;
    const currentIdx = parseInt(localStorage.getItem("current-question-idx"));
    // localStorage.setItem(`${currentIdx}`,`${selectedValue}`)
    console.log(selectedValue);
    e.preventDefault();
    e.stopPropagation();
    if (currentIdx < testData.questions.length - 1) { // Sprawdzenie, czy nie jesteśmy na ostatnim pytaniu
        stopCounter();
        localStorage.setItem("current-question-idx", `${currentIdx + 1}`);
        displayQuestion();
    }
});
backNode.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const currentIdx = parseInt(localStorage.getItem("current-question-idx"));
    if (currentIdx > 0) { // Sprawdzenie, czy nie jesteśmy na pierwszym pytaniu
        stopCounter();
        localStorage.setItem("current-question-idx", `${currentIdx - 1}`);
        displayQuestion();
    }
});
endNode.style.display = 'none';
displayQuestion();
