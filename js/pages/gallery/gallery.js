
import { AImageViewer } from "../../image_viewer.js";

const galleryTabs = document.querySelectorAll('.navigation-gallery-item');

const galleries = document.querySelectorAll('.gallery-content section');


function setGalleryLink(sectionId){

    galleryTabs.forEach( tab => {

        const linkSectionId = tab.querySelector('a').href.split('#');

        window.localStorage.hash = linkSectionId;

        if(linkSectionId[1] === sectionId){

            tab.classList.add('active');

        }else{

            if(tab.classList.contains('active')){

                tab.classList.remove('active');
            }
        }
    });


    const galleryToActive = document.querySelector(`#${sectionId}`);

    galleryToActive.classList.add('open');

    setTimeout( ()=> {

        galleryToActive.classList.add('show');

    },100);
}


function activateGalleryTab(event){

    event.preventDefault();

    if(event.currentTarget.classList.contains('active')) return;

    galleryTabs.forEach( tab => {

        if(tab.classList.contains('active')){

            tab.classList.remove('active');
        }
    });

    galleries.forEach( gallery => {

        if(gallery.classList.contains('open')){

            gallery.classList.remove('show');

            gallery.classList.remove('open');
        }
    });

    event.currentTarget.classList.add('active');

    const tabLink = event.currentTarget.querySelector('a');

    const sectionId = tabLink.href.split('#')[1];

    const galleryToActive = document.querySelector(`#${sectionId}`);

    galleryToActive.classList.add('open');

    setTimeout( ()=> {

        galleryToActive.classList.add('show');

    },100);
}

function listenToGallery(){

    galleryTabs.forEach( tab => {

        tab.addEventListener('click', activateGalleryTab);

    })
}

function initializeGallery(){

    if(window.location.hash && window.location.hash !== ""){

        setGalleryLink(window.location.hash.split('#')[1]);

    }else{

        setGalleryLink('SugarCookies');
    }

    if(innerWidth < 1100){

        document.querySelector('.navigation-secondary-open-btn').addEventListener('click', (event)=>{
            document.querySelector('.navigation-secondary').classList.toggle('show');
        });
    }
    

    listenToGallery();

    AImageViewer.initialize(document.querySelectorAll('img.viewable'));
};
initializeGallery();