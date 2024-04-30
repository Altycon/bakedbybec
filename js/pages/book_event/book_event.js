import { pageNavigation } from "../../navigation.js";


function revealBookEventElements(){

    document.querySelector('.book-event-main').classList.add('reveal');
};

function initializeBookEventPage(){

    pageNavigation();

    revealBookEventElements();
    
};

initializeBookEventPage();