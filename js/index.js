import { AImageViewer } from "./image_viewer.js";



function initializeSite(){

    document.querySelector('.navigation-primary-list').classList.add('reveal');

    document.querySelector('.navigation-primary-logo-img').classList.add('reveal');

    document.querySelectorAll('.navigation-primary-item').forEach( (child) => {

        child.classList.add('reveal');
        
    })

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
    });


    AImageViewer.initialize(document.querySelectorAll('img.viewable'));

   
}
initializeSite();