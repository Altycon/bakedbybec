import { isPageNavigationDisplayed, pageNavigation } from "../../navigation.js";
import { openInHouseBakerySign, } from "../../utilities.js";
import { OrderProgress } from "./order_progress.js";
import { OrderForm } from "./order_form.js";
import { Confirmation } from "../../confirmation.js";
import { ANotification } from "../../notification.js";


Confirmation.initialize();
ANotification.initialize();

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

function initializeOrderPage(){

    // let externalItemValue = undefined;

    // if(window.location.hash && window.location.hash !== ""){

    //     externalItemValue = window.location.hash.split('#')[1];
    //     // add the item to the order item list
    // }
    try{
        const inHouseBakeryButton = document.querySelector('.js-in-house-bakery-btn');
        if(!inHouseBakeryButton) throw new Error('missing element - in house bakery button')
        inHouseBakeryButton.addEventListener('click', openInHouseBakerySign);
        if(!isPageNavigationDisplayed()){
            pageNavigation();
        }
        const openOrderFormButton = document.querySelector('.js-open-order-form-btn')
        if(!openOrderFormButton) throw new Error('missing element - open order form button');
        openOrderFormButton.addEventListener('click', openOrderForm);
    }catch(error){
        console.error('Order Page Initialization Error: ', error.message)
    }
};
initializeOrderPage();
