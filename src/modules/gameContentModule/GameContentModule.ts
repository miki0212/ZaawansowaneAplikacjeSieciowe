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

    private _nextBtn: HTMLInputElement;
    private _prevBtn: HTMLInputElement;

    private _actualPage: number;
    private _maxPage: number;

    // private _questionArray: IQuestionDataArray[];

    //TODO : Dodac przekazywanie aktualnego pytania w konstruktorze
    constructor(mainContainer: HTMLDivElement, actualPage: number, maxPage: number) {
        super();

        LocalStorageInitializ.localStoriageInitialize('xyz');

        this._actualPage = actualPage;
        this._maxPage = parseInt(getLocalStorageItem('question-length'));

        this._mainContainer = mainContainer;

        this._baseContainer = createElement('div', 'base-container') as HTMLDivElement;
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
        this.bindHandlers();

        const currentIndex: number = parseInt(getLocalStorageItem('current-question-idx'));
        this._pageContainer.innerHTML = `${currentIndex + 1} / ${this._maxPage}`
        new QuestionContentModule(this._questionContainer).render();

        this._buttonsContainer.append(this._prevBtn, this._pageContainer, this._nextBtn);
        this._baseContainer.append(this._questionContainer, this._buttonsContainer);


        console.log(this._baseContainer)

        //Buttons
        this._nextBtn.id;
    }

    private nextBtnHandler = (evt: Event): void => {
        const currentIndex: number = parseInt(getLocalStorageItem('current-question-idx'));
        if (currentIndex != this._maxPage - 1) {
            this.updatePage(currentIndex + 2);
            setLocalStorageItem('current-question-idx', (currentIndex + 1).toString());
            // new GameContentModule(this._mainContainer, this._actualPage + 1, 7).render();
            new QuestionContentModule(this._questionContainer).render();
        }
    }

    private prevBtnHandler = (evt: Event): void => {
        const currentIndex: number = parseInt(getLocalStorageItem('current-question-idx'));
        if (currentIndex - 1 >= 0) {
            this.updatePage(currentIndex);
            setLocalStorageItem('current-question-idx', (currentIndex - 1).toString());
            // new GameContentModule(this._mainContainer, this._actualPage - 1, 7).render();
            new QuestionContentModule(this._questionContainer).render();
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