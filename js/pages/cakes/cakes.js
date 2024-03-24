import { AImageViewer } from "../../image_viewer.js";

function initializeCakePage(){

    AImageViewer.initialize(document.querySelectorAll('img.viewable'));

};

initializeCakePage();