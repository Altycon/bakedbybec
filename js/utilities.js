

export function fixCanvas(canvas,dpi){

    const styleWidth = +getComputedStyle(canvas).getPropertyValue('width').slice(0,-2);
    const styleHeight = +getComputedStyle(canvas).getPropertyValue('height').slice(0,-2);
    canvas.setAttribute('width', styleWidth * dpi);
    canvas.setAttribute('height', styleHeight * dpi);
    return canvas;
};

export function openInHouseBakerySign(event){

    if(event) event.preventDefault();

    const inHouseBakery = document.querySelector('.in-house-bakery');
    if(!inHouseBakery.classList.contains('open')){
        inHouseBakery.classList.add('open');
        setTimeout( ()=>{
            inHouseBakery.classList.add('show');
        },100)
    }else{
        inHouseBakery.classList.remove('show');
        setTimeout( ()=>{
            inHouseBakery.classList.remove('open');
        },500)
    } 
};