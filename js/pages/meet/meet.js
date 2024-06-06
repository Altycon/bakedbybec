import { AImageViewer } from "../../image_viewer.js";
import { pageNavigation } from "../../navigation.js";
import { openInHouseBakerySign } from "../../utilities.js";



function initializeMeetPage(){

    pageNavigation();
    document.querySelector('.js-in-house-bakery-btn').addEventListener('click', openInHouseBakerySign);

    AImageViewer.initialize(document.querySelectorAll('img.viewable'));
};
initializeMeetPage();