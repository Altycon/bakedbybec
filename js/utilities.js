
const MILLISECONDS_PER_DAY = 86400000;

function isObject(value){
    return (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        !(value instanceof RegExp) &&
        !(value instanceof Date) &&
        !(value instanceof Set) &&
        !(value instanceof Map)
    );
};

export function zeroPadLeftToString(num){
    if(+num > 9) return `${num}`;
    return `0${num}`;
};

export function capitalize(word){
    return word.charAt(0).toUpperCase() + word.slice(1)
};
export function getTodaysDateString(){
    const currentDate = new Date();
    const formator = new Intl.DateTimeFormat('en-Us',{
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });
    return formator.format(currentDate); 
};
export function formatDateString(dateString,options){
    const currentDate = new Date(dateString);
    if(options){
        const formator = new Intl.DateTimeFormat('en-Us',options);
        return formator.format(currentDate); 
    }
    const formator = new Intl.DateTimeFormat('en-Us',{
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });
    return formator.format(currentDate); 
};
export function scrollToTopOfPage(){
    if(document.documentElement.scrollTop > 0){
        window.scroll({
            top: 0,
            behavior: 'smooth'
        })
    }
};
export function transition(type,element,immediateClassNames,delayedClassNames,delay,delayedCallback){
    function handleClasses(classNames,action){
        if(classNames){
            if(Array.isArray(classNames)){
                element.classList[action](...classNames)  
            }else{
                element.classList[action](classNames)
            }
        }
    }
    switch(type){
        case 'add':
        case 'remove':
            handleClasses(immediateClassNames,type);
            if(delayedClassNames){
                setTimeout( ()=>{
                    handleClasses(delayedClassNames,type);
                    if(delayedCallback) delayedCallback(element);
                },delay ? delay:100)
            }
        break;
        case 'add-remove':
            handleClasses(immediateClassNames,'add');
            if(delayedClassNames){
                setTimeout( ()=>{
                    handleClasses(delayedClassNames,'remove');
                    if(delayedCallback) delayedCallback(element);
                },delay ? delay:100)
            }
        break;
    }
};
// export function fixCanvas(canvas,dpi){
//     const styleWidth = +getComputedStyle(canvas).getPropertyValue('width').slice(0,-2);
//     const styleHeight = +getComputedStyle(canvas).getPropertyValue('height').slice(0,-2);
//     canvas.setAttribute('width', styleWidth * dpi);
//     canvas.setAttribute('height', styleHeight * dpi);
//     return canvas;
// };

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
export function limitDateInputSelection(dateElement,numberOfDaysToLimit){
    const today = new Date();
    const now = today.getTime();
    const milliseconds = 86400000;
    const minumumDateTime = now + (numberOfDaysToLimit * milliseconds);
    const minDate = new Date(minumumDateTime);
    const yearSring = zeroPadLeftToString(minDate.getFullYear());
    const monthString = zeroPadLeftToString(minDate.getMonth() + 1);
    const dayString = zeroPadLeftToString(minDate.getDate());
    const dateString = `${yearSring}-${monthString}-${dayString}`;

    dateElement.setAttribute('min', dateString);
};
export function getFutureDateByDays(numberOfDays){
    const today = new Date();
    const nowTimestamp = today.getTime();
    const futureTimestamp = nowTimestamp + (numberOfDays * MILLISECONDS_PER_DAY);
    const futurePeriod = new Date(futureTimestamp);
    const year = zeroPadLeftToString(futurePeriod.getFullYear());
    const month = zeroPadLeftToString(futurePeriod.getMonth() + 1);
    const day = zeroPadLeftToString(futurePeriod.getDate());
    return `${year}-${month}-${day}`;
}
export function disableSelectFieldOption(select,optionValue){
    if(select instanceof Node){
        select.querySelector(`option[value=${optionValue}`).setAttribute('disabled',true);
    }else{
        document.querySelector(`${select} option[value=${optionValue}]`).setAttribute('disabled',true);
    }
};
export function enableSelectFieldOption(select,optionValue){
    if(select instanceof Node){
        select.querySelector(`option[value=${optionValue}`).removeAttribute('disabled');
    }else{
        document.querySelector(`${select} option[value=${optionValue}]`).removeAttribute('disabled');
    }
};

export function transitionElementOpen(element,callback){
    element.classList.add('open');
    setTimeout( ()=>{
        element.classList.add('show');
        if(callback) callback(element);
    },100);
};
export function transitionElementClose(element,callback){
    element.classList.remove('open');
    setTimeout( ()=>{
        element.classList.remove('show');
        if(callback) callback(element);
    },100);
};

export function appendElementToParentWithFragment(parent,child){
    if(!parent instanceof Node){
        console.warn('parent element is not a html element');
        return;
    }
    if(!child instanceof Node){
        console.warn('child element is not a html element');
        return;
    }
    parent.appendChild( new DocumentFragment().appendChild(child) );
}
export function clearParentElement(parentElement){
    if(parentElement.lastChild){
        while(parentElement.lastChild){
            parentElement.removeChild(parentElement.lastChild);
        }
    }
};
export function createHtmlElement(tagName, attributes = {}, content, listeners){
    const element = document.createElement(tagName);
 
    for(const [key, value] of Object.entries(attributes)){
        if(key === 'class'){
            element.classList.add(...value.split(' '));
        }else if((Object.getOwnPropertyDescriptor(element, key)?.writable)){
            element[key] = value;
        }else{
            element.setAttribute(key, value);
        }
    }
    if(content){
        if(Array.isArray(content)){
            content.forEach(item => {
                if(item instanceof Node){
                    element.appendChild(item);
                }else{
                    element.appendChild(document.createTextNode(item));
                }
            });
        }else if(content instanceof Node){
            element.appendChild(content);
        }else{
            element.textContent = content;
        }
    }
    if(listeners){
        if(Array.isArray(listeners)){
            listeners.forEach( listener => {
                element.addEventListener(listener.type, listener.listen);
            });
        }
        if(isObject(listeners)){
            element.addEventListener(listeners.type, listeners.listen);
        }
        
    }

    return element;
};

const ItemRemoveEvent = new CustomEvent('bbb:remove-order-item');