import { StartPageModules } from "./modules/startPageModule/StartPageModule.js";
// import { Answer, Question } from "./data/data.js";
// import { counterUserPoints, getQuestionLength, setAnswerArray, showCorrectAnswers, startCounter, stopCounter, totalTimeCounter } from "./helper.js";
// import { localStoriageInitialize } from "./localStorageInitialize.js";
// import { getLocalStorageItem, setLocalStorageItem } from "./localStorageItems/LocalStorageItems.js";
// import { StartPageModules } from "./modules/startPageModule/StartPageModule.js";
// const titleNode = document.querySelector("#test-title") as HTMLHeadElement;
// const questionNode = document.querySelector("#question") as HTMLSpanElement;
// const answersNode = document.querySelector("#answers") as HTMLDivElement;
// const backNode = document.querySelector("#back") as HTMLButtonElement;
// const nextNode = document.querySelector("#next") as HTMLButtonElement;
// const endNode = document.querySelector("#end") as HTMLButtonElement;
// const startNode = document.querySelector("#start") as HTMLButtonElement;
// const timeContainer = document.querySelector('#time-container') as HTMLDivElement;
// const userData = document.querySelector('#user-data') as HTMLDivElement;
// const userPointsContainer = document.querySelector('#user-result') as HTMLDivElement;
// const userPoint = document.querySelector('.points') as HTMLSpanElement;
// const questionContainerNode = document.querySelector("#question-container") as HTMLDivElement;
// const questionTimeNode = document.querySelector("#question-time") as HTMLSpanElement;
// const totalTimeNode = document.querySelector("#total-time") as HTMLSpanElement;
// const questionCounterNode = document.querySelector('#question-counter') as HTMLDivElement;
// const usernameNode = document.querySelector('#username') as HTMLInputElement;
// const usernameDiv = document.querySelector('#user-name') as HTMLDivElement;
// const correctAnswerNode = document.querySelector('#correct-answers') as HTMLDivElement;
// titleNode.innerHTML = testData.title;
// let totalTime = 0;
// let currentIntervalId: number | null = null;
// const displayQuestion = (): void => {
//   const currentIdx: number = parseInt(getLocalStorageItem('current-question-idx'));
//   const currendRandomIndex: number = getLocalStorageItem('random-questions-index-array').split(',').map(Number)[currentIdx];
//   const currentQuestion: Question = JSON.parse(getLocalStorageItem('test-data')).questions[currendRandomIndex];
//   const questionsLength: number = getQuestionLength();
//   questionNode.innerHTML = currentQuestion.question;
//   backNode.disabled = currentIdx === 0;
//   nextNode.disabled = currentIdx === questionsLength - 1;
//   displayAnswers(currentQuestion.answers);
//   currentIntervalId = startCounter(currentIdx, currentIntervalId, questionTimeNode);
// };
// const displayAnswers = (answers: Answer[]): void => {
//   const currentIdx: number = parseInt(
//     getLocalStorageItem("current-question-idx")!
//   );
//   const currendRandomIndex: number = getLocalStorageItem('random-questions-index-array').split(',').map(Number)[currentIdx];
//   let userAnswer = getLocalStorageItem('user-answers')?.split(',')[currendRandomIndex];
//   let answersMarkup = answers
//     .map((answer) => {
//       const isChecked = answer.content === userAnswer;
//       return `
//             <div ${isChecked ? 'class="selected radio-btn"' : 'class="radio-btn"'}>
//                 <input type="radio" name="answer" id="answer${answer.id
//         }" value="${answer.content}" ${isChecked ? "checked" : ""} />
//                 <label class="answer-label" for="answer${answer.id}">${answer.content}</label>
//             </div>
//         `;
//     })
//     .join("");
//   answersNode.innerHTML = answersMarkup;
//   answersNode.querySelectorAll("input").forEach((inputElement) => {
//     inputElement.addEventListener("click", () => {
//       answersNode
//         .querySelectorAll("div")
//         .forEach((div) => div.classList.remove("selected"));
//       inputElement.parentElement!.classList.add("selected");
//       const currendRandomIndex: number = getLocalStorageItem('random-questions-index-array').split(',').map(Number)[currentIdx];
//       setAnswerArray(currendRandomIndex, inputElement.value.toString());
//       updateEndButtonVisibility();
//     });
//   });
// };
// const checkAllAnswered = (): boolean => {
//   return getLocalStorageItem('user-answers')!.split(',').every(answer => {
//     return answer !== '';
//   })
// };
// const bindHandlers = () => {
//   //Ustawianie elementów na display none
//   document.addEventListener("DOMContentLoaded", () => contetLoadedHandler());
//   //Obsługa strzałek lewo-prawo
//   document.addEventListener("keyup", (evt: KeyboardEvent) => arrowHandler(evt));
//   //Przyciski
//   startNode.addEventListener("click", (evt: Event) => startNodeHandler(evt));
//   backNode.addEventListener("click", (evt: Event) => backNodeHandler(evt));
//   nextNode.addEventListener("click", (evt: Event) => nextNodeHandler(evt));
//   endNode.addEventListener("click", (evt: Event) => endNodeHandler(evt));
// }
// bindHandlers();
// //Handlers
// const contetLoadedHandler = (): void => {
//   // localStoriageInitialize();
//   localStorage.clear();
//   questionContainerNode.style.display = "none";
//   endNode.style.display = "none";
//   backNode.style.display = "none";
//   nextNode.style.display = "none";
//   timeContainer.style.display = "none";
//   userPointsContainer.style.display = 'none';
// }
// const arrowHandler = (evt: KeyboardEvent): void => {
//   if (questionContainerNode.style.display != "none") {
//     evt.preventDefault();
//     if (evt.code.toLocaleLowerCase() === "ArrowRight".toLocaleLowerCase()) {
//       evt.stopImmediatePropagation();
//       nextNode.dispatchEvent(new Event("click"));
//     } else if (
//       evt.code.toLocaleLowerCase() === "ArrowLeft".toLocaleLowerCase()
//     ) {
//       evt.stopImmediatePropagation();
//       backNode.dispatchEvent(new Event("click"));
//     }
//     if (evt.code.toLocaleLowerCase() === "Arrowup".toLocaleLowerCase()) {
//       // const radioBTNArray : HTMLInputElement[] = document.querySelectorAll('input[type="radio"]') as HTMLInputElement;
//       const radioBTNNodeList = document.querySelectorAll('input[type="radio"]');
//       const radioBTNArray: HTMLInputElement[] = Array.from(radioBTNNodeList) as HTMLInputElement[];
//       let idx = 0;
//       for (let i = 0; i < 4; i++) {
//         radioBTNArray[i].parentElement?.classList.remove('selected');
//         if (radioBTNArray[i].checked) {
//           idx = i;
//           break;
//         }
//         if (i === 3) {
//           idx = 0;
//         }
//       }
//       if (idx === 0) {
//         idx = 3
//       } else {
//         idx--;
//       }
//       radioBTNArray[idx].checked = true;
//       radioBTNArray[idx].parentElement?.classList.add('selected');
//       const currentIdx: number = parseInt(getLocalStorageItem('current-question-idx'));
//       const currendRandomIndex: number = getLocalStorageItem('random-questions-index-array').split(',').map(Number)[currentIdx];
//       setAnswerArray(currendRandomIndex, radioBTNArray[idx].value)
//     }
//   }
// };
// const startNodeHandler = (evt: Event): void => {
//   localStorage.clear();
//   //FIXME:
//   if (usernameNode.value != '') {
//     console.log(usernameNode.value)
//     setLocalStorageItem('username', usernameNode.value);
//   }
//   //FIXME:
//   if (getLocalStorageItem('username') != '') {
//     totalTime = 0;
//     currentIntervalId = 0;
//     userPointsContainer.style.display = 'none';
//     localStoriageInitialize(usernameNode.value || " ");
//     questionCounterNode.innerHTML = `Pytanie 1 / ${getLocalStorageItem('question-length')}`
//     totalTimeCounter(totalTime, totalTimeNode);
//     displayQuestion();
//     questionContainerNode.style.display = "flex";
//     backNode.style.display = "inline";
//     nextNode.style.display = "inline";
//     startNode.style.display = "none";
//     timeContainer.style.display = "block";
//     userData.style.display = 'none';
//   }
// };
// const backNodeHandler = (evt: Event): void => {
//   const currentIdx: number = parseInt(
//     localStorage.getItem("current-question-idx")!,
//     10
//   );
//   if (backNode.disabled) {
//     return;
//   }
//   localStorage.setItem("current-question-idx", (currentIdx - 1).toString());
//   questionCounterNode.innerHTML = `Pytanie ${currentIdx} / ${getLocalStorageItem('question-length')}`
//   displayQuestion();
// };
// const nextNodeHandler = (evt: Event): void => {
//   const currentIdx: number = parseInt(
//     localStorage.getItem("current-question-idx")!,
//     10
//   );
//   if (nextNode.disabled) {
//     return;
//   }
//   localStorage.setItem("current-question-idx", (currentIdx + 1).toString());
//   questionCounterNode.innerHTML = `Pytanie ${currentIdx + 2} / ${getLocalStorageItem('question-length')}`
//   displayQuestion();
// };
// const endNodeHandler = (evt: Event): void => {
//   stopCounter(currentIntervalId);
//   stopCounter(totalTime);
//   usernameDiv.innerHTML = getLocalStorageItem('username');
//   questionContainerNode.style.display = "none"
//   timeContainer.style.display = "none";
//   //TODO :
//   // if(endNode.style.display != 'none'){
//   //   console.log('TEST')
//   //   startNode.style.display = 'block'
//   // }
//   startNode.style.display = 'block'
//   endNode.style.display = "none";
//   userPointsContainer.style.display = 'flex';
//   showCorrectAnswers(correctAnswerNode);
//   userPoint.innerHTML = counterUserPoints();
// };
// const updateEndButtonVisibility = (): void => {
//   endNode.style.display = checkAllAnswered() ? "inline" : "none";
//   endNode.disabled = false;
// };
//------------------------------------------------------------
//New Version
//------------------------------------------------------------
const mainCointainer = document.querySelector('#main-container');
const startGameModule = new StartPageModules(mainCointainer);
startGameModule.render();
