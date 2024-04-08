import { AImageViewer } from "../../image_viewer.js";


function initializeMeetPage(){

    if(innerWidth < 1100){

        document.querySelector('.navigation-secondary-open-btn').addEventListener('click', (event)=>{
            document.querySelector('.navigation-secondary').classList.toggle('show');
        });
    }

    AImageViewer.initialize(document.querySelectorAll('img.viewable'));
};
initializeMeetPage();