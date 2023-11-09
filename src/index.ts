import { Answer, Question } from "./data/data";
import testData from "./data/test-data.js";
import { IQuestions } from './interface/IQuestions';

const titleNode: HTMLHeadElement = document.querySelector("#test-title") as HTMLHeadElement
const questionNode: HTMLSpanElement = document.querySelector("#question")!
const answersNode: HTMLDivElement = document.querySelector("#answers")!
const backNode: HTMLButtonElement = document.querySelector("#back")!
const nextNode: HTMLButtonElement = document.querySelector("#next")!
const endNode: HTMLButtonElement = document.querySelector("#end")!
const questionTimeNode: HTMLSpanElement = document.querySelector("#question-time")!
const totalTimeNode: HTMLSpanElement = document.querySelector("#total-time")!

const totalAnswer = 2;
let answer = 0;
localStorage.clear();
// console.log(testData)

titleNode.innerHTML = testData.title;

let currentIntervalId: number

localStorage.setItem("current-question-idx", "0")
localStorage.setItem("test-data", JSON.stringify(testData))

document.addEventListener('DOMContentLoaded', () => {
    const startButton: HTMLButtonElement = document.querySelector("#start") as HTMLButtonElement;
    
    startButton.addEventListener("click", () => {
        displayQuestion(); // Wyświetl pytanie
        startCounter();    // Rozpocznij odliczanie
        startButton.style.display = 'none'; // Ukryj przycisk startu
    });
});


const startCounter = (): void => {
    let time: number = 0;
    currentIntervalId = setInterval(()=> {
        questionTimeNode.innerHTML = `${++time}`
    }, 1000)
}

const stopCounter = ():void => {
    clearInterval(currentIntervalId);
    questionTimeNode.innerHTML = '0'
}

const displayQuestion = (): void => {
    const currentIdx: number = parseInt(localStorage.getItem("current-question-idx")!)
    const currentQuestion: Question = JSON.parse(localStorage.getItem("test-data")!).questions[currentIdx]
    questionNode.innerHTML = currentQuestion.question;
  
    const isAtStart: boolean = currentIdx === 0;
    const isAtEnd: boolean = currentIdx === testData.questions.length - 1;
  
    backNode.disabled = isAtStart;
    nextNode.disabled = isAtEnd;
  
    displayAnswers(currentQuestion.answers);
    startCounter()
}

const displayAnswers = (answers: Answer[]): void => {
    const currentIdx: number = parseInt(localStorage.getItem("current-question-idx")!)
    let answerC : string = '';

    if(localStorage.getItem(`${currentIdx}answer`)){
        answerC = localStorage.getItem(`${currentIdx}answer`)!.toString();
    }
    
    const answersRadio = answers.map((answer,index) => {
    
        return `<div ${answer.content === answerC ? 'class="choose"' : ''}>
        <input type="radio" name="answer" id="${answer.id}"  value="${answer.content}" ${answer.content === answerC ? 'checked' : ''}/>
        <label  for="${answer.id}">${answer.content}</label>
    </div>`
  })

  answersNode.innerHTML = answersRadio.join("");

  answersNode.querySelectorAll('input').forEach((e : HTMLInputElement,index,data)=>{
    e.addEventListener('click',()=>{
        data.forEach(e=>{
            e.parentElement?.classList.remove('choose')
        })

        if(!localStorage.getItem(`${currentIdx}answer`)){
            answer++;
        }

        if(totalAnswer == answer){
            console.log("Answers : "+answer)
            endNode.style.display = 'flex'
        }
        
        localStorage.setItem(`${currentIdx}answer`,e.value);
        const actualAnswer = localStorage.getItem(`${currentIdx}answer`);
        if(actualAnswer === e.value){
            (e.parentElement as HTMLDivElement).classList.add('choose');
        }
    })
  })
}

nextNode.addEventListener("click", (e)=> {

    //get selected answer
    const selectedAnswer = document.querySelector('input[name="answer"]:checked') as HTMLInputElement;
    const selectedValue = selectedAnswer ? selectedAnswer.value : null;
    const currentIdx: number = parseInt(localStorage.getItem("current-question-idx")!)

    // localStorage.setItem(`${currentIdx}`,`${selectedValue}`)
    console.log(selectedValue)

    e.preventDefault();
    e.stopPropagation();
    if (currentIdx < testData.questions.length - 1) { // Sprawdzenie, czy nie jesteśmy na ostatnim pytaniu
        stopCounter();
        localStorage.setItem("current-question-idx", `${currentIdx + 1}`);
        displayQuestion();
      }
})

backNode.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const currentIdx: number = parseInt(localStorage.getItem("current-question-idx")!);
  
    if (currentIdx > 0) { // Sprawdzenie, czy nie jesteśmy na pierwszym pytaniu
      stopCounter();
      localStorage.setItem("current-question-idx", `${currentIdx - 1}`);
      displayQuestion();
    }
  });
  

endNode.style.display = 'none';

// displayQuestion()