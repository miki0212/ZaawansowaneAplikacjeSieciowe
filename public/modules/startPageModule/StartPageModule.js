import { BaseAbstractTemplate } from "../../baseTemplate/BaseAbstractTemplate";
export class StartPageModules extends BaseAbstractTemplate {
    constructor() {
        super();
        this.render = (mainCointainer) => {
            mainCointainer.append(this.baseContainer);
        };
        //Handlers
        this.startBtnNodeHandler = (evt) => {
        };
        this.baseContainer = document.createElement('div');
        this.usernameNode = document.createElement('input');
        this.startBtn = document.createElement('input');
        this.createPage();
    }
    bindHandlers() {
        this.startBtn.addEventListener('click', (evt) => this.startBtnNodeHandler(evt));
    }
    createPage() {
        this.baseContainer.append(this.usernameNode, this.startBtn);
    }
}
