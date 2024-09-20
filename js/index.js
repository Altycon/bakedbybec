import { AImageViewer } from "./canopy/image_viewer.js";
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


function setRecentOrderListItemDirectionalArrows(){
    const recentOrdersList = document.querySelector('.recent-orders-list');
    const recentOrders = recentOrdersList.querySelectorAll('.recent-order');
    let hasScrolled = false;

    recentOrdersList.addEventListener('scroll',()=>{
        if(!hasScrolled){
            recentOrders.forEach( rOrder => {
                rOrder.querySelectorAll('.directional-arrow').forEach( arrow => {
                    if(!arrow.classList.contains('hide')){
                        arrow.classList.add('hide');
                    }
                })
            });
            hasScrolled = true;
        }
    });
    recentOrdersList.addEventListener('scrollend', ()=>{
        recentOrders.forEach( rOrder => {
            rOrder.querySelectorAll('.directional-arrow').forEach( arrow => {
                if(arrow.classList.contains('hide')){
                    arrow.classList.remove('hide');
                }
            })
        });
        hasScrolled = false;
    });
    recentOrders.forEach( recentOrder =>{
        const styleWidth = +getComputedStyle(recentOrder).getPropertyValue('width').slice(0,-2);
        const paddingInline = +getComputedStyle(recentOrdersList).getPropertyValue('padding-inline').slice(0,-2);
        const scrollWidth = styleWidth + paddingInline;
        const leftArrow = recentOrder.querySelector('.directional-arrow-left');
        const rightArrow = recentOrder.querySelector('.directional-arrow-right');
        leftArrow.addEventListener('click', ()=>{
            recentOrdersList.scrollBy({
                left: -scrollWidth,
                behavior: 'smooth'
            })
        })
        rightArrow.addEventListener('click', ()=>{
            recentOrdersList.scrollBy({
                left: scrollWidth,
                behavior: 'smooth'
            })
        })
    })
}


function initializeSite(){

    siteOpeningTransition();

    pageNavigation();
    document.querySelector('.js-in-house-bakery-btn').addEventListener('click', openInHouseBakerySign);

    handleDesktopHomeHoverLinksAnimation();

    let threshold = 0.5;
    if(innerWidth < 800) threshold = 0.2;
    
    createIntersectionObserver('.intersection',threshold);

    AImageViewer.initialize(document.querySelectorAll('img.viewable'));

    setRecentOrderListItemDirectionalArrows();

}
initializeSite();