import { isPageNavigationDisplayed, pageNavigation } from "../../navigation.js";
import { openInHouseBakerySign, } from "../../utilities.js";
import { OrderProgress } from "./order_progress.js";
import { OrderForm } from "./order_form.js";

function openOrderForm(event){
    event.preventDefault();

    const beforeYouOrderElement = document.querySelector('.js-before-you-order');
    const orderAreaElement = document.querySelector('.js-ordering-area');

    if(!beforeYouOrderElement || !orderAreaElement){
        console.warn('missing order area elements or error selecting elements')
    }else{
        
        beforeYouOrderElement.classList.add('close');

        if(document.documentElement.scrollTop > 0){
            window.scroll({
                top: 0,
                behavior: 'smooth'
            })
        }
        
        OrderProgress.initialize(document.querySelector('.js-order-progress-bar'));
        OrderProgress.display();
        setTimeout( ()=>{
            //beforeYouOrderElement.classList.add('hide');
            beforeYouOrderElement.remove();
            orderAreaElement.classList.add('open');
            
        },300);
        setTimeout( ()=> {
            orderAreaElement.classList.add('show');
            OrderProgress.setState(0);
            OrderProgress.listenToAreaInputs('.js-personal-info',5);
        },400);

        OrderForm.initialize();
    }
};

function initializeOrderingPage(){

    // let externalItemValue = undefined;

    // if(window.location.hash && window.location.hash !== ""){

    //     externalItemValue = window.location.hash.split('#')[1];
    //     // add the item to the order item list
    // }

    const inHouseBakeryButton = document.querySelector('.js-in-house-bakery-btn');
    if(inHouseBakeryButton){
        inHouseBakeryButton.addEventListener('click', openInHouseBakerySign);
    }
    if(!isPageNavigationDisplayed()){
        pageNavigation();
    }
    const openOrderFormButton = document.querySelector('.js-open-order-form-btn')
    if(openOrderFormButton){
        openOrderFormButton.addEventListener('click', openOrderForm);
    }
};
initializeOrderingPage();