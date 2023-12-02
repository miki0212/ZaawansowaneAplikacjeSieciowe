type localStorageItemsType =
    "random-questions-index-array"
    | 'question-times-array'
    | 'user-answers'
    | 'current-question-idx'
    | 'test-data'
    | 'question-length'
    | 'correct-answers'
    | 'username'
    | 'question-data'
    | 'answers-user-provided'
    | 'user-total-time'

export function getLocalStorageItem(itemName: localStorageItemsType) {
    const itemData = localStorage.getItem(itemName)
    return itemData ? itemData : "";
};

export function setLocalStorageItem(itemName: localStorageItemsType, itemData: string) {
    localStorage.setItem(itemName, itemData);
};