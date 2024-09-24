
import { isPageNavigationDisplayed, pageNavigation } from "../../navigation.js";
import { openInHouseBakerySign, scrollToTopOfPage, transition, } from "../../utilities.js";
import { OrderProgress } from "./order_progress.js";
import { OrderForm } from "./order_form.js";
import { Confirmation } from "../../canopy/confirmation.js";
import { ANotification, PageNotification } from "../../canopy/notification.js";


const beforeYouOrderElement = document.querySelector('.js-before-you-order');
const orderAreaElement = document.querySelector('.js-ordering-area');

function openOrderForm(event){
    event.preventDefault();

    beforeYouOrderElement.addEventListener('transitionend', (transitionEvent)=>{
        transitionEvent.target.remove();
    })
    transition('remove',beforeYouOrderElement,'show','open',500);

    scrollToTopOfPage();
    
    OrderProgress.display();

    transition('add',orderAreaElement,'open','show',500, ()=>{
        OrderProgress.setState(0);
        OrderProgress.listenToAreaInputs('.js-personal-info',5);
    });
};
function retrieveInitialItemValueFromURL(urlAddress){
    const url = new URL(urlAddress);
    const initialItemName = url.searchParams.get('initialItem');
    if(!initialItemName) return null;
    return initialItemName;
};
function initializeOrderPage(){
    
    const initialItemName = retrieveInitialItemValueFromURL(window.location.href);

    transition('add',beforeYouOrderElement,'open','show',1000);
    try{

        Confirmation.initialize();
        ANotification.initialize();
        PageNotification.initialize();

        if(!isPageNavigationDisplayed()){
            pageNavigation();
        }
        const inHouseBakeryButton = document.querySelector('.js-in-house-bakery-btn');
        if(!inHouseBakeryButton) throw new Error('missing element - in house bakery button')
        inHouseBakeryButton.addEventListener('click', openInHouseBakerySign);

        if(!beforeYouOrderElement) throw new Error('missing element - before you order');
        if(!orderAreaElement) throw new Error('missing element - ordering area');
        
        OrderProgress.initialize();
        OrderForm.initialize(initialItemName);

        const openOrderFormButton = document.querySelector('.js-open-order-form-btn')
        if(!openOrderFormButton) throw new Error('missing element - open order form button');
        openOrderFormButton.addEventListener('click', openOrderForm);

    }catch(error){
        console.error('Order Page Initialization Error: ', error.message);
        confirm('Something is missing on the page. Please reload the page. If this does not work, please contact us and let us know.')
        if(ANotification){
            ANotification.notify('There are missing elements on the page. Please reload page.')
        }
    }
};
initializeOrderPage();