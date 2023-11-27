import { BaseAbstractTemplate } from "../../baseTemplate/BaseAbstractTemplate.js";
import eventBus from "../../bus/EventBus.js";
import { StartGameEvent } from "../../events/StartGameEvent.js";
import { GameContentModule } from "../gameContentModule/GameContentModule.js";

export class StartPageModules extends BaseAbstractTemplate {

    private _testInfo: HTMLDivElement;
    private _mainContainer: HTMLDivElement;

    private _baseContainer: HTMLDivElement;
    private _usernameLabel: HTMLLabelElement;
    private _usernameNode: HTMLInputElement;
    private _startBtn: HTMLButtonElement;

    private boundEnterHandler: (evt: KeyboardEvent) => void;

    constructor(mainContainer: HTMLDivElement) {
        super();

        //Przypisanie enterHandlera do tej zmiennej, żeby sie dalo to potem remowowac
        //Bo jak sie nie remowuje to potem przy pytanach dalej ten Enter dziala
        this.boundEnterHandler = this.enterHandler.bind(this);

        this._mainContainer = mainContainer;

        //Inicjalizowanie zmiennych
        this._baseContainer = document.createElement('div');
        this._testInfo = document.createElement('div');
        this._usernameLabel = document.createElement('label');
        this._usernameNode = document.createElement('input');
        this._startBtn = document.createElement('button');

        //Tworzenie Handlerow
        this.bindHandlers();
    }

    bindHandlers(): void {
        this._startBtn.addEventListener('click', (evt: Event) => this.startBtnNodeHandler(evt));
        this._startBtn.addEventListener('start-game', () => this.loadGameContentHandler());

        document.addEventListener('keydown', this.boundEnterHandler);
        this._usernameNode.addEventListener('input', (evt: Event) => this.usernameNodeHandler(evt));
        eventBus.on('endGame', this.showStatistic);
    }

    //Tworzy strone
    render = (): void => {
        this.createPage();
        this._mainContainer.append(this._baseContainer);
    }

    //Też tworzy strone
    createPage(): void {
        this._testInfo.id = 'test-info';
        //FIXME: I need some resolution because this text is not showing on this container and I did not why
        this._testInfo.innerHTML = JSON.stringify(this.parseFileToString());
        
        this._usernameLabel.id = 'user-name';
        this._usernameLabel.innerHTML = 'Podaj nazwę użytkownika'

        this._usernameNode.id = 'user-name-input';
        this._usernameNode.placeholder = 'Username';

        this._startBtn.id = 'start';
        this._startBtn.innerHTML = 'Rozpocznij Test';

        this._mainContainer.append(this._testInfo, this._usernameLabel, this._usernameNode, this._startBtn);
        }

    //It is working and this function read text from file
    public async parseFileToString(): Promise<string> {
        //FIXME: It needs to fix path for file
        const textFromFile = JSON.stringify(this.readTestInfoFile("http://127.0.0.1:5501/public/data/testInfo.txt"));
        console.log("xd")
        return textFromFile;
    }

    //Reading text about test from file
    public async readTestInfoFile(file: string): Promise<string> {
        return new Promise((resolve, reject) => {
            let testInfoFile = new XMLHttpRequest();
            testInfoFile.open("GET", file, true);
            testInfoFile.onreadystatechange = function () {
                if (testInfoFile.readyState === 4) {
                    if (testInfoFile.status === 200 || testInfoFile.status === 0) {
                        const text: string = testInfoFile.responseText;
                        console.log(text);
                    }
                }
            };

            testInfoFile.send(null);
        })
    }

    //Adding username to localStorage
    public saveUserNameToLocalStorage(): string {
        const userNameInputValue = this._usernameNode.value;

        localStorage.setItem('username', userNameInputValue);

        return userNameInputValue;
    }

    //Handlers
    private startBtnNodeHandler = (evt: Event): void => {

        if (this._startBtn.classList.contains('start-enable')) {
            this._startBtn.dispatchEvent(new StartGameEvent('start-game'));
            this.saveUserNameToLocalStorage();
        }
        else {
            //Dodaje czerwoną ramke do labela z username
            //jak użytkownik kliknie se entera ale nie poda username
            this._usernameNode.style.border = '2px solid red'
        }
    }

    //Czysci main content i ładuje gameContent
    private loadGameContentHandler() {
        this._mainContainer.innerHTML = '';
        new GameContentModule(this._mainContainer, 1, 7).render();
    }

    private usernameNodeHandler(evt: Event) {
        //Dodaje/Usuwa efekt odblokowania przycisku
        //Dodaje/Usuwa czerwoną/zieloną ramkę przy input username
        if (this._usernameNode.value.length > 0) {
            this._startBtn.classList.add('start-enable');
            this._usernameNode.style.border = '2px solid green';
        } else {
            this._startBtn.classList.remove('start-enable');
            this._usernameNode.style.border = '2px solid red';
        }
    }

    //Dodaje obsługe entera
    private enterHandler(evt: KeyboardEvent) {
        if (evt.code.toLowerCase() === 'Enter'.toLocaleLowerCase() && this._usernameNode.value != '') {
            this._startBtn.dispatchEvent(new Event('click'))
            document.removeEventListener('keydown', this.boundEnterHandler);
        } else {
            this._usernameNode.style.border = '2px solid red';
        }
    }

    public showStatistic(evt: CustomEvent) {
        //Kończy gre 
        //i wyswietla statystyki(Jeszcze ich nie wyświetla bo zapierdol w robocie i nie dodałem XD)
        (evt.detail.mainContainer as HTMLDivElement).innerHTML = '';
    }
}