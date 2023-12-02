import { StartPageModules } from "./modules/startPageModule/StartPageModule.js";
const mainCointainer = document.querySelector('#main-container');
const endBtn = document.querySelector('#end-btn');
let startGameModule = new StartPageModules(mainCointainer);
const loadStartContent = () => {
    endBtn.style.display = 'none';
    startGameModule.render();
};
loadStartContent();
