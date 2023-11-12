import { Answer, Question } from "./data/data";
import testData from "./data/test-data.js";
import { IQuestions } from "./interface/IQuestions";
import { localStoriageInitialize } from "./localStorageInitialize.js";
import { getLocalStorageItem, setLocalStorageItem } from "./localStorageItems/LocalStorageItems.js";



const titleNode = document.querySelector("#test-title") as HTMLHeadElement;
const questionNode = document.querySelector("#question") as HTMLSpanElement;
const answersNode = document.querySelector("#answers") as HTMLDivElement;
const backNode = document.querySelector("#back") as HTMLButtonElement;
const nextNode = document.querySelector("#next") as HTMLButtonElement;
const endNode = document.querySelector("#end") as HTMLButtonElement;
const startButton = document.querySelector("#start") as HTMLButtonElement;
const timeContainer = document.querySelector('#time-container') as HTMLDivElement;
const userData = document.querySelector('#user-data') as HTMLDivElement;
const userPointsContainer = document.querySelector('.user-points') as HTMLDivElement;
const userPoint = document.querySelector('.points') as HTMLSpanElement;

let questionsLength: number = 0;
let correctAnswers: string[] = [];

const questionContainerNode = document.querySelector(
  "#question-container"
) as HTMLDivElement;

const questionTimeNode = document.querySelector(
  "#question-time"
) as HTMLSpanElement;
const totalTimeNode = document.querySelector("#total-time") as HTMLSpanElement;

localStorage.clear();

localStoriageInitialize();

// setLocalStorageItem('current-question-idx','0');
//FIXME : Do usuniecia - // localStorage.setItem("current-question-idx", "0");
//FIXME : Do usuniecia - // localStorage.setItem("test-data", JSON.stringify(testData));
// setLocalStorageItem('test-data',JSON.stringify(testData));

const getCorrectAnswers = () => {
  const questionsArray: IQuestions = testData as unknown as IQuestions;
  questionsArray.questions.forEach((item) => {
    correctAnswers.push(item.correctAnswer);
  })

  localStorage.setItem('correctAnswers', correctAnswers.toLocaleString());
}

const getQuestionLength = () => {
  questionsLength = parseInt(getLocalStorageItem('question-length'));
  //FIXME : Do - usuniecia // const questionsArray: IQuestions = testData as unknown as IQuestions;
  //FIXME : Do - usuniecia // questionsLength = questionsArray.questions.length;
}

// const createEmptyTimeArray = (localStorageItemName : string) => {
//   localStorage.setItem(localStorageItemName, new Array(questionsLength).fill(-1).toLocaleString());
// }

// const createEmptyQuestionArray = (localStorageItemName : string) => {
//   localStorage.setItem(localStorageItemName, new Array(questionsLength).fill(null).toLocaleString());
// }

const getTimeArray = (index: number): number => {
  const times = getLocalStorageItem('question-times-array');
  //FIXME : Do - usuniecia // const times = localStorage.getItem('question-times-array');
  
  if (times) {
    const timeArray = times.split(',').map(Number);
    return timeArray[index] == -1 ? 0 : timeArray[index];
  }
  return -1;
}

const setTimeArray = (index: number, value: number) => {
  const times = getLocalStorageItem('question-times-array');
  //FIXME : Do - usuniecia // const times = localStorage.getItem('question-times-array');
  
  if (times) {
    let timeArray = times.split(',').map(Number)!;
    timeArray[index] = value;
    setLocalStorageItem('question-times-array',timeArray.toString());
  }
}

const setAnswerArray = (index: number, answer: string) => {
  console.log(answer);
  let answerArray: string[] = localStorage.getItem('user-answers')?.split(',')!;
  answerArray[index] = answer;
  setLocalStorageItem('user-answers',answerArray.toString())
  //FIXME : Do usuniecia - // localStorage.setItem('user-answers', answerArray.toLocaleString());
}

const createRandomArray = () => {
  let defaultArray : number[] = [...Array(7).keys()].map(i=>i+1);
  console.log(defaultArray);

  for(let i = defaultArray.length - 1;i > 0;i--){
    const j = Math.floor(Math.random() * (i + 1));
    [defaultArray[i], defaultArray[j]] = [defaultArray[j], defaultArray[i]];
  }

  //Tworzy tablice losowych indeksow dla pytan - w sensie że to umożliwia pobieranie pytań w losowej kolejności - rozumiesz ?
  setLocalStorageItem('random-questions-index-array',defaultArray.toString())
}

//Pobiera aktualny indeks pytania z tablicy - z tej tablicy w ktorej elementy sa w losowej kolejnosci - defaultArray;
const getCurrentRandomQuestionIndex = (currentIndex : number)=>{
  // FIXME : Do usuniecia - const randomQuestionsArray = localStorage.getItem(localStorageItemName);
  const randomQuestionsArray = getLocalStorageItem('random-questions-index-array')
  
  if(randomQuestionsArray){
    let actualQuestionIndex = randomQuestionsArray.split(',')[currentIndex];
    // console.log(actualQuestionIndex)
  }
}


//Tworzy tablice z poprawnymi odpowiedziam i zapisuje ja w localstorage
getCorrectAnswers();

//Pobiera liczbe pytan
getQuestionLength();

//Tworzy pusta tablice z czasami dla poszczegolnych pytań
// createEmptyTimeArray("question-times");

//Tworzy pustą tablicę odpowiedzi użytkownika
// createEmptyQuestionArray("user-answers");

//Tworzy tablice xd
createRandomArray();

getCurrentRandomQuestionIndex(1);

let totalTime = 0;
titleNode.innerHTML = testData.title;

const hiddenBtn = (): void => {
  backNode.style.display = "none";
  nextNode.style.display = "none";
  timeContainer.style.display = "none";

  userPointsContainer.style.display = 'none';

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
    const localStorageItemName : string = 'current-question-idx';
    totalTimeCounter();
    displayQuestion();
    startCounter(parseInt(localStorage.getItem(localStorageItemName)!));

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
    getTimeArray(currentIdx).toString() || '0', 10
  );
  questionTimeNode.innerHTML = `${time}`;

  currentIntervalId = window.setInterval(() => {
    time++;
    questionTimeNode.innerHTML = `${time / 10}`;
    setTimeArray(currentIdx, time);
  }, 100);
};

const stopCounter = (): void => {
  if (currentIntervalId !== null) {
    clearInterval(currentIntervalId);
    currentIntervalId = null;
  }

  if (totalTime != null) {
    clearInterval(totalTime);
    totalTime = 0;
  }
};

const totalTimeCounter = (): void => {
  let time = 0;
  totalTime = window.setInterval(() => {
    time++;
    totalTimeNode.innerHTML = `${time / 10}`;
  }, 100);
};

const displayQuestion = (): void => {
  const currentIdx: number = parseInt(
    localStorage.getItem("current-question-idx")!
  );
  const currentQuestion: Question = JSON.parse(
    localStorage.getItem("test-data")!
  ).questions[currentIdx];

  questionNode.innerHTML = currentQuestion.question;

  backNode.disabled = currentIdx === 0;
  nextNode.disabled = currentIdx === questionsLength - 1;

  displayAnswers(currentQuestion.answers);
  startCounter(currentIdx);
  // updateTotalTime();
};

const displayAnswers = (answers: Answer[]): void => {
  const currentIdx: number = parseInt(
    localStorage.getItem("current-question-idx")!
  );
  let userAnswer = localStorage.getItem('user-answers')?.split(',')[currentIdx];

  let answersMarkup = answers
    .map((answer) => {
      const isChecked = answer.content === userAnswer;
      return `
            <div ${isChecked ? 'class="selected"' : ""}>
                <input type="radio" name="answer" id="answer${answer.id
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
      setAnswerArray(currentIdx, inputElement.value.toString());
      updateEndButtonVisibility();
    });
  });
};

const checkAllAnswered = (): boolean => {

  return localStorage.getItem('user-answers')!.split(',').every(answer => {
    return answer !== '';
  })
};

const updateEndButtonVisibility = (): void => {
  endNode.style.display = checkAllAnswered() ? "inline" : "none";
  endNode.disabled = false;
};

backNode.addEventListener("click", () => {
  const currentIdx: number = parseInt(
    localStorage.getItem("current-question-idx")!,
    10
  );

  if (backNode.disabled) {
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

  if (nextNode.disabled) {
    return;
  }

  localStorage.setItem("current-question-idx", (currentIdx + 1).toString());
  displayQuestion();
});

const userPoints = () => {
  const correctAnswers: string[] = localStorage.getItem('correctAnswers')!.split(',');
  const userAnswers: string[] = localStorage.getItem('user-answers')!.split(',');
  let points = 0;

  correctAnswers.forEach((item, index) => {
    if (item == userAnswers[index]) {
      points++;
    }
  })
  return points;
}


endNode.addEventListener("click", () => {
  stopCounter();
  questionContainerNode.style.display = "none"
  timeContainer.style.display = "none";
  endNode.style.display = "none";

  userPointsContainer.style.display = 'block';
  userPoint.innerHTML = userPoints().toString();
});

