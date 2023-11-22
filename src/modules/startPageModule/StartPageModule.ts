import { BaseAbstractTemplate } from "../../baseTemplate/BaseAbstractTemplate.js";
import eventBus from "../../bus/EventBus.js";
import { StartGameEvent } from "../../events/StartGameEvent.js";
import { GameContentModule } from "../gameContentModule/GameContentModule.js";


export class StartPageModules extends BaseAbstractTemplate {
    private _mainContainer: HTMLDivElement;
    private _baseContainer: HTMLDivElement;
    private _usernameLabel: HTMLLabelElement;

    private _usernameNode: HTMLInputElement;

    private _startBtn: HTMLButtonElement;

    private boundEnterHandler: (evt: KeyboardEvent) => void;

    constructor(mainContainer: HTMLDivElement) {
        super();

        this.boundEnterHandler = this.enterHandler.bind(this);

        this._mainContainer = mainContainer;
        this._baseContainer = document.createElement('div');

        this._usernameLabel = document.createElement('label');
        this._usernameLabel.id = 'user-name';
        this._usernameLabel.innerHTML = 'Podaj nazwę użytkownika'

        this._usernameNode = document.createElement('input');
        this._usernameNode.id = 'user-name-input';
        this._usernameNode.placeholder = 'Username';

        this._startBtn = document.createElement('button');
        this._startBtn.id = 'start';
        // this._startBtn.type = 'button';
        this._startBtn.innerHTML = 'Rozpocznij Test';

        // this._startBtn.disabled = true;
        this.bindHandlers();
        this.createPage();

    }

    bindHandlers(): void {
        this._startBtn.addEventListener('click', (evt: Event) => this.startBtnNodeHandler(evt));
        this._startBtn.addEventListener('start-game', () => this.loadGameContentHandler());

        document.addEventListener('keydown', this.boundEnterHandler)

        this._usernameNode.addEventListener('input', (evt: Event) => this.usernameNodeHandler(evt))

        eventBus.on('endGame', this.showStatistic)
    }

    render = (): void => {
        this._mainContainer.append(this._baseContainer);
    }

    createPage(): void {
        this._mainContainer.append(this._usernameLabel, this._usernameNode, this._startBtn);
    }

    //Handlers
    private startBtnNodeHandler = (evt: Event): void => {
        if (this._startBtn.classList.contains('start-enable')) {
            this._startBtn.dispatchEvent(new StartGameEvent('start-game'));
        }
        else {
            this._usernameNode.style.border = '2px solid red'
        }
    }

    private loadGameContentHandler() {
        this._mainContainer.innerHTML = '';
        console.log('Game Started')
        new GameContentModule(this._mainContainer, 1, 7).render();
    }

    private usernameNodeHandler(evt: Event) {
        if (this._usernameNode.value.length > 0) {
            this._startBtn.classList.add('start-enable');
            this._usernameNode.style.border = '2px solid green';
        } else {
            this._startBtn.classList.remove('start-enable');
            this._usernameNode.style.border = '2px solid red';
        }
    }

    private enterHandler(evt: KeyboardEvent) {
        if (evt.code.toLowerCase() === 'Enter'.toLocaleLowerCase() && this._usernameNode.value != '') {
            this._startBtn.dispatchEvent(new Event('click'))
            document.removeEventListener('keydown', this.boundEnterHandler);
        } else {
            this._usernameNode.style.border = '2px solid red';
        }
    }

    public showStatistic(evt: CustomEvent) {
        (evt.detail.mainContainer as HTMLDivElement).innerHTML = ''//Kończy gre i wyswietla statystyki
    }
}