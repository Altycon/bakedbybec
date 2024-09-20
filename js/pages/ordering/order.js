import { isPageNavigationDisplayed, pageNavigation } from "../../navigation.js";
import { openInHouseBakerySign, scrollToTopOfPage, transition, } from "../../utilities.js";
import { OrderProgress } from "./order_progress.js";
import { OrderForm } from "./order_form.js";
import { Confirmation } from "../../canopy/confirmation.js";
import { ANotification, PageNotification } from "../../canopy/notification.js";

function openOrderForm(event){
    event.preventDefault();

    const beforeYouOrderElement = document.querySelector('.js-before-you-order');
    const orderAreaElement = document.querySelector('.js-ordering-area');

    beforeYouOrderElement.addEventListener('transitionend', (transitionEvent)=>{
        transitionEvent.target.remove();
    })
    beforeYouOrderElement.classList.add('close');

    scrollToTopOfPage();
    
    OrderProgress.display();

    transition('add',orderAreaElement,'open','show',500, ()=>{
        OrderProgress.setState(0);
        OrderProgress.listenToAreaInputs('.js-personal-info',5);
    });
};

function initializeOrderPage(){
    // let externalItemValue = undefined;

    // if(window.location.hash && window.location.hash !== ""){

    //     externalItemValue = window.location.hash.split('#')[1];
    //     // add the item to the order item list
    // }
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
        
        OrderForm.initialize();
        OrderProgress.initialize();

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
