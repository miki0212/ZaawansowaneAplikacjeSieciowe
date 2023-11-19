import { IAnswers } from "./IAnswers";
import { IQuestionDataArray } from "./IQuestionDataArray";

export interface IQuestions {
    title: string,
    questions: IQuestionDataArray[];
}