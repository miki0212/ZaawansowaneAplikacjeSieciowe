var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseAbstractTemplate } from "../../baseTemplate/BaseAbstractTemplate.js";
import eventBus from "../../bus/EventBus.js";
import { StartGameEvent } from "../../events/StartGameEvent.js";
import { setLocalStorageItem } from "../../localStorageItems/LocalStorageItems.js";
import { GameContentModule } from "../gameContentModule/GameContentModule.js";
export class StartPageModules extends BaseAbstractTemplate {
    constructor(mainContainer) {
        super();
        this.render = () => {
            this.createPage();
            this._mainContainer.append(this._baseContainer);
        };
        this.startBtnNodeHandler = (evt) => {
            if (this._startBtn.classList.contains('start-enable')) {
                this._startBtn.dispatchEvent(new StartGameEvent('start-game'));
                this.saveUserNameToLocalStorage();
            }
            else {
                //Adds a red frame to the label with username when the user clicks enter but does not provide username
                this._usernameNode.style.border = '2px solid red';
            }
        };
        //Assigning enterHandler to a variable so that it can be removed - if not, enter works when prompted
        this.boundEnterHandler = this.enterHandler.bind(this);
        this._mainContainer = mainContainer;
        this._mainContainer.innerHTML = '';
        this._baseContainer = document.createElement('div');
        this._testInfo = document.createElement('div');
        this._usernameLabel = document.createElement('label');
        this._usernameNode = document.createElement('input');
        this._startBtn = document.createElement('button');
        this._showInfoButton = document.createElement('button');
        this._exitInfoButton = document.createElement('button');
        this.bindHandlers();
    }
    bindHandlers() {
        this._startBtn.addEventListener('click', (evt) => this.startBtnNodeHandler(evt));
        this._startBtn.addEventListener('start-game', () => this.loadGameContentHandler());
        this._showInfoButton.addEventListener('click', (evt) => this.showInfoContentHandler(evt));
        this._exitInfoButton.addEventListener('click', (evt) => this.exitInfoContentHandler(evt));
        document.addEventListener('keydown', this.boundEnterHandler);
        this._usernameNode.addEventListener('input', (evt) => this.usernameNodeHandler(evt));
        eventBus.on('endGame', this.showStatistic);
    }
    createPage() {
        return __awaiter(this, void 0, void 0, function* () {
            this._testInfo.id = 'test-info';
            const textFromFile = (yield this.readTestInfoFile("http://127.0.0.1:5501/public/data/testInfo.txt"));
            for (let i = 0; i < textFromFile.length; i++) {
                const p = document.createElement('p');
                p.innerHTML = textFromFile[i];
                p.id = 'test-info-p';
                this._testInfo.append(p);
            }
            this._usernameLabel.id = 'user-name';
            this._usernameLabel.innerHTML = 'Podaj nazwę użytkownika';
            this._usernameNode.id = 'user-name-input';
            this._usernameNode.placeholder = 'Username';
            this._startBtn.id = 'start';
            this._startBtn.innerHTML = 'Rozpocznij Test';
            this._showInfoButton.id = 'show-info-startPage';
            this._showInfoButton.innerHTML = "Informacje o teście";
            this._testInfo.style.display = "none";
            this._mainContainer.append(this._testInfo, this._usernameLabel, this._usernameNode, this._startBtn, this._showInfoButton);
            this._exitInfoButton.id = 'exit-info-startPage';
            this._exitInfoButton.innerHTML = "Zamknij";
            this._testInfo.append(this._exitInfoButton);
        });
    }
    //Reading text about test from file
    readTestInfoFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let testInfoFile = new XMLHttpRequest();
                testInfoFile.open("GET", file, true);
                testInfoFile.onreadystatechange = function () {
                    if (testInfoFile.readyState === 4) {
                        if (testInfoFile.status === 200 || testInfoFile.status === 0) {
                            const text = testInfoFile.responseText.split('//');
                            resolve(text);
                        }
                        else {
                            reject(new Error('Read from file is failed'));
                        }
                    }
                };
                testInfoFile.send(null);
            });
        });
    }
    //Adding username to localStorage
    saveUserNameToLocalStorage() {
        const userNameInputValue = this._usernameNode.value;
        setLocalStorageItem('username', userNameInputValue);
        return userNameInputValue;
    }
    //Clear main content and load gameContent
    loadGameContentHandler() {
        this._mainContainer.innerHTML = '';
        new GameContentModule(this._mainContainer, 1, 7).render();
    }
    usernameNodeHandler(evt) {
        //Add/remove button unlock effect
        //Add color frame in input username
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
        //End game and display statistics
        evt.detail.mainContainer.innerHTML = '';
    }
    //Show info button
    showInfoContentHandler(evt) {
        this._testInfo.style.display = "block";
    }
    exitInfoContentHandler(evt) {
        this._testInfo.style.display = "none";
    }
}
