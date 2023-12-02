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

    bindHandlers(): void {
        this._startBtn.addEventListener('click', (evt: Event) => this.startBtnNodeHandler(evt));
        this._startBtn.addEventListener('start-game', () => this.loadGameContentHandler());
        this._showInfoButton.addEventListener('click', (evt: Event) => this.showInfoContentHandler(evt));
        this._exitInfoButton.addEventListener('click', (evt: Event) => this.exitInfoContentHandler(evt));

        document.addEventListener('keydown', this.boundEnterHandler);
        this._usernameNode.addEventListener('input', (evt: Event) => this.usernameNodeHandler(evt));
        eventBus.on('endGame', this.showStatistic);
    }

    render = (): void => {
        this.createPage();
        this._mainContainer.append(this._baseContainer);
    }

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

    private startBtnNodeHandler = (evt: Event): void => {

        if (this._startBtn.classList.contains('start-enable')) {
            this._startBtn.dispatchEvent(new StartGameEvent('start-game'));
            this.saveUserNameToLocalStorage();
        }
        else {
            //Adds a red frame to the label with username when the user clicks enter but does not provide username
            this._usernameNode.style.border = '2px solid red'
        }
    }

    //Clear main content and load gameContent
    private loadGameContentHandler() {
        this._mainContainer.innerHTML = '';
        new GameContentModule(this._mainContainer, 1, 7).render();
    }

    private usernameNodeHandler(evt: Event) {
        //Add/remove button unlock effect
        //Add color frame in input username
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
        //End game and display statistics
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