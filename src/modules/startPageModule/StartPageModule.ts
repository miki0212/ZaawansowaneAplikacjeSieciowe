import { BaseAbstractTemplate } from "../../baseTemplate/BaseAbstractTemplate";


export class StartPageModules extends BaseAbstractTemplate {
    private baseContainer: HTMLDivElement;
    private usernameNode: HTMLInputElement;
    private startBtn: HTMLInputElement;

    constructor() {
        super();
        this.baseContainer = document.createElement('div');
        this.usernameNode = document.createElement('input');
        this.startBtn = document.createElement('input');

        this.createPage();
    }

    bindHandlers(): void {
        this.startBtn.addEventListener('click', (evt: Event) => this.startBtnNodeHandler(evt))

    }


    render = (mainCointainer: HTMLDivElement): void => {
        mainCointainer.append(this.baseContainer);
    }

    createPage(): void {
        this.baseContainer.append(this.usernameNode, this.startBtn);
    }

    //Handlers
    private startBtnNodeHandler = (evt: Event): void => {

    }


}