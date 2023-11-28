import { BaseAbstractTemplate } from "../../baseTemplate/BaseAbstractTemplate.js";
import eventBus from "../../bus/EventBus.js";
import { StartGameEvent } from "../../events/StartGameEvent.js";
import { setLocalStorageItem } from "../../localStorageItems/LocalStorageItems.js";
import { GameContentModule } from "../gameContentModule/GameContentModule.js";

export class StartPageModules extends BaseAbstractTemplate {

    private _testInfo: HTMLDivElement;
    private _mainContainer: HTMLDivElement;

    private _baseContainer: HTMLDivElement;
    private _usernameLabel: HTMLLabelElement;
    private _usernameNode: HTMLInputElement;
    private _startBtn: HTMLButtonElement;
    private _showInfoButton: HTMLButtonElement;
    private _exitInfoButton: HTMLButtonElement;

    private boundEnterHandler: (evt: KeyboardEvent) => void;

    constructor(mainContainer: HTMLDivElement) {
        super();

        //Przypisanie enterHandlera do tej zmiennej, żeby sie dalo to potem remowowac
        //Bo jak sie nie remowuje to potem przy pytanach dalej ten Enter dziala
        this.boundEnterHandler = this.enterHandler.bind(this);

        this._mainContainer = mainContainer;
        this._mainContainer.innerHTML = '';

        //Inicjalizowanie zmiennych
        this._baseContainer = document.createElement('div');
        this._testInfo = document.createElement('div');
        this._usernameLabel = document.createElement('label');
        this._usernameNode = document.createElement('input');
        this._startBtn = document.createElement('button');

        this._showInfoButton = document.createElement('button');
        this._exitInfoButton = document.createElement('button');

        //Tworzenie Handlerow
        this.bindHandlers();
    }

    bindHandlers(): void {
        this._startBtn.addEventListener('click', (evt: Event) => this.startBtnNodeHandler(evt));
        this._startBtn.addEventListener('start-game', () => this.loadGameContentHandler());
        this._showInfoButton.addEventListener('click', (evt: Event) => this.showInfoContentHandler(evt));
        this._exitInfoButton.addEventListener('click', (evt: Event) => this.exitInfoContentHandler(evt));

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
    async createPage() {
        this._testInfo.id = 'test-info';
        const textFromFile: string[] = (await this.readTestInfoFile("http://127.0.0.1:5501/public/data/testInfo.txt"));

        for (let i = 0; i < textFromFile.length; i++) {
            const p = document.createElement('p');
            p.innerHTML = textFromFile[i];
            p.id = 'test-info-p'
            this._testInfo.append(p);
        }

        this._usernameLabel.id = 'user-name';
        this._usernameLabel.innerHTML = 'Podaj nazwę użytkownika'

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
    }

    //Reading text about test from file
    public async readTestInfoFile(file: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            let testInfoFile = new XMLHttpRequest();
            testInfoFile.open("GET", file, true);
            testInfoFile.onreadystatechange = function () {
                if (testInfoFile.readyState === 4) {
                    if (testInfoFile.status === 200 || testInfoFile.status === 0) {
                        const text: string[] = testInfoFile.responseText.split('//');
                        resolve(text);
                        //Here text from file is reading and it is working
                        console.log(text);
                    } else {
                        reject(new Error('Read from file is failed'))
                    }
                }
            };

            testInfoFile.send(null);
        })
    }

    //Adding username to localStorage
    public saveUserNameToLocalStorage(): string {
        const userNameInputValue = this._usernameNode.value;

        setLocalStorageItem('username', userNameInputValue)

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

    //Show info button
    private showInfoContentHandler(evt: Event) {
        this._testInfo.style.display = "block";
    }

    private exitInfoContentHandler(evt: Event) {
        this._testInfo.style.display = "none";
    }
}