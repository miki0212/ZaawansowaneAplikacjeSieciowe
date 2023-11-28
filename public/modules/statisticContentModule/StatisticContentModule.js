import { BaseAbstractTemplate } from "../../baseTemplate/BaseAbstractTemplate.js";
import { createElement } from "../../createElements/CreateElements.js";
import { getLocalStorageItem } from "../../localStorageItems/LocalStorageItems.js";
export class StatisticContentModule extends BaseAbstractTemplate {
    constructor(mainContainer) {
        super();
        this.createStatistic = () => {
            const questionLength = parseInt(getLocalStorageItem('question-length'));
            const randomIndex = getLocalStorageItem('random-questions-index-array').split(',').map(Number);
            const questions = this._allQuestionData.questions;
            const questionTimes = getLocalStorageItem('question-times-array').split(',').map(Number);
            //Statistic
            for (let i = 0; i < questionLength; i++) {
                const answerDiv = document.createElement('div');
                answerDiv.id = 'answerDiv';
                const lpAnswer = document.createElement('div');
                const userAnswerDiv = document.createElement('div');
                const correctAnswerDiv = document.createElement('div');
                const questionTimeDiv = createElement('div', 'question-time-container');
                lpAnswer.id = 'lp-answer';
                lpAnswer.innerHTML = '' + i;
                correctAnswerDiv.id = 'correct-answer';
                correctAnswerDiv.innerHTML = questions[randomIndex[i]].correctAnswer;
                userAnswerDiv.id = 'user-answer';
                userAnswerDiv.innerHTML = questions[randomIndex[i]].userAnswer;
                questionTimeDiv.innerHTML = '' + (questionTimes[randomIndex[i]] % 10 == 0 ? questionTimes[randomIndex[i]] / 10 + '.0 s' : questionTimes[randomIndex[i]] / 10 + ' s');
                answerDiv.append(lpAnswer, correctAnswerDiv, userAnswerDiv, questionTimeDiv);
                this._questionStatisticContainer.append(answerDiv);
                if (questions[randomIndex[i]].correctAnswer === questions[randomIndex[i]].userAnswer) {
                    userAnswerDiv.classList.add('correct');
                }
                else {
                    userAnswerDiv.classList.add('incorrect');
                }
            }
            this._againTest.id = 'again-test';
            this._againTest.innerHTML = 'Rozwiąż ponownie test';
            document.body.appendChild(this._againTest);
            this._againTest.addEventListener('click', (evt) => {
                //FIXME: Add functionality when after click we can solve test one more time
                //Event needs to switch user to page when user can enter user's name
            });
        };
        //Można przenieść do helpera
        this.countUserPoints = () => {
            const questions = this._allQuestionData.questions;
            let userPoints = 0;
            //Zlicza punkty użytkownika
            questions.forEach((item) => {
                if (item.userAnswer === item.correctAnswer) {
                    userPoints++;
                }
            });
            return userPoints.toString();
        };
        this._mainContainer = mainContainer;
        this._allQuestionData = JSON.parse(getLocalStorageItem('question-data'));
        this._endBtn = document.querySelector('#end-btn');
        this._endBtn.style.display = 'none';
        this._againTest = document.createElement('button');
        this._againTest.style.display = 'block';
        this._baseContainer = createElement('div', 'base-statistic-container');
        this._usernameContainer = createElement('div', 'username-statistic-container');
        this._questionStatisticContainer = createElement('div', 'question-statistic-container');
        this._pointsQuestionContainer = createElement('div', 'points-question-container');
    }
    render() {
        this.createPage();
    }
    createPage() {
        this._baseContainer.append(this._usernameContainer, this._questionStatisticContainer, this._pointsQuestionContainer);
        this._mainContainer.append(this._baseContainer);
        //Get username
        this._usernameContainer.innerHTML = 'Użytkownik ' + getLocalStorageItem('username');
        //Statistic
        this.createStatistic();
        //User points
        this._pointsQuestionContainer.innerHTML = 'Gratulacje, masz  ' + this.countUserPoints() + ' pkt!';
    }
    bindHandlers() {
        throw new Error("Method not implemented.");
    }
}
