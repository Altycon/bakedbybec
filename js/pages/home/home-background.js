

const HomeBackground = {
    canvas: undefined,
    context: undefined,
    width: undefined,
    height: undefined,
    dpi: devicePixelRatio,

    fixCanvas(canvas){

        const styleWidth = +getComputedStyle(canvas).getPropertyValue('width').slice(0,-2);
        const styleHeight = +getComputedStyle(canvas).getPropertyValue('height').slice(0,-2);
        canvas.setAttribute('width', styleWidth * HomeBackground.dpi);
        canvas.setAttribute('height', styleHeight * HomeBackground.dpi);
        return canvas;
    },
    initilize(canvas){

        HomeBackground.canvas = canvas;
        HomeBackground.context = canvas.getContext('2d');
        HomeBackground.width = canvas.width;
        HomeBackground.height = canvas.height;
    
    }
    // start with a point, start drawing line as animation, if 
}

