

export function fixCanvas(canvas,dpi){

    const styleWidth = +getComputedStyle(canvas).getPropertyValue('width').slice(0,-2);
    const styleHeight = +getComputedStyle(canvas).getPropertyValue('height').slice(0,-2);
    canvas.setAttribute('width', styleWidth * dpi);
    canvas.setAttribute('height', styleHeight * dpi);
    return canvas;
};

