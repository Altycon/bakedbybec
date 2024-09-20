
import { AImageViewer } from "../../canopy/image_viewer.js";
import { isPageNavigationDisplayed, pageNavigation } from "../../navigation.js";
import { openInHouseBakerySign } from "../../utilities.js";

const Gallery = {
    sectionLoader: undefined,
    tabs: undefined,
    images: undefined,
    sections: undefined,

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
                    img.addEventListener('load', function imageLoaded(){
                        completedImages++;
                        checkAllImagesLoaded();
                        img.removeEventListener('load',imageLoaded);
                    });
                    img.addEventListener('error', function imageErrored(errorEvent){
                        console.warn(`image not loaded: ${errorEvent.target.src}`);
                        img.removeEventListener('error', imageErrored);
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
    }
    
    AImageViewer.initialize(document.querySelectorAll('img.viewable'));

    Gallery.initialize();

    if(window.location.hash && window.location.hash !== ""){
        const galleryId = window.location.hash.split('#')[1] || 'SugarCookies';
        Gallery.activateTab(galleryId);

        Gallery.loadImages(galleryId)
        .then( (sectionId)=> {
            Gallery.activateSection(sectionId);
        })
        .catch( error => {
            console.log('LoadingImageError: ',error.message);
            alert('if images did not load, please reload page.');
        })
    }else{
        Gallery.activateTab('SugarCookies');
        Gallery.loadImages('SugarCookies')
        .then( (sectionId)=> {
            Gallery.activateSection(sectionId);
        })
        .catch( error => {
            console.log('LoadingImageError: ',error.message);
            alert('if images did not load, please reload page.');
        })
    }
};
initializeGalleryPage();

