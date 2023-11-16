import { IAnswers } from "./IAnswers";
import { IQuestionData } from "./IQuestionData";

export interface IQuestions{
    title : string,
    // questions : IAnswers[];
    questions : IQuestionData[];
}