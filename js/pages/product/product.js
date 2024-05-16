import { pageNavigation } from "../../navigation.js";
import { createIntersectionObserver } from "../../intersection_observer.js";

function initializeProductPage(){

    pageNavigation();

    createIntersectionObserver('.intersection', 0.5);
    
};

initializeProductPage();