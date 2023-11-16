import testData from "./data/test-data.js";
export function getQuestionLength() {
    return testData.questions.length;
}
export function getTimeArray(index) {
    console.log("A");
    const times = localStorage.getItem("questionTimes");
    if (times) {
        const timeArray = times.split(",").map(Number);
        return timeArray[index] == -1 ? 0 : timeArray[index];
    }
    return -1;
}
