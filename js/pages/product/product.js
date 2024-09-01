import { isPageNavigationDisplayed, pageNavigation } from "../../navigation.js";
import { createIntersectionObserver } from "../../intersection_observer.js";
import { openInHouseBakerySign } from "../../utilities.js";

function initializeProductPage(){

    const inHouseBakeryButton = document.querySelector('.js-in-house-bakery-btn');
    if(inHouseBakeryButton){
        inHouseBakeryButton.addEventListener('click', openInHouseBakerySign);
    }
    if(!isPageNavigationDisplayed()){
        pageNavigation();
    }

    createIntersectionObserver('.intersection', 0.5);
    
};

initializeProductPage();