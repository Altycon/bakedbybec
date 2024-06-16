import { createIntersectionObserver } from "../../intersection_observer.js";
import { pageNavigation } from "../../navigation.js";
import { openInHouseBakerySign } from "../../utilities.js";


function initializeBookClassPage(){

    pageNavigation();
    document.querySelector('.js-in-house-bakery-btn').addEventListener('click', openInHouseBakerySign);

    createIntersectionObserver('.intersection',0.5);
    
};

initializeBookClassPage();