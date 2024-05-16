import { AImageViewer } from "./image_viewer.js";
import { pageNavigation } from "./navigation.js";
import { createIntersectionObserver } from "./intersection_observer.js";


function handleNotes(){

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
        setTimeout( ()=> { notes.classList.add('show') },100);
    });
};


function siteOpeningTransition(){

    document.querySelector('.home-navigation-primary').classList.add('reveal');
    document.querySelector('.home-background .floor > span').classList.add('reveal');
    
};



function handleDesktopHomeHoverLinksAnimation(){

    const navigationCircle = document.querySelector('.home-navigation-primary-circle');
   
    const circleNavigationLinks = document.querySelectorAll('.js-circle-link');

    circleNavigationLinks.forEach( navLink => {

        navLink.addEventListener('mouseenter', (enterEvent)=>{

            navigationCircle.style.animation = `none`;

            enterEvent.currentTarget.addEventListener('mouseleave', function mouseLeavesLink(leaveEvent){
    
                navigationCircle.classList.remove(`${navLink.dataset.position}-hovered`);
    
                leaveEvent.target.removeEventListener('mouseleave', mouseLeavesLink);
            })

            navigationCircle.classList.add(`${navLink.dataset.position}-hovered`);
            navigationCircle.style.animation = `slideCircleBackgroundLeft 1s linear forwards`;
            
        });
    })

};



function initializeSite(){

    siteOpeningTransition();

    pageNavigation();

    handleDesktopHomeHoverLinksAnimation();
    
    createIntersectionObserver('.intersection',0.5);

    handleNotes();

    AImageViewer.initialize(document.querySelectorAll('img.viewable'));

   
}
initializeSite();