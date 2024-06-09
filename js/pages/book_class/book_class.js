import { createIntersectionObserver } from "../../intersection_observer.js";
import { pageNavigation } from "../../navigation.js";
import { openInHouseBakerySign } from "../../utilities.js";


function revealBookClassElements(){

    document.querySelector('.book-class-main').classList.add('reveal');
};

function initializeBookClassPage(){

    pageNavigation();
    document.querySelector('.js-in-house-bakery-btn').addEventListener('click', openInHouseBakerySign);

   // revealBookClassElements();

    let threshold = 0.9;
    if(innerWidth < 800) threshold = 0.2;
    
    createIntersectionObserver('.intersection',threshold);
    
};

initializeBookClassPage();