import { BaseAbstractTemplate } from "../../baseTemplate/BaseAbstractTemplate.js";
import { createElement } from "../../createElements/CreateElements.js";
import * as LocalStorageInitializ from "../../localStorageItems/LocalStorageInitialize.js";
import { getLocalStorageItem, setLocalStorageItem } from "../../localStorageItems/LocalStorageItems.js";
import { QuestionContentModule } from "../questionContentModule.ts/QuestionContentModule.js";
export class GameContentModule extends BaseAbstractTemplate {
    // private _questionArray: IQuestionDataArray[];
    //TODO : Dodac przekazywanie aktualnego pytania w konstruktorze
    constructor(mainContainer, actualPage, maxPage) {
        super();
        this.render = () => {
            this._mainContainer.innerHTML = '';
            this._mainContainer.append(this._baseContainer);
        };
        this.nextBtnHandler = (evt) => {
            const currentIndex = parseInt(getLocalStorageItem('current-question-idx'));
            if (currentIndex != this._maxPage - 1) {
                this.updatePage(currentIndex + 2);
                setLocalStorageItem('current-question-idx', (currentIndex + 1).toString());
                // new GameContentModule(this._mainContainer, this._actualPage + 1, 7).render();
                new QuestionContentModule(this._questionContainer).render();
            }
        };
        this.prevBtnHandler = (evt) => {
            const currentIndex = parseInt(getLocalStorageItem('current-question-idx'));
            if (currentIndex - 1 >= 0) {
                this.updatePage(currentIndex);
                setLocalStorageItem('current-question-idx', (currentIndex - 1).toString());
                // new GameContentModule(this._mainContainer, this._actualPage - 1, 7).render();
                new QuestionContentModule(this._questionContainer).render();
            }
        };
        LocalStorageInitializ.localStoriageInitialize('xyz');
        this._actualPage = actualPage;
        this._maxPage = parseInt(getLocalStorageItem('question-length'));
        this._mainContainer = mainContainer;
        this._baseContainer = createElement('div', 'base-container');
        this._questionContainer = createElement('div', 'question-container');
        this._buttonsContainer = createElement('div', 'buttons-container');
        this._pageContainer = createElement('div', 'page-container');
        this._nextBtn = createElement('input', 'next', 'button', 'Next Question');
        this._prevBtn = createElement('input', 'back', 'button', 'Prev Question');
        this.createPage();
    }
    //Abstract Functions
    bindHandlers() {
        this._nextBtn.addEventListener('click', (evt) => this.nextBtnHandler(evt));
        this._prevBtn.addEventListener('click', (evt) => this.prevBtnHandler(evt));
    }
    createPage() {
        this.bindHandlers();
        const currentIndex = parseInt(getLocalStorageItem('current-question-idx'));
        this._pageContainer.innerHTML = `${currentIndex + 1} / ${this._maxPage}`;
        new QuestionContentModule(this._questionContainer).render();
        this._buttonsContainer.append(this._prevBtn, this._pageContainer, this._nextBtn);
        this._baseContainer.append(this._questionContainer, this._buttonsContainer);
        console.log(this._baseContainer);
        //Buttons
        this._nextBtn.id;
    }
    updatePage(actualPage) {
        console.log(actualPage);
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
