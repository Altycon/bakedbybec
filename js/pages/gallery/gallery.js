
import { AImageViewer } from "../../image_viewer.js";
import { isPageNavigationDisplayed, pageNavigation } from "../../navigation.js";
import { openInHouseBakerySign } from "../../utilities.js";

const Gallery = {
    sectionLoader: undefined,
    tabs: undefined,
    images: undefined,
    sections: undefined,

    // I need to remove the loader after it finishes, not just display: none;?

    deactivateTabs(){
        this.tabs.forEach( tab => {
            if(tab.classList.contains('active')){
                tab.classList.remove('active');
            }
        });
    },
    activateTab(sectionId){
        this.tabs.forEach( tab => {
            const linkSectionId = tab.querySelector('a').href.split('#')[1];
            if(linkSectionId === sectionId){
                tab.classList.add('active');
            }else{
                if(tab.classList.contains('active')){
                    tab.classList.remove('active');
                }
            }
        });
    },
    deactivateSections(){
        this.sections.forEach( section => {
            if(section.classList.contains('open')){
                section.classList.remove('show');
                section.classList.remove('open');
            }
        });
    },
    activateSection(sectionId){
        const section = document.querySelector(`#${sectionId}`);
        section.classList.add('open');
        setTimeout( ()=> {
            section.classList.add('show');
        },100);
    },
    selectSection(clickEvent){
        clickEvent.preventDefault();
        const target = clickEvent.currentTarget
        if(target.classList.contains('active')) return;

        this.deactivateTabs();
        this.deactivateSections();

        const sectionId = target.querySelector('a').href.split('#')[1];
        this.activateSection(sectionId);

        target.classList.add('active');
    },
    loadImages(sectionId,timeOutDuration = 10000){
       
        return new Promise( (resolve)=>{
            const sectionImages = document.querySelectorAll(`#${sectionId} img.viewable`);
            const totalImages = sectionImages.length;
            let completedImages = 0;
            function checkAllImagesLoaded(){
                if(totalImages === completedImages){
                    Gallery.sectionLoader.classList.remove('loading');
                    resolve(sectionId)
                }
            }
            sectionImages.forEach( img => {
                if(img.complete){
                    completedImages++;
                }else{
                    img.addEventListener('load', function loadImage(){
                        completedImages++;
                        checkAllImagesLoaded();
                        img.removeEventListener('load',loadImage);
                    })
                }
            });
            checkAllImagesLoaded();

            const imageTimeOut = setTimeout( ()=>{
                reject(new Error('Image loading timeout. please try again'));
            },timeOutDuration);
            Promise.resolve().then( ()=> clearTimeout(imageTimeOut));
        })
    },
    listen(){
        this.tabs.forEach( tab => {
            tab.addEventListener('click', (clickEvent)=>{
                this.selectSection(clickEvent);
            });
        });
    },
    initialize(){
    
        this.sectionLoader = document.querySelector('.gallery-content .loader');
        this.tabs = document.querySelectorAll('.navigation-gallery-item');
        this.images = document.querySelectorAll('img.viewable');
        this.sections = document.querySelectorAll('.gallery-content section');

        this.listen();
    }
};
function initializeGalleryPage(){

    const inHouseBakeryButton = document.querySelector('.js-in-house-bakery-btn');
    if(inHouseBakeryButton){
        inHouseBakeryButton.addEventListener('click', openInHouseBakerySign);
    }
    
    if(!isPageNavigationDisplayed()){
        pageNavigation();
        console.log('navigation not displayed')
    }
    
    AImageViewer.initialize(document.querySelectorAll('img.viewable'));

    Gallery.initialize();

    // I should do this check in a separate function ??? Idk
    if(window.location.hash && window.location.hash !== ""){
        const galleryId = window.location.hash.split('#')[1];
        Gallery.activateTab(galleryId);

        Gallery.loadImages(galleryId)
        .then( (sectionId)=> {
            Gallery.activateSection(sectionId);
        })
        .catch( error => {
            console.log('LoadingImageError: ',error.message);
            alert('Reload page');
        })
    }else{
        Gallery.activateTab('SugarCookies');
        Gallery.loadImages('SugarCookies')
        .then( (sectionId)=> {
            Gallery.activateSection(sectionId);
        })
        .catch( error => {
            console.log('LoadingImageError: ',error.message);
            alert('Reload page')
        })
    }
};
initializeGalleryPage();

