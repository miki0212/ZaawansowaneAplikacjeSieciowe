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
    // w    private _answerLabel : HTMLLabelElement;
    private _userAnswerHelper: string;

    private _currentRandomIndex: number;
    private _currentIndex: number;

    private _question!: IQuestionDataArray;
    private _allQuestions!: IQuestions;

    // private _answersButton : HTMLInputElement[];

    constructor(questionContainer: HTMLDivElement, endGame: HTMLButtonElement) {
        super();

        this._userAnswerHelper = '';
        this._endBtn = document.querySelector('#end-btn') as HTMLButtonElement;

        this._questionContainer = questionContainer;

        this._currentIndex = parseInt(getLocalStorageItem('current-question-idx'));
        this._currentRandomIndex = parseInt(getLocalStorageItem('random-questions-index-array').split(',')[this._currentIndex])

        const data = getLocalStorageItem('question-data');
        if (data) {
            this._allQuestions = (JSON.parse(data) as IQuestions);
            this._question = ((JSON.parse(data) as IQuestions).questions as IQuestionDataArray[])[this._currentRandomIndex];
            // console.log((JSON.parse(data) as IQuestions).questions);
            // this._answers = ((JSON.parse(data) as IQuestions).questions as IQuestionDataArray[])[this._currentRandomIndex].answers as IAnswers[];
            this._answers = this._question.answers;
            console.log(this._allQuestions)
        } else {
            this._answers = [];
        }

        this._answerContainer = [];

    }

    render = () => {
        this._questionContainer.innerHTML = '';
        this.createPage();
    }

    bindHandlers(): void {

    }

    createPage(): void {
        //Answers Container
        for (let i = 0; i < 4; i++) {
            this._answerContainer.push(createElement('div', 'answer') as HTMLDivElement);
        }

        this._answerContainer.forEach((item, index) => {
            const radioBtnAnswer = createElement('input', `answer-${index}`, 'radio', `${this._answers[index].content}`) as HTMLInputElement;
            radioBtnAnswer.name = `answer-radio-group`;

            const radioBtnAnswerLabel = document.createElement('label') as HTMLLabelElement;
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

            radioBtnAnswer.addEventListener('click', (evt: Event) => {
                this._allQuestions.questions[this._currentRandomIndex].userAnswer = (evt.target as HTMLInputElement).value;

                if (this._question.userAnswer == '' && this._userAnswerHelper == '') {
                    this._userAnswerHelper = (evt.target as HTMLInputElement).value;
                    const questionAnswered: number = parseInt(getLocalStorageItem('answers-user-provided')) + 1
                    setLocalStorageItem('answers-user-provided', questionAnswered.toString());

                    //Sprawdzanie czy liczba udzielonych odpowiedzi jest taka sama jak liczba pytań

                    const questionLength: number = parseInt(getLocalStorageItem('question-length'));
                    if (questionLength === questionAnswered) {
                        this._endBtn.classList.add('end');
                    }
                }

                setLocalStorageItem('question-data', JSON.stringify(this._allQuestions))
            })


            this._questionContainer.append(item);
        })

    }
}