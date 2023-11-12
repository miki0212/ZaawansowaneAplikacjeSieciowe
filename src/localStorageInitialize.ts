import { getLocalStorageItem, setLocalStorageItem } from "./localStorageItems/LocalStorageItems.js";
import testData from "./data/test-data.js";


export function localStoriageInitialize(){
    //Pobranie pytani i odpowiedzi
    setLocalStorageItem('test-data',JSON.stringify(testData));

    //Wartośc początkowa indeksu
    setLocalStorageItem('current-question-idx','0');

    //Liczba pytan
    setLocalStorageItem('question-length',testData.questions.length.toString());

    //Tworzy pustą tablice czasów dla pytań
    createEmptyTimeArray();

    //Tworzy pustą tablicę odpowiedzi użytkownika
    createEmptyQuestionArray();
}

const createEmptyTimeArray = () => {
    const questionsLength : number = parseInt(getLocalStorageItem('question-length'));
    setLocalStorageItem('question-times-array',new Array(questionsLength).fill(-1).toString())
}

const createEmptyQuestionArray = () => {
    const questionsLength : number = parseInt(getLocalStorageItem('question-length'));
    setLocalStorageItem('user-answers',new Array(questionsLength).fill(null).toString())
}
  