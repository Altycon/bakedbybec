import { AImageViewer } from "../../image_viewer.js";


function initializeMeetPage(){

    AImageViewer.initialize(document.querySelectorAll('img.viewable'));
};
initializeMeetPage();