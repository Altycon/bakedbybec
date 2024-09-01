import { AImageViewer } from "./image_viewer.js";
import { pageNavigation } from "./navigation.js";
import { createIntersectionObserver } from "./intersection_observer.js";
import { openInHouseBakerySign } from "./utilities.js";



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
    document.querySelector('.js-in-house-bakery-btn').addEventListener('click', openInHouseBakerySign);

    handleDesktopHomeHoverLinksAnimation();

    

    let threshold = 0.5;
    if(innerWidth < 800) threshold = 0.2;
    
    createIntersectionObserver('.intersection',threshold);

    AImageViewer.initialize(document.querySelectorAll('img.viewable'));
}
initializeSite();