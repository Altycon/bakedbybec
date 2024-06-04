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
                document.body.style.overflow = 'auto';
            },200)            
        })
        notes.classList.add('open');
        document.body.style.overflow = 'hidden';
        setTimeout( ()=> { notes.classList.add('show') },100);
    });
};

function openInHouseBakerySign(event){

    if(event) event.preventDefault();

    document.querySelector('.in-house-bakery-sign .information').classList.toggle('open');
};

function siteOpeningTransition(){

    document.querySelector('.home-navigation-primary').classList.add('reveal');
    document.querySelector('.home-background .floor > span').classList.add('reveal');
    
};



function handleDesktopHomeHoverLinksAnimation(){

    const logoRing = document.querySelector('.home-navigation-primary-ring');
   
    const circleNavigationLinks = document.querySelectorAll('.js-circle-link');

    circleNavigationLinks.forEach( navLink => {

        navLink.addEventListener('mouseenter', (enterEvent)=>{

            logoRing.style.animation = `none`;

            enterEvent.currentTarget.addEventListener('mouseleave', function mouseLeavesLink(leaveEvent){
    
                logoRing.classList.remove(`${navLink.dataset.position}-hovered`);
    
                leaveEvent.target.removeEventListener('mouseleave', mouseLeavesLink);
            })

            logoRing.classList.add(`${navLink.dataset.position}-hovered`);
            logoRing.style.animation = `slideCircleBackgroundLeft 1s linear forwards`;
            
        });
    })

};



function initializeSite(){

    siteOpeningTransition();

    pageNavigation();

    handleDesktopHomeHoverLinksAnimation();

    document.querySelector('.in-house-bakery-sign > button').addEventListener('click', openInHouseBakerySign);

    let threshold = 0.5;
    if(innerWidth < 800) threshold = 0.1;
    
    createIntersectionObserver('.intersection',threshold);

    handleNotes();

    AImageViewer.initialize(document.querySelectorAll('img.viewable'));

   
}
initializeSite();