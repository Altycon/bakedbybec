import { pageNavigation } from "../../navigation.js";
import { openInHouseBakerySign } from "../../utilities.js";

function initializeContactPage(){

    pageNavigation();
    document.querySelector('.js-in-house-bakery-btn').addEventListener('click', openInHouseBakerySign);
    
};

initializeContactPage();