

export const AImageViewer = {
    
    imageViewer: document.querySelector('.image-viewer'),
    figureElement: document.querySelector('.image-viewer figure'),
    imageElement: document.querySelector('.image-viewer figure img'),
    imageCaption: document.querySelector('.image-viewer figure figcaption'),
    testing: false,

    loadImage(event){

        // console.log('Image loaded successfully',event);
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

                document.body.style.overflow = 'auto';

            },100);
        }

    },
    open(event){

        const imgWidth = event.target.width;
        const imgHeight = event.target.height;

        if(imgWidth > imgHeight){

            AImageViewer.figureElement.style.width = '500px';

        }else{

            AImageViewer.figureElement.style.width = '500px';
            AImageViewer.figureElement.style.height = '100%';
        }


        AImageViewer.imageViewer.addEventListener('click', AImageViewer.close);

        AImageViewer.imageElement.onload = AImageViewer.loadImage;

        AImageViewer.imageElement.onerror = AImageViewer.imageError;

        AImageViewer.imageElement.src = event.target.src;

        AImageViewer.imageCaption.textContent = event.target.getAttribute('alt');

        AImageViewer.imageViewer.classList.add('open');

        document.body.style.overflow = 'hidden';

        setTimeout( ()=>{

            AImageViewer.imageViewer.classList.add('show');

        },100);

        if(AImageViewer.testing) console.log('image click test: ', AImageViewer.imageCaption.textContent);

    },

    initialize(imageElements,test = false){

        imageElements.forEach( imageElement =>{

            imageElement.addEventListener('click', AImageViewer.open);
        });

        if(test) AImageViewer.testing = true;
    }
}