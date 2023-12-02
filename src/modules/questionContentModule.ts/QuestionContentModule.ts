import { BaseAbstractTemplate } from "../../baseTemplate/BaseAbstractTemplate.js";
import { createElement } from "../../createElements/CreateElements.js";
import { IAnswers } from "../../interface/IAnswers.js";
import { IQuestionDataArray } from "../../interface/IQuestionDataArray.js";
import { IQuestions } from "../../interface/IQuestions.js";
import { getLocalStorageItem, setLocalStorageItem } from "../../localStorageItems/LocalStorageItems.js";

export class QuestionContentModule extends BaseAbstractTemplate {
    private _questionContainer: HTMLDivElement;
    private _endBtn: HTMLButtonElement;

    private _answerContainer: HTMLDivElement[];
    private _answers: IAnswers[];

    private _userAnswerHelper: string;
    private _currentRandomIndex: number;
    private _currentIndex: number;

    private _question: IQuestionDataArray;
    private _allQuestions: IQuestions;

    private _oneQuestionTimerId: number;
    private _actualQuestionTime!: number;

    constructor(questionContainer: HTMLDivElement, endGame: HTMLButtonElement) {
        super();

        this._allQuestions = {} as IQuestions;
        this._question = {} as IQuestionDataArray;

        //Initialize timer id
        this._oneQuestionTimerId = 0;

        //This is probably remembered by the user who already has some question
        this._userAnswerHelper = '';

        this._endBtn = document.querySelector('#end-btn') as HTMLButtonElement;

        const l = parseInt(getLocalStorageItem('answers-user-provided'))
        const questionLength = parseInt(getLocalStorageItem('question-length'))

        if (l === questionLength) {

        } else {
            this._endBtn.style.display = 'none';
        }

        this._questionContainer = questionContainer;

        this._currentIndex = parseInt(getLocalStorageItem('current-question-idx'));
        this._currentRandomIndex = parseInt(getLocalStorageItem('random-questions-index-array').split(',')[this._currentIndex])

        const data = getLocalStorageItem('question-data');
        if (data) {
            this._allQuestions = (JSON.parse(data) as IQuestions);
            this._question = ((JSON.parse(data) as IQuestions).questions as IQuestionDataArray[])[this._currentRandomIndex];
            this._answers = this._question.answers;
        } else {
            this._answers = [];
        }
        this._answerContainer = [];
    }

    loadDataFromLocalStorage(data: string) {
        if (data) {
            this._allQuestions = JSON.parse(data);
            this._question = JSON.parse(data).questions[this._currentRandomIndex];
            this._answers = this._question.answers;
        }
        else {
            this._answers = [];
        }
    }

    render = () => {
        this._questionContainer.innerHTML = '';
        this.createPage();
    }

    bindHandlers(): void {
        throw new Error("Method not implemented")
    }

    createPage(): void {
        //Answers Container
        for (let i = 0; i < 4; i++) {
            this._answerContainer.push(createElement('div', 'answer') as HTMLDivElement);
        }

        this._answerContainer.forEach((item, index) => {
            const radioBtnAnswer = createElement('input', `answer-${index}`, 'radio', `${this._answers[index].content}`) as HTMLInputElement;
            const radioBtnAnswerLabel = document.createElement('label') as HTMLLabelElement;

            radioBtnAnswer.name = `answer-radio-group`;
            radioBtnAnswerLabel.htmlFor = `answer-${index}`;
            radioBtnAnswerLabel.innerHTML = `${this._answers[index].content}`;
            radioBtnAnswerLabel.id = 'answer-options';

            if (this._question.userAnswer != '') {
                radioBtnAnswer.disabled = true;
                radioBtnAnswerLabel.style.pointerEvents = 'none'
            }

            if (this._question.userAnswer === this._answers[index].content) {
                radioBtnAnswer.checked = true;
            }

            item.append(radioBtnAnswer)
            item.append(radioBtnAnswerLabel)

            this.updateUserAnswer(radioBtnAnswer);

            this._questionContainer.append(item);
        })
    }
    updateUserAnswer(radioBtnAnswer: HTMLInputElement) {
        radioBtnAnswer.addEventListener('click', (evt: Event) => {
            this._allQuestions.questions[this._currentRandomIndex].userAnswer = (evt.target as HTMLInputElement).value;

            if (this._question.userAnswer == '' && this._userAnswerHelper == '') {
                this._userAnswerHelper = (evt.target as HTMLInputElement).value;
                const questionAnswered: number = parseInt(getLocalStorageItem('answers-user-provided')) + 1
                setLocalStorageItem('answers-user-provided', questionAnswered.toString());

                //Sprawdzanie czy liczba udzielonych odpowiedzi jest taka sama jak liczba pytań
                const questionLength: number = parseInt(getLocalStorageItem('question-length'));
                if (questionLength === questionAnswered) {
                    this._endBtn.style.display = 'block';
                }
            }

            setLocalStorageItem('question-data', JSON.stringify(this._allQuestions))
        })

        setLocalStorageItem('question-data', JSON.stringify(this._allQuestions))
    }
}