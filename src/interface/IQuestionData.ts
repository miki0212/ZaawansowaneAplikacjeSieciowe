import { IAnswers } from "./IAnswers";

export interface IQuestionData{
    timeSpent: number,
    question: string,
    correctAnswer: string,
    answers: IAnswers[]
}