import { BaseAbstractTemplate } from "../../baseTemplate/BaseAbstractTemplate.js";
import { createElement } from "../../createElements/CreateElements.js";

import testData from "../../data/questions-data.js";
import { IQuestionDataArray } from "../../interface/IQuestionDataArray.js";
import { IQuestions } from "../../interface/IQuestions.js";
import * as LocalStorageInitializ from "../../localStorageItems/LocalStorageInitialize.js";
import { getLocalStorageItem, setLocalStorageItem } from "../../localStorageItems/LocalStorageItems.js";
import { QuestionContentModule } from "../questionContentModule.ts/QuestionContentModule.js";



export class GameContentModule extends BaseAbstractTemplate {
    private _mainContainer: HTMLDivElement;

    private _baseContainer: HTMLDivElement;
    private _questionContainer: HTMLDivElement;
    private _buttonsContainer: HTMLDivElement;
    private _pageContainer: HTMLDivElement;
    private _questionContentContainer: HTMLDivElement;
    private _endBtn: HTMLButtonElement;

    private _nextBtn: HTMLInputElement;
    private _prevBtn: HTMLInputElement;

    private _actualPage: number;
    private _maxPage: number;

    private _questionContent!: IQuestionDataArray[];

    // private _questionArray: IQuestionDataArray[];

    //TODO : Dodac przekazywanie aktualnego pytania w konstruktorze
    constructor(mainContainer: HTMLDivElement, actualPage: number, maxPage: number) {
        super();

        LocalStorageInitializ.localStoriageInitialize('xyz');


        const questionData = getLocalStorageItem('question-data');
        if (questionData) {
            const allData: IQuestions = (JSON.parse(questionData) as IQuestions);
            this._questionContent = allData.questions;
            console.log(this._questionContent)
        }

        this._endBtn = document.querySelector('#end-btn') as HTMLButtonElement;
        // this._endBtn.id = 'end';
        // this._endBtn.innerHTML = 'Zakończ Test';

        // console.log(this._questionContent)

        this._actualPage = actualPage;
        this._maxPage = parseInt(getLocalStorageItem('question-length'));

        this._mainContainer = mainContainer;

        this._baseContainer = createElement('div', 'base-container') as HTMLDivElement;
        this._questionContentContainer = createElement('div', 'question-content') as HTMLDivElement;
        this._questionContainer = createElement('div', 'question-container') as HTMLDivElement;
        this._buttonsContainer = createElement('div', 'buttons-container') as HTMLDivElement;
        this._pageContainer = createElement('div', 'page-container') as HTMLDivElement;

        this._nextBtn = createElement('input', 'next', 'button', 'Next Question') as HTMLInputElement;
        this._prevBtn = createElement('input', 'back', 'button', 'Prev Question') as HTMLInputElement;

        this.createPage();
    }

    render = () => {
        this._mainContainer.innerHTML = '';
        this._mainContainer.append(this._baseContainer);
    }

    //Abstract Functions
    bindHandlers(): void {
        this._nextBtn.addEventListener('click', (evt: Event) => this.nextBtnHandler(evt))
        this._prevBtn.addEventListener('click', (evt: Event) => this.prevBtnHandler(evt))
    }

    createPage(): void {

        this._endBtn.style.display = 'block';

        const currentRandomIndex: number[] = getLocalStorageItem('random-questions-index-array').split(',').map(Number);

        this.bindHandlers();

        const currentIndex: number = parseInt(getLocalStorageItem('current-question-idx'));

        this._questionContentContainer.innerHTML = `${this._questionContent[currentRandomIndex[currentIndex]].question}`

        this._pageContainer.innerHTML = `${currentIndex + 1} / ${this._maxPage}`
        new QuestionContentModule(this._questionContainer, this._endBtn).render();

        this._buttonsContainer.append(this._prevBtn, this._pageContainer, this._nextBtn);
        this._baseContainer.append(this._questionContentContainer, this._questionContainer, this._buttonsContainer);

        console.log(this._baseContainer)

        //Buttons
        this._nextBtn.id;
    }

    private nextBtnHandler = (evt: Event): void => {
        const currentRandomIndex: number[] = getLocalStorageItem('random-questions-index-array').split(',').map(Number);
        const currentIndex: number = parseInt(getLocalStorageItem('current-question-idx'));

        if (currentIndex != this._maxPage - 1) {
            this.updatePage(currentIndex + 2);
            console.log('Random Index' + currentRandomIndex[currentIndex + 2])
            setLocalStorageItem('current-question-idx', (currentIndex + 1).toString());
            this._questionContentContainer.innerHTML = `${this._questionContent[currentRandomIndex[currentIndex + 1]].question}`

            new QuestionContentModule(this._questionContainer, this._endBtn).render();
        }
    }

    private prevBtnHandler = (evt: Event): void => {
        const currentRandomIndex: number[] = getLocalStorageItem('random-questions-index-array').split(',').map(Number);
        const currentIndex: number = parseInt(getLocalStorageItem('current-question-idx'));

        if (currentIndex - 1 >= 0) {
            this.updatePage(currentIndex);
            setLocalStorageItem('current-question-idx', (currentIndex - 1).toString());
            this._questionContentContainer.innerHTML = `${this._questionContent[currentRandomIndex[currentIndex - 1]].question}`

            new QuestionContentModule(this._questionContainer, this._endBtn).render();
        }
    }

    private updatePage(actualPage: number) {
        console.log(actualPage)
        this._pageContainer.innerHTML = `${actualPage} / ${this._maxPage}`;
    }
}

//TEMPLATE
/** 
<div id=""main-container>
    <div id='question-container'>
        <div id='question-title'>
            Some Title
        </div>
        <div id='answers-container'>
            <div id='answer-option'>
                Option 1
            </div>
        </div>
    </div>
</div>
*/