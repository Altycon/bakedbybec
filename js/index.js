import { Confirmation } from "./confirmation.js";
import { ANotification } from "./notification.js";


function initializeSite(){

    document.querySelector('.navigation-primary-list').classList.add('reveal');

    document.querySelector('.navigation-primary-logo-img').classList.add('reveal');

    document.querySelector('.notes-open-btn').addEventListener('click', (event)=>{

        const notes = document.querySelector('.notes');

        notes.querySelector('.notes-close-btn').addEventListener('click', function close(){

            notes.classList.remove('show');

            setTimeout( ()=>{
                
                notes.classList.remove('open');

                event.target.removeEventListener('click', close);

            },200)            
        })

        notes.classList.add('open');

        setTimeout( ()=>{
            
            notes.classList.add('show');

        },100)
    })
}
initializeSite();