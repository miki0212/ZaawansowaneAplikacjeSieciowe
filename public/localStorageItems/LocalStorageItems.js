export function getLocalStorageItem(itemName) {
    const itemData = localStorage.getItem(itemName);
    return itemData ? itemData : "";
}
;
export function setLocalStorageItem(itemName, itemData) {
    localStorage.setItem(itemName, itemData);
}
;
