// export type localStorageItemsType = "random-questions-index-array" | 'question-times' | 'user-answers' | 'current-question-idx';
export function getLocalStorageItem(itemName) {
    const itemData = localStorage.getItem(itemName);
    return itemData ? itemData : "0";
}
;
export function setLocalStorageItem(itemName, itemData) {
    localStorage.setItem(itemName, itemData);
}
;
//random-questions-index-array - tablica losowych elementów : indeksow pytan w losowej kolejsnoci
//questionTimes - tablica czasow dla poszczegolnych pytan
//user-answers - tablica odpowiedzi uzytkownika
//current-question-idx - aktualny index - nie losowy
//test-data - pytania i odpowiedzi wczytane z pliku ts / w przyszłości z pliku json :) 
//question-length - liczba pytan w tescie
