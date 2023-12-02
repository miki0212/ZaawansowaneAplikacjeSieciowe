import questionData from "../data/questions-data.js";

import { getLocalStorageItem, setLocalStorageItem } from "./LocalStorageItems.js";
import { IQuestions } from "../interface/IQuestions.js";

export function localStoriageInitialize() {
    //Cleaning localStorage
    localStorage.clear();

    //Counts how many questions the user has already answered
    setLocalStorageItem('answers-user-provided', '0')

    //Get questions and answers
    setLocalStorageItem('question-data', JSON.stringify((questionData as IQuestions)));

    //First index value
    setLocalStorageItem('current-question-idx', '0');

    //Set number of questions
    setLocalStorageItem('question-length', questionData.questions.length.toString());

    //Do empty time array for questions
    createEmptyTimeArray();

    //Do empty array for user answers
    createEmptyQuestionArray();

    //Do empty array for correct answers
    createCorrectAnswersArray(questionData);

    //Do array for random elements
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

    //Create array with random index for questions - get questions in random order
    setLocalStorageItem('random-questions-index-array', defaultArray.toString())
}