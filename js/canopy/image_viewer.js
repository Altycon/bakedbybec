

export const AImageViewer = {
    
    imageViewer: document.querySelector('.image-viewer'),
    figureElement: document.querySelector('.image-viewer figure'),
    imageElement: document.querySelector('.image-viewer figure img'),
    imageCaption: document.querySelector('.image-viewer figure figcaption'),
    testing: false,

    getDocumentBaseLocation(){
        const base = document.querySelector('base');
        if(base){
           return base.getAttribute('href');
        }
        return '/';
    },
    
    imageError(error){
        console.warn('IMAGELOADERROR',error);
    },
    close(event){
        if(!event.target.closest('figure')){

            AImageViewer.imageViewer.classList.remove('show');
            AImageViewer.imageViewer.removeEventListener('click', AImageViewer.close);

            setTimeout( ()=>{
                AImageViewer.imageViewer.classList.remove('open');
                AImageViewer.imageElement.onload = undefined;
                AImageViewer.imageElement.onerror = undefined;
                AImageViewer.imageElement.src = "";
                AImageViewer.imageElement.setAttribute('alt', "");
                // document.body.style.overflow = 'auto';
            },100);
        }
    },
    open(event){
        AImageViewer.imageViewer.addEventListener('click', AImageViewer.close);
        AImageViewer.imageElement.onerror = AImageViewer.imageError;

        if(event.target.dataset.fullImageUrl){
            const newImagePath = AImageViewer.getDocumentBaseLocation() + event.target.dataset.fullImageUrl;
            AImageViewer.imageElement.src = newImagePath;
            
        }else{
            const newImagePath = AImageViewer.getDocumentBaseLocation() + event.target.src;
            AImageViewer.imageElement.src = newImagePath;
        }

        AImageViewer.imageCaption.textContent = event.target.getAttribute('alt');
        AImageViewer.imageViewer.classList.add('open');
        // document.body.style.overflow = 'hidden';

        setTimeout( ()=>{
            AImageViewer.imageViewer.classList.add('show');
        },100);

        if(AImageViewer.testing) console.log('image click test: ', AImageViewer.imageCaption.textContent);
    },
    addImage(image){
        if(!image) return;
        image.addEventListener('click', AImageViewer.open);
    },
    initialize(imageElements,test = false){
        imageElements.forEach( imageElement =>{
            imageElement.addEventListener('click', AImageViewer.open);
        });
        if(test) AImageViewer.testing = true;
    }
};