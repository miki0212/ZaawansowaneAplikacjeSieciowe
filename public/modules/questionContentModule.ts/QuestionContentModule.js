import { BaseAbstractTemplate } from "../../baseTemplate/BaseAbstractTemplate.js";
import { createElement } from "../../createElements/CreateElements.js";
import { getLocalStorageItem, setLocalStorageItem } from "../../localStorageItems/LocalStorageItems.js";
export class QuestionContentModule extends BaseAbstractTemplate {

    constructor(questionContainer, endGame) {
        super();

        this.render = () => {
            this._questionContainer.innerHTML = '';
            this.createPage();
        };

        this._allQuestions = {};
        this._question = {};

        //Initialize timer id
        this._oneQuestionTimerId = 0;

        //This is probably remembered by the user who already has some question
        this._userAnswerHelper = '';

        this._endBtn = document.querySelector('#end-btn');
        this._endBtn.style.display = 'none';

        this._questionContainer = questionContainer;
        this._currentIndex = parseInt(getLocalStorageItem('current-question-idx'));
        this._currentRandomIndex = parseInt(getLocalStorageItem('random-questions-index-array').split(',')[this._currentIndex]);

        const data = getLocalStorageItem('question-data');
        this.loadDataFromLocalStorage(data);
        
        this._answerContainer = [];
    }

    //FIXME: Add events
    bindHandlers() {
    }

    createPage() {
        //Answers Container
        for (let i = 0; i < 4; i++) {
            this._answerContainer.push(createElement('div', 'answer'));
        }

        this._answerContainer.forEach((item, index) => {
            const radioBtnAnswer = createElement('input', `answer-${index}`, 'radio', `${this._answers[index].content}`);
            const radioBtnAnswerLabel = document.createElement('label');

            radioBtnAnswer.name = `answer-radio-group`;
            radioBtnAnswerLabel.htmlFor = `answer-${index}`;
            radioBtnAnswerLabel.innerHTML = `${this._answers[index].content}`;
            radioBtnAnswerLabel.id = 'answer-options';

            if (this._question.userAnswer != '') {
                radioBtnAnswer.disabled = true;
                radioBtnAnswerLabel.style.pointerEvents = 'none';
            }

            if (this._question.userAnswer === this._answers[index].content) {
                radioBtnAnswer.checked = true;
            }

            item.append(radioBtnAnswer);
            item.append(radioBtnAnswerLabel);
            
            this.updateUserAnswer(radioBtnAnswer);

            this._questionContainer.append(item);
        });
    }

    loadDataFromLocalStorage(data){
        if (data) {
            this._allQuestions = JSON.parse(data);
            this._question = JSON.parse(data).questions[this._currentRandomIndex];
            this._answers = this._question.answers;

            console.log(this._allQuestions);
        }
        else {
            this._answers = [];
        }
    }

    updateUserAnswer(radioBtnAnswer) {
        radioBtnAnswer.addEventListener('click', (evt) => {
            this._allQuestions.questions[this._currentRandomIndex].userAnswer = evt.target.value;

            if (this._question.userAnswer == '' && this._userAnswerHelper == '') {
                const questionAnswered = parseInt(getLocalStorageItem('answers-user-provided')) + 1;
                const questionLength = parseInt(getLocalStorageItem('question-length'));

                this._userAnswerHelper = evt.target.value;
                setLocalStorageItem('answers-user-provided', questionAnswered.toString());

                //Checking whether the number of answers given is the same as the number of questions
                if (questionLength === questionAnswered) {
                    this._endBtn.style.display = 'block';
                }
            }
            setLocalStorageItem('question-data', JSON.stringify(this._allQuestions));
        });
    }
}
