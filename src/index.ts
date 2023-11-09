import { Answer, Question } from "./data/data";
import testData from "./data/test-data.js";

const titleNode = document.querySelector("#test-title") as HTMLHeadElement;
const questionNode = document.querySelector("#question") as HTMLSpanElement;
const answersNode = document.querySelector("#answers") as HTMLDivElement;
const backNode = document.querySelector("#back") as HTMLButtonElement;
const nextNode = document.querySelector("#next") as HTMLButtonElement;
const endNode = document.querySelector("#end") as HTMLButtonElement;
const startButton = document.querySelector("#start") as HTMLButtonElement;
const timeContainer = document.querySelector('#time-container') as HTMLDivElement;
const userData = document.querySelector('#user-data') as HTMLDivElement;

const questionContainerNode = document.querySelector(
  "#question-container"
) as HTMLDivElement;

const questionTimeNode = document.querySelector(
  "#question-time"
) as HTMLSpanElement;
const totalTimeNode = document.querySelector("#total-time") as HTMLSpanElement;

localStorage.clear();
localStorage.setItem("current-question-idx", "0");
localStorage.setItem("test-data", JSON.stringify(testData));

let totalTime = 0;
titleNode.innerHTML = testData.title;

const hiddenBtn = (): void => {
  backNode.style.display = "none";
  nextNode.style.display = "none";
  timeContainer.style.display = "none";
};

hiddenBtn();

document.addEventListener("keyup", (event: KeyboardEvent) => {
  if (questionContainerNode.style.display != "none") {
    if (event.code.toLocaleLowerCase() === "ArrowRight".toLocaleLowerCase()) {
      nextNode.dispatchEvent(new Event("click"));
    } else if (
      event.code.toLocaleLowerCase() === "ArrowLeft".toLocaleLowerCase()
    ) {
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
    startCounter(parseInt(localStorage.getItem("current-question-idx")!));
    questionContainerNode.style.display = "flex";

    backNode.style.display = "inline";
    nextNode.style.display = "inline";
    startButton.style.display = "none";
    timeContainer.style.display = "block";
    userData.style.display = 'none';
  });
});

let currentIntervalId: number | null = null;

const startCounter = (currentIdx: number): void => {
  if (currentIntervalId !== null) {
    clearInterval(currentIntervalId);
  }

  let time: number = parseInt(
    localStorage.getItem(`question-time-${currentIdx}`) || "0",
    10
  );
  questionTimeNode.innerHTML = `${time}`;

  currentIntervalId = window.setInterval(() => {
    time++;
    questionTimeNode.innerHTML = `${time / 10}`;
    localStorage.setItem(`question-time-${currentIdx}`, (time / 10).toString());
    // updateTotalTime();
  }, 100);
};

const stopCounter = (): void => {
  if (currentIntervalId !== null) {
    clearInterval(currentIntervalId);
    currentIntervalId = null;
  }
};

const totalTimeCounter = (): void => {
  let time = 0;
  totalTime = window.setInterval(() => {
    time++;
    totalTimeNode.innerHTML = `${time / 10}`;
    // localStorage.setItem(`question-time-${currentIdx}`, (time /10).toString());
    // updateTotalTime();
  }, 100);
};

// const updateTotalTime = (): void => {
//     const testData = JSON.parse(localStorage.getItem("test-data")!);
//     const totalTimes = testData.questions.map((_: Question, index: number) => {
//         return parseInt(localStorage.getItem(`question-time-${index}`) || '0', 10);
//     });
//     const totalTime = totalTimes.reduce((a: number, b: number) => a + b, 0);

//     totalTimeNode.innerHTML = totalTime.toString();

//     localStorage.setItem("total-time", totalTime.toString());
// };

const displayQuestion = (): void => {
  const currentIdx: number = parseInt(
    localStorage.getItem("current-question-idx")!
  );
  const currentQuestion: Question = JSON.parse(
    localStorage.getItem("test-data")!
  ).questions[currentIdx];

  questionNode.innerHTML = currentQuestion.question;

  backNode.disabled = currentIdx === 0;
  nextNode.disabled = currentIdx === testData.questions.length - 1;

  displayAnswers(currentQuestion.answers);
  startCounter(currentIdx);
  // updateTotalTime();
};

const displayAnswers = (answers: Answer[]): void => {
  const currentIdx: number = parseInt(
    localStorage.getItem("current-question-idx")!
  );
  let answerC: string = localStorage.getItem(`${currentIdx}-answer`) || "";

  let answersMarkup = answers
    .map((answer) => {
      const isChecked = answer.content === answerC;
      return `
            <div ${isChecked ? 'class="selected"' : ""}>
                <input type="radio" name="answer" id="answer${
                  answer.id
                }" value="${answer.content}" ${isChecked ? "checked" : ""} />
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
      inputElement.parentElement!.classList.add("selected");
      localStorage.setItem(`${currentIdx}-answer`, inputElement.value);
      updateEndButtonVisibility();
    });
  });
};

const checkAllAnswered = (): boolean => {
  const testData = JSON.parse(localStorage.getItem("test-data")!);
  return testData.questions.every(
    (_: Question, index: number) =>
      localStorage.getItem(`${index}-answer`) !== null
  );
};

const updateEndButtonVisibility = (): void => {
  endNode.style.display = checkAllAnswered() ? "inline" : "none";
};

backNode.addEventListener("click", () => {
  const currentIdx: number = parseInt(
    localStorage.getItem("current-question-idx")!,
    10
  );
  if(backNode.disabled){
    return;
  }
  localStorage.setItem("current-question-idx", (currentIdx - 1).toString());
  displayQuestion();
});

nextNode.addEventListener("click", () => {
  const currentIdx: number = parseInt(
    localStorage.getItem("current-question-idx")!,
    10
  );
  if(nextNode.disabled){
    return;
  }
  localStorage.setItem("current-question-idx", (currentIdx + 1).toString());
  displayQuestion();
});

endNode.addEventListener("click", () => {
  stopCounter();
  // updateTotalTime();
});
