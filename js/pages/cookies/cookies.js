import { AImageViewer } from "../../image_viewer.js";

function initializeCookiesPage(){

    AImageViewer.initialize(document.querySelectorAll('img.viewable'));
}
initializeCookiesPage();