import { IAnswers } from "./IAnswers";

export interface IQuestionDataArray {
    timeSpent: number,
    question: string,
    correctAnswer: string,
    userAnswer: string,
    answers: IAnswers[]
}