import { StartPageModules } from "./modules/startPageModule/StartPageModule.js";
const mainCointainer = document.querySelector('#main-container');
const endBtn = document.querySelector('#end-btn');
let startGameModule = new StartPageModules(mainCointainer);
//Funkcja ładująca startowe okno - Przycisk rozpocznij gre
const loadStartContent = () => {
    endBtn.style.display = 'none';
    startGameModule.render();
};
loadStartContent();
