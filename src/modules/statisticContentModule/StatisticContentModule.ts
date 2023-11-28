import { BaseAbstractTemplate } from "../../baseTemplate/BaseAbstractTemplate.js";
import { createElement } from "../../createElements/CreateElements.js";
import { IQuestionDataArray } from "../../interface/IQuestionDataArray";
import { IQuestions } from "../../interface/IQuestions";
import { getLocalStorageItem } from "../../localStorageItems/LocalStorageItems.js";
import { StartPageModules } from "../startPageModule/StartPageModule.js";

export class StatisticContentModule extends BaseAbstractTemplate {

    private _mainContainer: HTMLDivElement;
    private _allQuestionData: IQuestions;
    private _endBtn: HTMLButtonElement;
    private _againTest: HTMLButtonElement;

    //Containers
    private _baseContainer: HTMLDivElement;
    private _usernameContainer: HTMLDivElement;
    private _questionStatisticContainer: HTMLDivElement;
    private _pointsQuestionContainer: HTMLDivElement;
    private _totalTimeContainer: HTMLDivElement;

    constructor(mainContainer: HTMLDivElement) {
        super();

        this._mainContainer = mainContainer;

        this._allQuestionData = JSON.parse(getLocalStorageItem('question-data')) as IQuestions;

        this._endBtn = document.querySelector('#end-btn') as HTMLButtonElement;
        // this._endBtn.style.display = 'none';

        this._againTest = document.querySelector('#again-test') as HTMLButtonElement;
        // this._againTest = document.createElement('button') as HTMLButtonElement;
        // this._againTest.style.display = 'block';

        this._baseContainer = createElement('div', 'base-statistic-container') as HTMLDivElement;
        this._usernameContainer = createElement('div', 'username-statistic-container') as HTMLDivElement;
        this._questionStatisticContainer = createElement('div', 'question-statistic-container') as HTMLDivElement;
        this._pointsQuestionContainer = createElement('div', 'points-question-container') as HTMLDivElement;

        this._totalTimeContainer = createElement('div', 'total-time-container') as HTMLDivElement;
    }

    public render(): void {
        this.createPage();
    }

    createPage(): void {
        this._baseContainer.append(this._usernameContainer, this._questionStatisticContainer, this._pointsQuestionContainer, this._totalTimeContainer);
        this._mainContainer.append(this._baseContainer);


        //Get username
        this._usernameContainer.innerHTML = 'Użytkownik ' + getLocalStorageItem('username');

        //Statistic
        this.createStatistic();

        const questionL: number = parseInt(getLocalStorageItem('question-length'));

        //User points
        this._pointsQuestionContainer.innerHTML = 'Gratulacje, masz  ' + this.countUserPoints() + ' / ' + questionL + ' pkt!';

    }

    bindHandlers(): void {
        throw new Error("Method not implemented.");
    }
    createStatistic = (): void => {
        //Total Time 
        this._totalTimeContainer.innerHTML = "Całkowity czas testu: " + parseInt(getLocalStorageItem("user-total-time")) / 10 + " s";

        const questionLength: number = parseInt(getLocalStorageItem('question-length'));
        const randomIndex: number[] = getLocalStorageItem('random-questions-index-array').split(',').map(Number);

        const questions: IQuestionDataArray[] = this._allQuestionData.questions as IQuestionDataArray[];
        const questionTimes: number[] = getLocalStorageItem('question-times-array').split(',').map(Number);
        //Statistic
        for (let i = 0; i < questionLength; i++) {
            const answerDiv = document.createElement('div');
            answerDiv.id = 'answerDiv';

            const lpAnswer = document.createElement('div');
            const questionDiv = document.createElement('div');
            const userAnswerDiv = document.createElement('div');
            const correctAnswerDiv = document.createElement('div');

            const questionTimeDiv = createElement('div', 'question-time-container') as HTMLDivElement;

            let questionPosition = i + 1;
            lpAnswer.id = 'lp-answer';
            lpAnswer.innerHTML = '' + questionPosition;

            questionDiv.id = 'question';
            questionDiv.innerHTML = questions[randomIndex[i]].question;

            correctAnswerDiv.id = 'correct-answer';
            correctAnswerDiv.innerHTML = questions[randomIndex[i]].correctAnswer;

            userAnswerDiv.id = 'user-answer'
            userAnswerDiv.innerHTML = questions[randomIndex[i]].userAnswer;

            questionTimeDiv.innerHTML = '' + (questionTimes[randomIndex[i]] % 10 == 0 ? questionTimes[randomIndex[i]] / 10 + '.0 s' : questionTimes[randomIndex[i]] / 10 + ' s');

            answerDiv.append(lpAnswer, questionDiv, correctAnswerDiv, userAnswerDiv, questionTimeDiv);

            this._questionStatisticContainer.append(answerDiv);

            if (questions[randomIndex[i]].correctAnswer === questions[randomIndex[i]].userAnswer) {
                userAnswerDiv.classList.add('correct')
            } else {
                userAnswerDiv.classList.add('incorrect')
            }
        }

        // this._againTest.id = 'again-test';
        // this._againTest.innerHTML = 'Rozwiąż ponownie test';
        document.body.appendChild(this._againTest);

        this._againTest.addEventListener('click', (evt: Event) => {
            //uj wie czmu działa ale działa
            evt.preventDefault();
            evt.stopImmediatePropagation();
            evt.stopPropagation();
            // const startPageModules = new StartPageModules(this._mainContainer);
            this._mainContainer.innerHTML = '';
            this._againTest.style.display = 'none';
            localStorage.clear();
            new StartPageModules(document.querySelector('#main-container') as HTMLDivElement).render();

            // startPageModules.render();
            //FIXME: Add functionality when after click we can solve test one more time
            //Event needs to switch user to page when user can enter user's name
        })
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