import { StartPageModules } from "./modules/startPageModule/StartPageModule.js";

const mainCointainer = document.querySelector('#main-container') as HTMLDivElement;
const endBtn = document.querySelector('#end-btn') as HTMLButtonElement;
let startGameModule: StartPageModules = new StartPageModules(mainCointainer);

const loadStartContent = () => {
    endBtn.style.display = 'none';
    startGameModule.render();
}

loadStartContent();