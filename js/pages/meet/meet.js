import { AImageViewer } from "../../image_viewer.js";
import { isPageNavigationDisplayed, pageNavigation } from "../../navigation.js";
import { openInHouseBakerySign } from "../../utilities.js";



function initializeMeetPage(){

    const inHouseBakeryButton = document.querySelector('.js-in-house-bakery-btn');
    if(inHouseBakeryButton){
        inHouseBakeryButton.addEventListener('click', openInHouseBakerySign);
    }
    if(!isPageNavigationDisplayed()){
        pageNavigation();
    }

    AImageViewer.initialize(document.querySelectorAll('img.viewable'));
};
initializeMeetPage();