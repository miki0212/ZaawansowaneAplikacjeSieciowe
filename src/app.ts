import { StartPageModules } from "./modules/startPageModule/StartPageModule.js";

const mainCointainer = document.querySelector('#main-container') as HTMLDivElement;
const endBtn = document.querySelector('#end-btn') as HTMLButtonElement;
let startGameModule: StartPageModules = new StartPageModules(mainCointainer);

//Funkcja ładująca startowe okno - Przycisk rozpocznij gre
const loadStartContent = () => {
    endBtn.style.display = 'none';
    startGameModule.render();
}

loadStartContent();