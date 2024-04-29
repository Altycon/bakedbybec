import { AImageViewer } from "./image_viewer.js";


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

function createIntersectionObserver(className,threshold = 0){

    const intersections = document.querySelectorAll(className);

    const homeObserver = new IntersectionObserver(entries=>{

       entries.forEach( entry => {

            if(entry.isIntersecting){

                entry.target.classList.add('show');
            }
       })
       
    }, {
        root: null,
        threshold: threshold,
    });

    intersections.forEach( intersection => {
        homeObserver.observe(intersection);
    })
};
function siteOpeningTransition(){

    document.querySelector('.home-navigation-primary').classList.add('reveal');
    document.querySelector('.home-background .floor > span').classList.add('reveal');
    
};

function handleMobileHomeNavigation(){

    document.querySelector('.page-navigation-primary-open-btn').addEventListener('click', (event)=>{

        // extra bit

        const homeHeaderHead = document.querySelector('.home-header-head');

        // main bit
        const pageNavigationElement = document.querySelector('.home-navigation-primary-list');
         if(pageNavigationElement.classList.contains('open')){
            document.body.style.overflow = 'auto';
            event.currentTarget.classList.remove('active');
            pageNavigationElement.classList.remove('show');
            
            setTimeout( ()=> {
                pageNavigationElement.classList.remove('open');
                homeHeaderHead.classList.remove('active');
            },100);
         }else{
            setTimeout( ()=> {
                pageNavigationElement.classList.add('show');
            },100);
            document.body.style.overflow = 'hidden';
            homeHeaderHead.classList.add('active');
            event.currentTarget.classList.add('active');
            pageNavigationElement.classList.add('open');
         }
    });
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

  

    handleMobileHomeNavigation();

    handleDesktopHomeHoverLinksAnimation();
    
    if(innerWidth > 800){
        createIntersectionObserver('.intersection',0.5);
    }

    handleNotes();

    AImageViewer.initialize(document.querySelectorAll('img.viewable'));

   
}
initializeSite();