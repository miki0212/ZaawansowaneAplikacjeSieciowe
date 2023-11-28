import { BaseAbstractTemplate } from "../../baseTemplate/BaseAbstractTemplate";
import { createElement } from "../../createElements/CreateElements";
export class GameContentModule extends BaseAbstractTemplate {
    constructor(mainContainer) {
        super();
        this.render = () => {
            this._mainContainer.innerHTML = '';
            this._mainContainer.append(this._questionContainer);
        };
        this._mainContainer = mainContainer;
        this._questionContainer = createElement('div', 'question-container');
        this._buttonsContainer = createElement('div', 'buttons-container');
        this._pageContainer = createElement('div', 'page-container');
        this._nextBtn = createElement('input', 'next-btn', 'button', 'Next Question');
        this._prevBtn = createElement('input', 'prev-btn', 'button', 'Prev Question');
        this.createPage();
    }
    //Abstract Functions
    bindHandlers() {
    }
    createPage() {
        this.bindHandlers();
        _buttonsContainer;
        this._questionContainer.id = 'question-container';
        //Buttons
        this._nextBtn.id;
    }
}
