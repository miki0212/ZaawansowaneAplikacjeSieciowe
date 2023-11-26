import { BaseAbstractTemplate } from "../../baseTemplate/BaseAbstractTemplate.js";
import { createElement } from "../../createElements/CreateElements.js";
import { IQuestionDataArray } from "../../interface/IQuestionDataArray";
import { IQuestions } from "../../interface/IQuestions";
import { getLocalStorageItem } from "../../localStorageItems/LocalStorageItems.js";


export class StatisticContentModule extends BaseAbstractTemplate {

    private _mainContainer: HTMLDivElement;
    private _allQuestionData: IQuestions;

    //Containers
    private _baseContainer: HTMLDivElement;
    private _usernameContainer: HTMLDivElement;
    private _questionStatisticContainer: HTMLDivElement;
    private _pointsQuestionContainer: HTMLDivElement;

    constructor(mainContainer: HTMLDivElement) {
        super();

        this._mainContainer = mainContainer;

        this._allQuestionData = JSON.parse(getLocalStorageItem('question-data')) as IQuestions;

        this._baseContainer = createElement('div', 'base-statistic-container') as HTMLDivElement;
        this._usernameContainer = createElement('div', 'username-statistic-container') as HTMLDivElement;
        this._questionStatisticContainer = createElement('div', 'question-statistic-container') as HTMLDivElement;
        this._pointsQuestionContainer = createElement('div', 'points-question-container') as HTMLDivElement;
    }

    public render(): void {
        this.createPage();
    }

    createPage(): void {
        this._baseContainer.append(this._usernameContainer, this._questionStatisticContainer, this._pointsQuestionContainer);
        this._mainContainer.append(this._baseContainer);

        //Get username
        this._usernameContainer.innerHTML = getLocalStorageItem('username');

        //Statistic
        this.createStatistic();
        //User points
        this._pointsQuestionContainer.innerHTML = 'Congratulations you have : ' + this.countUserPoints();
    }

    bindHandlers(): void {
        throw new Error("Method not implemented.");
    }
    createStatistic = (): void => {
        const questionLength: number = parseInt(getLocalStorageItem('question-length'));
        const randomIndex: number[] = getLocalStorageItem('random-questions-index-array').split(',').map(Number);

        const questions: IQuestionDataArray[] = this._allQuestionData.questions as IQuestionDataArray[];
        //Statistic
        for (let i = 0; i < questionLength; i++) {
            const answerDiv = document.createElement('div');
            answerDiv.id = 'answerDiv';

            const lpAnswer = document.createElement('div');
            const userAnswerDiv = document.createElement('div')
            const correctAnswerDiv = document.createElement('div')

            lpAnswer.id = 'lp-answer';
            lpAnswer.innerHTML = '' + randomIndex[i];

            correctAnswerDiv.id = 'correct-answer';
            correctAnswerDiv.innerHTML = questions[randomIndex[i]].correctAnswer;

            userAnswerDiv.id = 'user-answer';
            userAnswerDiv.innerHTML = questions[randomIndex[i]].userAnswer;

            answerDiv.append(lpAnswer, correctAnswerDiv, userAnswerDiv);

            this._questionStatisticContainer.append(answerDiv);

            if (questions[randomIndex[i]].correctAnswer === questions[randomIndex[i]].userAnswer) {
                userAnswerDiv.classList.add('correct')
            } else {
                userAnswerDiv.classList.add('incorrect')
            }
        }
    }

    //Można przenieść do helpera
    countUserPoints = (): string => {
        const questions: IQuestionDataArray[] = this._allQuestionData.questions as IQuestionDataArray[];
        let userPoints: number = 0;

        //Zlicza punkty użytkownika
        questions.forEach((item) => {
            if (item.userAnswer === item.correctAnswer) {
                userPoints++;
            }
        })
        return userPoints.toString();
    }

}