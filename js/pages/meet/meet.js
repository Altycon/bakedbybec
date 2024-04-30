import { AImageViewer } from "../../image_viewer.js";
import { pageNavigation } from "../../navigation.js";

function revealMeetElements(){

    document.querySelector('.meet-background').classList.add('reveal');
};

function initializeMeetPage(){

    revealMeetElements();

    pageNavigation();

    AImageViewer.initialize(document.querySelectorAll('img.viewable'));
};
initializeMeetPage();