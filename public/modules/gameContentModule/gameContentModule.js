import { BaseAbstractTemplate } from "../../baseTemplate/BaseAbstractTemplate.js";
import { createElement } from "../../createElements/CreateElements.js";
import { getLocalStorageItem, setLocalStorageItem } from "../../localStorageItems/LocalStorageItems.js";
import { QuestionContentModule } from "../questionContentModule.ts/QuestionContentModule.js";
import * as LocalStorageInitializ from "../../localStorageItems/LocalStorageInitialize.js";
import { getAllQuestionData } from "../../helper.js";
import { StatisticContentModule } from "../statisticContentModule/StatisticContentModule.js";
export class GameContentModule extends BaseAbstractTemplate {
    constructor(mainContainer, actualPage, maxPage) {
        super();
        this.render = () => {
            this.createPage();
            this._mainContainer.innerHTML = '';
            this._mainContainer.append(this._baseContainer);
        };
        this.totalTimeCounter = () => {
            let time = 0;
            this._totalTimeCounterId = window.setInterval(() => {
                time++;
                //Display time on page
                if (time % 10 === 0) {
                    this._totalTimeSpan.innerHTML = `${time / 10}.0`;
                }
                else {
                    this._totalTimeSpan.innerHTML = `${time / 10}`;
                }
                //Save to localStorage
                setLocalStorageItem('user-total-time', `${time}`);
            }, 100);
        };
        this.oneQuestionTimeCounter = () => {
            const allQuestionData = getAllQuestionData();
            const actualIndex = parseInt(getLocalStorageItem('current-question-idx'));
            const randomIndexArray = getLocalStorageItem('random-questions-index-array').split(',').map(Number)[actualIndex];
            const userAnswer = allQuestionData.questions[randomIndexArray].userAnswer;
            let actualQuestionTimeArray = getLocalStorageItem('question-times-array').split(',').map(Number);
            let actualQuestionTime = actualQuestionTimeArray[randomIndexArray];
            window.clearInterval(this._oneQuestionTimeCounterId);
            if (userAnswer == '') {
                this._oneQuestionTimeCounterId = window.setInterval(() => {
                    actualQuestionTime++;
                    if (actualQuestionTime % 10 === 0) {
                        this._oneQuestionTimeSpan.innerHTML = `${actualQuestionTime / 10}.0`;
                    }
                    else {
                        this._oneQuestionTimeSpan.innerHTML = `${actualQuestionTime / 10}`;
                    }
                    actualQuestionTimeArray[randomIndexArray] = actualQuestionTime;
                    setLocalStorageItem('question-times-array', actualQuestionTimeArray.toString());
                }, 100);
            }
            else {
                this._oneQuestionTimeSpan.innerHTML = '' + (actualQuestionTime % 10 == 0 ? actualQuestionTime / 10 + '.0' : '' + actualQuestionTime / 10);
            }
        };
        this.nextBtnHandler = (evt) => {
            const currentRandomIndex = getLocalStorageItem('random-questions-index-array').split(',').map(Number);
            const currentIndex = parseInt(getLocalStorageItem('current-question-idx'));
            if (currentIndex != this._maxPage - 1) {
                this.updatePage(currentIndex + 2);
                setLocalStorageItem('current-question-idx', (currentIndex + 1).toString());
                this._oneQuestionTimera();
                this._questionContentContainer.innerHTML = `${this._questionContent[currentRandomIndex[currentIndex + 1]].question}`;
                new QuestionContentModule(this._questionContainer, this._endBtn).render();
            }
        };
        this.prevBtnHandler = (evt) => {
            const currentRandomIndex = getLocalStorageItem('random-questions-index-array').split(',').map(Number);
            const currentIndex = parseInt(getLocalStorageItem('current-question-idx'));
            if (currentIndex - 1 >= 0) {
                this.updatePage(currentIndex);
                setLocalStorageItem('current-question-idx', (currentIndex - 1).toString());
                this._oneQuestionTimera();
                this._questionContentContainer.innerHTML = `${this._questionContent[currentRandomIndex[currentIndex - 1]].question}`;
                new QuestionContentModule(this._questionContainer, this._endBtn).render();
            }
        };
        this.arrowsRightLeftKeyDownHandler = (evt) => {
            if (evt.code.toLocaleLowerCase() === 'ArrowLeft'.toLocaleLowerCase()) {
                this._prevBtn.style.background = '#b9bade86';
                this.prevBtnHandler(new Event('click'));
            }
            else if (evt.code.toLocaleLowerCase() === 'ArrowRight'.toLocaleLowerCase()) {
                this._nextBtn.style.background = '#b9bade86';
                this.nextBtnHandler(new Event('click'));
            }
        };
        //Removes the hover effect when switching questions
        this.arrowsRightLeftKeyUpHandler = (evt) => {
            if (evt.code.toLocaleLowerCase() === 'ArrowLeft'.toLocaleLowerCase()) {
                this._prevBtn.style.background = '';
            }
            else if (evt.code.toLocaleLowerCase() === 'ArrowRight'.toLocaleLowerCase()) {
                this._nextBtn.style.background = '';
            }
        };
        this._oneQuestionTimera = this.oneQuestionTimeCounter.bind(this);
        this._totalTimeCounterId = 0;
        this._oneQuestionTimeCounterId = 0;
        //Timer counting the total test time
        this._totalTimeSpan = document.createElement('span');
        this._totalTimeSpanContent = document.createElement('span');
        //Timer for one question
        this._oneQuestionTimeContainer = document.createElement('div');
        this._oneQuestionTimeCenterContainer = document.createElement('div');
        this._oneQuestionTimeSpan = document.createElement('div');
        this._oneQuestionTimeSpanContent = document.createElement('span');
        LocalStorageInitializ.localStoriageInitialize();
        this._totalTimeCenterContainer = document.createElement('div');
        this._totalTimeContainer = document.createElement('div');
        this._againTest = document.querySelector('#again-test');
        const questionData = getLocalStorageItem('question-data');
        if (questionData) {
            const allData = JSON.parse(questionData);
            this._questionContent = allData.questions;
        }
        this._endBtn = document.querySelector('#end-btn');
        this._actualPage = actualPage;
        this._maxPage = parseInt(getLocalStorageItem('question-length'));
        this._mainContainer = mainContainer;
        this._baseContainer = createElement('div', 'base-container');
        this._questionContentContainer = createElement('div', 'question-content');
        this._questionContainer = createElement('div', 'question-container');
        this._buttonsContainer = createElement('div', 'buttons-container');
        this._pageContainer = createElement('div', 'page-container');
        this._nextBtn = createElement('input', 'next', 'button', 'Next Question');
        this._prevBtn = createElement('input', 'back', 'button', 'Prev Question');
    }
    createPage() {
        this.bindHandlers();
        this._totalTimeCenterContainer.id = 'total-time-center-container';
        this._totalTimeContainer.id = 'total-time';
        this._totalTimeSpanContent.id = 'total-time-content';
        this._totalTimeSpan.id = 'total-time-span';
        //Total Time Div Create
        this._totalTimeSpanContent.innerHTML = 'Całkowity czas';
        this._totalTimeCenterContainer.append(this._totalTimeSpanContent, this._totalTimeSpan);
        this._totalTimeContainer.append(this._totalTimeCenterContainer);
        this._oneQuestionTimeContainer.id = 'one-question-time-container';
        this._oneQuestionTimeCenterContainer.id = 'one-question-center-container';
        this._oneQuestionTimeSpanContent.id = 'one-question-time-content';
        this._oneQuestionTimeSpan.id = 'one-question-time';
        this._oneQuestionTimeSpanContent.innerHTML = "Czas pytania";
        this._oneQuestionTimeCenterContainer.append(this._oneQuestionTimeSpanContent, this._oneQuestionTimeSpan);
        this._oneQuestionTimeContainer.append(this._oneQuestionTimeCenterContainer);
        this._endBtn.style.display = 'block';
        //Get index array from random index array in localStorage
        const currentRandomIndex = getLocalStorageItem('random-questions-index-array').split(',').map(Number);
        //Get actual index
        const currentIndex = parseInt(getLocalStorageItem('current-question-idx'));
        this._questionContentContainer.innerHTML = `${this._questionContent[currentRandomIndex[currentIndex]].question}`;
        this._pageContainer.innerHTML = `${currentIndex + 1} / ${this._maxPage}`;
        //Render questions - Inputs type radio
        new QuestionContentModule(this._questionContainer, this._endBtn).render();
        this._buttonsContainer.append(this._prevBtn, this._pageContainer, this._nextBtn);
        this._baseContainer.append(this._questionContentContainer, this._questionContainer, this._oneQuestionTimeContainer, this._totalTimeContainer, this._buttonsContainer);
        this.totalTimeCounter();
        this._oneQuestionTimera();
    }
    //Handlers
    bindHandlers() {
        this._nextBtn.addEventListener('click', (evt) => this.nextBtnHandler(evt));
        this._prevBtn.addEventListener('click', (evt) => this.prevBtnHandler(evt));
        document.addEventListener('keydown', (evt) => this.arrowsRightLeftKeyDownHandler(evt));
        document.addEventListener('keyup', (evt) => this.arrowsRightLeftKeyUpHandler(evt));
        this._endBtn.addEventListener('click', (evt) => this.endGameHandler(evt));
    }
    endGameHandler(evt) {
        const questionLength = parseInt(getLocalStorageItem('question-length'));
        const userAnswerLength = parseInt(getLocalStorageItem('answers-user-provided'));
        this._endBtn.style.display = 'none';
        if (questionLength === userAnswerLength) {
            this._againTest.style.display = 'block';
            window.clearInterval(this._totalTimeCounterId);
            window.clearInterval(this._oneQuestionTimeCounterId);
            this._mainContainer.innerHTML = '';
            new StatisticContentModule(document.querySelector('#main-container')).render();
        }
    }
    //Updates the current question number
    updatePage(actualPage) {
        this._pageContainer.innerHTML = `${actualPage} / ${this._maxPage}`;
    }
}
