import questionData from "../data/questions-data.js";

import { getLocalStorageItem, setLocalStorageItem } from "./LocalStorageItems.js";
import { IQuestions } from "../interface/IQuestions.js";


export function localStoriageInitialize() {
    //Czyszczenie localStorage
    localStorage.clear();

    //Zlicza na ile pytań użytkownik już odpowiedział
    setLocalStorageItem('answers-user-provided', '0')

    //Pobranie pytani i odpowiedzi
    setLocalStorageItem('question-data', JSON.stringify((questionData as IQuestions)));

    //Wartośc początkowa indeksu
    setLocalStorageItem('current-question-idx', '0');

    //Ustawia Liczbe pytan
    setLocalStorageItem('question-length', questionData.questions.length.toString());

    //Tworzy pustą tablice czasów dla pytań
    createEmptyTimeArray();

    //Tworzy pustą tablicę odpowiedzi użytkownika
    createEmptyQuestionArray();

    //Tworzy tablicę poprawnych odpowiedzi
    createCorrectAnswersArray(questionData);

    //Tworzy tablice xd - losowe elementy
    createRandomArray();
}

const createEmptyTimeArray = () => {
    const questionsLength: number = parseInt(getLocalStorageItem('question-length'));
    setLocalStorageItem('question-times-array', new Array(questionsLength).fill(0).toString())
}

const createEmptyQuestionArray = () => {
    const questionsLength: number = parseInt(getLocalStorageItem('question-length'));
    setLocalStorageItem('user-answers', new Array(questionsLength).fill(null).toString())
}

function createCorrectAnswersArray(testData: any): void {
    const questionsArray: IQuestions = testData as unknown as IQuestions;
    let correctAnswers: string[] = [];
    questionsArray.questions.forEach((item) => {
        correctAnswers.push(item.correctAnswer);
    })

    setLocalStorageItem('correct-answers', correctAnswers.toString());
}

function createRandomArray() {
    let defaultArray: number[] = [...Array(7).keys()].map(i => i);

    for (let i = defaultArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [defaultArray[i], defaultArray[j]] = [defaultArray[j], defaultArray[i]];
    }

    //Tworzy tablice losowych indeksow dla pytan - w sensie że to umożliwia pobieranie pytań w losowej kolejności - rozumiesz ?
    setLocalStorageItem('random-questions-index-array', defaultArray.toString())
}


