import { getLocalStorageItem, setLocalStorageItem } from "./localStorageItems/LocalStorageItems.js";
export function counterUserPoints() {
    const correctAnswers = getLocalStorageItem('correct-answers').split(',');
    //FIXME : Do usuniecia - // const correctAnswers: string[] = localStorage.getItem('correctAnswers')!.split(',');
    const userAnswers = getLocalStorageItem('user-answers').split(',');
    //FIXME : Do usuniecia - // const userAnswers: string[] = localStorage.getItem('user-answers')!.split(',');
    let points = 0;
    correctAnswers.forEach((item, index) => {
        if (item == userAnswers[index]) {
            points++;
        }
    });
    return points.toString();
}
;
export function setTimeArray(index, value) {
    const times = getLocalStorageItem('question-times-array');
    if (times) {
        let timeArray = times.split(',').map(Number);
        timeArray[index] = value;
        setLocalStorageItem('question-times-array', timeArray.toString());
    }
}
;
export function getTimeArray(index) {
    const times = getLocalStorageItem('question-times-array');
    if (times) {
        const timeArray = times.split(',').map(Number);
        return timeArray[index] == -1 ? 0 : timeArray[index];
    }
    return -1;
}
;
export function totalTimeCounter(totalTime = null, totalTimeNode) {
    let time = 0;
    totalTime = window.setInterval(() => {
        time++;
        totalTimeNode.innerHTML = `${time / 10}`;
    }, 100);
}
;
export function startCounter(currentIdx, currentIntervalId = null, questionTimeNode) {
    if (currentIntervalId !== null) {
        clearInterval(currentIntervalId);
    }
    console.log("Current : " + currentIntervalId);
    const currendRandomIndex = getLocalStorageItem('random-questions-index-array').split(',').map(Number)[currentIdx];
    let time = parseInt(getTimeArray(currendRandomIndex).toString() || '0', 10);
    questionTimeNode.innerHTML = `${time}`;
    currentIntervalId = window.setInterval(() => {
        time++;
        questionTimeNode.innerHTML = `${time / 10}`;
        setTimeArray(currendRandomIndex, time);
    }, 100);
    return currentIntervalId;
}
;
export function stopCounter(currentIntervalId = null) {
    if (currentIntervalId !== null) {
        clearInterval(currentIntervalId);
        return null;
    }
    return currentIntervalId;
}
;
export function getQuestionLength() {
    return parseInt(getLocalStorageItem('question-length'));
}
;
export function setAnswerArray(index, answer) {
    var _a;
    let answerArray = (_a = localStorage.getItem('user-answers')) === null || _a === void 0 ? void 0 : _a.split(',');
    answerArray[index] = answer;
    setLocalStorageItem('user-answers', answerArray.toString());
}
