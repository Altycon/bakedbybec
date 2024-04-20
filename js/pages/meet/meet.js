import { AImageViewer } from "../../image_viewer.js";
import { pageNavigation } from "../../navigation.js";


function initializeMeetPage(){

    pageNavigation();

    AImageViewer.initialize(document.querySelectorAll('img.viewable'));
};
initializeMeetPage();