import { pageNavigation } from "../../navigation.js";
import { openInHouseBakerySign } from "../../utilities.js";


function revealBookEventElements(){

    document.querySelector('.book-event-main').classList.add('reveal');
};

function initializeBookEventPage(){

    pageNavigation();
    document.querySelector('.js-in-house-bakery-btn').addEventListener('click', openInHouseBakerySign);

    revealBookEventElements();
    
};

initializeBookEventPage();