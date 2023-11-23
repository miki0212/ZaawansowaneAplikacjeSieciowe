import { BaseAbstractTemplate } from "../../baseTemplate/BaseAbstractTemplate.js";
import { createElement } from "../../createElements/CreateElements.js";
import { IQuestionDataArray } from "../../interface/IQuestionDataArray.js";
import { IQuestions } from "../../interface/IQuestions.js";
import { getLocalStorageItem, setLocalStorageItem } from "../../localStorageItems/LocalStorageItems.js";
import { QuestionContentModule } from "../questionContentModule.ts/QuestionContentModule.js";
import * as LocalStorageInitializ from "../../localStorageItems/LocalStorageInitialize.js";

//Magistrala
import eventBus from "../../bus/EventBus.js";


export class GameContentModule extends BaseAbstractTemplate {
    private _mainContainer: HTMLDivElement;

    private _baseContainer: HTMLDivElement;
    private _questionContainer: HTMLDivElement;
    private _buttonsContainer: HTMLDivElement;
    private _pageContainer: HTMLDivElement;
    private _questionContentContainer: HTMLDivElement;
    private _timeContainer: HTMLDivElement;
    private _totalTimeContainer: HTMLDivElement;
    private _totalTimeSpan: HTMLSpanElement;
    private _totalTimeSpanContent: HTMLSpanElement;

    private _nextBtn: HTMLInputElement;
    private _prevBtn: HTMLInputElement;
    private _endBtn: HTMLButtonElement;

    private _actualPage: number;
    private _maxPage: number;

    private _questionContent!: IQuestionDataArray[];

    private _totalTimeCounterId: number;

    //Handler Function Bind - Potrzebne, bo inaczej nie działa odłączanie Handlera, kij wie czemu
    // private boundEnterHandler: (evt: KeyboardEvent) => void;

    // private _questionArray: IQuestionDataArray[];

    constructor(mainContainer: HTMLDivElement, actualPage: number, maxPage: number) {
        super();

        this._totalTimeCounterId = 0;

        this._totalTimeSpan = document.createElement('span') as HTMLSpanElement;
        this._totalTimeSpanContent = document.createElement('span') as HTMLSpanElement;

        //FIXME : 'xyz' - trzeba usunąc argument tej funkcji bo raczej niepotrzebne
        LocalStorageInitializ.localStoriageInitialize('xyz');

        this._timeContainer = document.createElement('div') as HTMLDivElement;
        this._totalTimeContainer = document.createElement('div') as HTMLDivElement;

        const questionData = getLocalStorageItem('question-data');
        if (questionData) {
            const allData: IQuestions = (JSON.parse(questionData) as IQuestions);
            this._questionContent = allData.questions;
        }

        this._endBtn = document.querySelector('#end-btn') as HTMLButtonElement;

        this._actualPage = actualPage;
        this._maxPage = parseInt(getLocalStorageItem('question-length'));

        this._mainContainer = mainContainer;

        this._baseContainer = createElement('div', 'base-container') as HTMLDivElement;
        this._questionContentContainer = createElement('div', 'question-content') as HTMLDivElement;
        this._questionContainer = createElement('div', 'question-container') as HTMLDivElement;
        this._buttonsContainer = createElement('div', 'buttons-container') as HTMLDivElement;
        this._pageContainer = createElement('div', 'page-container') as HTMLDivElement;

        this._nextBtn = createElement('input', 'next', 'button', 'Next Question') as HTMLInputElement;
        this._prevBtn = createElement('input', 'back', 'button', 'Prev Question') as HTMLInputElement;


    }

    render = () => {
        this.createPage();
        this._mainContainer.innerHTML = '';
        this._mainContainer.append(this._baseContainer);
    }

    //Handlers - Takie coś do eventów
    bindHandlers(): void {
        this._nextBtn.addEventListener('click', (evt: Event) => this.nextBtnHandler(evt))
        this._prevBtn.addEventListener('click', (evt: Event) => this.prevBtnHandler(evt))
        document.addEventListener('keydown', (evt: KeyboardEvent) => this.arrowsRightLeftKeyDownHandler(evt))
        document.addEventListener('keyup', (evt: KeyboardEvent) => this.arrowsRightLeftKeyUpHandler(evt))
        this._endBtn.addEventListener('click', (evt: Event) => this.endGameHandler(evt))
    }

    createPage(): void {
        this.bindHandlers();
        this._timeContainer.innerHTML = '0';
        this._totalTimeContainer.innerHTML = '';

        this._totalTimeContainer.id = 'total-time';
        this._totalTimeSpanContent.id = 'total-time-content'

        //Total Time Div Create
        this._totalTimeSpanContent.innerHTML = 'Całkowity czas : ';
        this._totalTimeContainer.append(this._totalTimeSpanContent, this._totalTimeSpan)

        this._endBtn.style.display = 'block';

        //Pobiera tablice indeksow z tablicy randomowych indeksow w localStorage - Dziwnie to brzmi ale działa XD
        const currentRandomIndex: number[] = getLocalStorageItem('random-questions-index-array').split(',').map(Number);

        //Pobiera aktualny indeks
        const currentIndex: number = parseInt(getLocalStorageItem('current-question-idx'));

        this._questionContentContainer.innerHTML = `${this._questionContent[currentRandomIndex[currentIndex]].question}`
        this._pageContainer.innerHTML = `${currentIndex + 1} / ${this._maxPage}`

        //Renderuje pytania - Inputy typu radio
        new QuestionContentModule(this._questionContainer, this._endBtn).render();

        //Tworzy Kontener z przyciskami i numerem strony
        this._buttonsContainer.append(this._prevBtn, this._pageContainer, this._nextBtn);

        //Dodaje do base ccontainer to co wyrzej sie potworzyło , duzo tego nie chce mi się wymieniać
        this._baseContainer.append(this._questionContentContainer, this._questionContainer, this._totalTimeContainer, this._buttonsContainer);

        //Licznik czasu ogólnego
        this.totalTimeCounter();

        //FIXME: Trzeba dodać licznik czasu dla poszczególnego ale no zapierdol w robocie i jeszcze go ni ma :) XD
        //this.questionTimeCounter();

        //Buttons
        // this._nextBtn.id;
    }

    //Liczy łączny czas testu
    private totalTimeCounter = () => {
        let time = 0;
        this._totalTimeCounterId = window.setInterval(() => {
            //Dodaje do time 1 co ilość ms podaną poniżej
            time++;
            if (time % 10 === 0) {
                this._totalTimeSpan.innerHTML = `${time / 10}.0`;
            } else {
                this._totalTimeSpan.innerHTML = `${time / 10}`;
            }

            //Zapisuje czas do localStorage
            setLocalStorageItem('user-total-time', `${time}`);
        }, 100)
    }

    //Wczytuje pytanie po prawo
    private nextBtnHandler = (evt: Event): void => {
        const currentRandomIndex: number[] = getLocalStorageItem('random-questions-index-array').split(',').map(Number);
        const currentIndex: number = parseInt(getLocalStorageItem('current-question-idx'));

        if (currentIndex != this._maxPage - 1) {
            this.updatePage(currentIndex + 2);
            console.log('Random Index' + currentRandomIndex[currentIndex + 2])
            setLocalStorageItem('current-question-idx', (currentIndex + 1).toString());
            this._questionContentContainer.innerHTML = `${this._questionContent[currentRandomIndex[currentIndex + 1]].question}`

            new QuestionContentModule(this._questionContainer, this._endBtn).render();
        }
    }

    //Wczytuje pytanie po to drugie prawo XD
    private prevBtnHandler = (evt: Event): void => {
        const currentRandomIndex: number[] = getLocalStorageItem('random-questions-index-array').split(',').map(Number);
        const currentIndex: number = parseInt(getLocalStorageItem('current-question-idx'));

        if (currentIndex - 1 >= 0) {
            this.updatePage(currentIndex);
            setLocalStorageItem('current-question-idx', (currentIndex - 1).toString());
            this._questionContentContainer.innerHTML = `${this._questionContent[currentRandomIndex[currentIndex - 1]].question}`

            new QuestionContentModule(this._questionContainer, this._endBtn).render();
        }
    }

    //Pozwala na używanie strzałek podczas przełączania pytań i dodaje efekt hover
    private arrowsRightLeftKeyDownHandler = (evt: KeyboardEvent): void => {
        if (evt.code.toLocaleLowerCase() === 'ArrowLeft'.toLocaleLowerCase()) {
            this._prevBtn.style.background = '#b9bade86';
            this.prevBtnHandler(new Event('click'));
        } else if (evt.code.toLocaleLowerCase() === 'ArrowRight'.toLocaleLowerCase()) {
            this._nextBtn.style.background = '#b9bade86';
            this.nextBtnHandler(new Event('click'));
        }
    }

    //Zabiera efekt hover przy przełączaniu pytań
    private arrowsRightLeftKeyUpHandler = (evt: KeyboardEvent): void => {
        if (evt.code.toLocaleLowerCase() === 'ArrowLeft'.toLocaleLowerCase()) {
            this._prevBtn.style.background = '';
        } else if (evt.code.toLocaleLowerCase() === 'ArrowRight'.toLocaleLowerCase()) {
            this._nextBtn.style.background = '';
        }
    }

    //Kończy gre
    private endGameHandler(evt: Event) {
        const questionLength: number = parseInt(getLocalStorageItem('question-length'));
        const userAnswerLength: number = parseInt(getLocalStorageItem('answers-user-provided'));

        //Sprawdza czy użytkownik udzielił odpowiedzi na wszystkie pytania
        if (questionLength === userAnswerLength) {
            //Zatrzymuje licznik czasu
            window.clearInterval(this._totalTimeCounterId);

            //Wywołuje event endGame - który wczytuje okno statystyk(Bedzie dodane no ale no zapierdol w robocie)
            eventBus.dispatch('endGame', { mainContainer: this._mainContainer })
        }
    }

    //Aktualizuje aktualny numer pytania
    private updatePage(actualPage: number) {
        console.log(actualPage)
        this._pageContainer.innerHTML = `${actualPage} / ${this._maxPage}`;
    }
}

//TEMPLATE
/** 
<div id=""main-container>
    <div id='question-container'>
        <div id='question-title'>
            Some Title
        </div>
        <div id='answers-container'>
            <div id='answer-option'>
                Option 1
            </div>
        </div>
    </div>
</div>
*/