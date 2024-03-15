import { Confirmation } from "./confirmation.js";
import { ANotification } from "./notification.js";


function initializeSite(){

    [...document.querySelectorAll('.navigation-primary-link')].forEach( link => {

        link.addEventListener('click', (event)=>{

            event.preventDefault();

            const textContent = event.target.textContent;

            switch(textContent){

                case 'product':

                Confirmation.confirm(`This is nothing love. Just stuff I'm adding. Love you. :-)`)

                break;

                case 'contact':

                ANotification.notify('Testing a notification system');

                break;

                case 'meet':

                ANotification.notify('<span style="font-size: 30px;">&#127814;</span>',true);

                break;

                case 'faqs':

                Confirmation.confirm('This is not true.')
            }
        })
    })

}
initializeSite();