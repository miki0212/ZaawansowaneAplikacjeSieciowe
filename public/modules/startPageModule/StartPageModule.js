import { BaseAbstractTemplate } from "../../baseTemplate/BaseAbstractTemplate.js";
import eventBus from "../../bus/EventBus.js";
import { StartGameEvent } from "../../events/StartGameEvent.js";
import { GameContentModule } from "../gameContentModule/GameContentModule.js";
export class StartPageModules extends BaseAbstractTemplate {
    constructor(mainContainer) {
        super();
        this.render = () => {
            this._mainContainer.append(this._baseContainer);
        };
        //Handlers
        this.startBtnNodeHandler = (evt) => {
            if (this._startBtn.classList.contains('start-enable')) {
                this._startBtn.dispatchEvent(new StartGameEvent('start-game'));
            }
            else {
                this._usernameNode.style.border = '2px solid red';
            }
        };
        this.boundEnterHandler = this.enterHandler.bind(this);
        this._mainContainer = mainContainer;
        this._baseContainer = document.createElement('div');
        this._usernameLabel = document.createElement('label');
        this._usernameLabel.id = 'user-name';
        this._usernameLabel.innerHTML = 'Podaj nazwę użytkownika';
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
    bindHandlers() {
        this._startBtn.addEventListener('click', (evt) => this.startBtnNodeHandler(evt));
        this._startBtn.addEventListener('start-game', () => this.loadGameContentHandler());
        document.addEventListener('keydown', this.boundEnterHandler);
        this._usernameNode.addEventListener('input', (evt) => this.usernameNodeHandler(evt));
        eventBus.on('endGame', this.showStatistic);
    }
    createPage() {
        this._mainContainer.append(this._usernameLabel, this._usernameNode, this._startBtn);
    }
    loadGameContentHandler() {
        this._mainContainer.innerHTML = '';
        console.log('Game Started');
        new GameContentModule(this._mainContainer, 1, 7).render();
    }
    usernameNodeHandler(evt) {
        if (this._usernameNode.value.length > 0) {
            this._startBtn.classList.add('start-enable');
            this._usernameNode.style.border = '2px solid green';
        }
        else {
            this._startBtn.classList.remove('start-enable');
            this._usernameNode.style.border = '2px solid red';
        }
    }
    enterHandler(evt) {
        if (evt.code.toLowerCase() === 'Enter'.toLocaleLowerCase() && this._usernameNode.value != '') {
            this._startBtn.dispatchEvent(new Event('click'));
            document.removeEventListener('keydown', this.boundEnterHandler);
        }
        else {
            this._usernameNode.style.border = '2px solid red';
        }
    }
    showStatistic(evt) {
        evt.detail.mainContainer.innerHTML = ''; //Kończy gre i wyswietla statystyki
    }
}
