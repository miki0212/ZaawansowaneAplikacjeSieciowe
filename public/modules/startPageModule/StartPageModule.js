import { BaseAbstractTemplate } from "../../baseTemplate/BaseAbstractTemplate.js";
import eventBus from "../../bus/EventBus.js";
import { StartGameEvent } from "../../events/StartGameEvent.js";
import { GameContentModule } from "../gameContentModule/GameContentModule.js";
export class StartPageModules extends BaseAbstractTemplate {
    constructor(mainContainer) {
        super();
        //Tworzy strone
        this.render = () => {
            this.createPage();
            this._mainContainer.append(this._baseContainer);
        };
        //Handlers
        this.startBtnNodeHandler = (evt) => {
            if (this._startBtn.classList.contains('start-enable')) {
                this._startBtn.dispatchEvent(new StartGameEvent('start-game'));
                this.saveUserNameToLocalStorage();
            }
            else {
                //Dodaje czerwoną ramke do labela z username
                //jak użytkownik kliknie se entera ale nie poda username
                this._usernameNode.style.border = '2px solid red';
            }
        };
        //Przypisanie enterHandlera do tej zmiennej, żeby sie dalo to potem remowowac
        //Bo jak sie nie remowuje to potem przy pytanach dalej ten Enter dziala
        this.boundEnterHandler = this.enterHandler.bind(this);
        this._mainContainer = mainContainer;
        //Inicjalizowanie zmiennych
        this._baseContainer = document.createElement('div');
        this._usernameLabel = document.createElement('label');
        this._usernameNode = document.createElement('input');
        this._startBtn = document.createElement('button');
        //Tworzenie Handlerow
        this.bindHandlers();
    }
    bindHandlers() {
        this._startBtn.addEventListener('click', (evt) => this.startBtnNodeHandler(evt));
        this._startBtn.addEventListener('start-game', () => this.loadGameContentHandler());
        document.addEventListener('keydown', this.boundEnterHandler);
        this._usernameNode.addEventListener('input', (evt) => this.usernameNodeHandler(evt));
        eventBus.on('endGame', this.showStatistic);
    }
    //Też tworzy strone
    createPage() {
        this._usernameLabel.id = 'user-name';
        this._usernameLabel.innerHTML = 'Podaj nazwę użytkownika';
        this._usernameNode.id = 'user-name-input';
        this._usernameNode.placeholder = 'Username';
        this._startBtn.id = 'start';
        this._startBtn.innerHTML = 'Rozpocznij Test';
        this._mainContainer.append(this._usernameLabel, this._usernameNode, this._startBtn);
    }
    //Adding username to localStorage
    saveUserNameToLocalStorage() {
        const userNameInputValue = this._usernameNode.value;
        localStorage.setItem('username', userNameInputValue);
        return userNameInputValue;
    }
    //Czysci main content i ładuje gameContent
    loadGameContentHandler() {
        this._mainContainer.innerHTML = '';
        new GameContentModule(this._mainContainer, 1, 7).render();
    }
    usernameNodeHandler(evt) {
        //Dodaje/Usuwa efekt odblokowania przycisku
        //Dodaje/Usuwa czerwoną/zieloną ramkę przy input username
        if (this._usernameNode.value.length > 0) {
            this._startBtn.classList.add('start-enable');
            this._usernameNode.style.border = '2px solid green';
        }
        else {
            this._startBtn.classList.remove('start-enable');
            this._usernameNode.style.border = '2px solid red';
        }
    }
    //Dodaje obsługe entera
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
        //Kończy gre 
        //i wyswietla statystyki(Jeszcze ich nie wyświetla bo zapierdol w robocie i nie dodałem XD)
        evt.detail.mainContainer.innerHTML = '';
    }
}
