import { transitionElementOpen } from "../../utilities.js";

export const OrderProgress = {
    element: undefined,
    elements: undefined,

    activate(element,callback){
        if(!element.classList.contains('active')){
            element.classList.add('active');
            if(callback) callback();
        }
    },
    deactivate(element,callback){
        if(element.classList.contains('active')){
            element.classList.remove('active');
           if(callback) callback();
        }
    },
    complete(element){
        if(element && !element.classList.contains('completed')){
            element.classList.add('completed');
        }
    },
    uncomplete(element){
        if(element && element.classList.contains('completed')){
            element.classList.remove('completed');
        }
    },
    setState(state){
        OrderProgress.activate(this.elements[state], ()=>{
            OrderProgress.complete(this.elements[state-1])
        })
    },
    removeState(state){
        OrderProgress.deactivate(this.elements[state], ()=>{
            OrderProgress.uncomplete(this.elements[state-1])
        })
    },
    inspectState(){
        const activeItems = this.elements.filter( item =>{
            if(!item.classList.contains('active') && item.dataset.progressState !== '5' && item.dataset.progressState !== '6'){
                    return item;
            }
        });
        return activeItems;
    },
    inspectAreaInputProgress(classSelector,progressState){
        const inputs = [...document.querySelectorAll(`.js-order-form ${classSelector}`)];
        const limit = inputs.length;
        let counter = 0;
        inputs.forEach( input => {
            if(input.type === 'file' && input.files[0]){
                counter++;
            }else if(input.value && input.value !== '-- select --' && input.value !== ""){
                counter++;
            }
        });
        if(limit === counter){
            OrderProgress.setState(progressState);
        }else{
            OrderProgress.removeState(progressState);
        }
    },
    listenToAreaInputs(classSelector,progressState){
        [...document.querySelectorAll(`.js-order-form ${classSelector}`)].forEach( input => {
            if(!input.classList.contains('listening')){
                input.classList.add('listening');
                if(input.type === 'file'){
                    input.addEventListener('change', ()=>{
                        OrderProgress.inspectAreaInputProgress(classSelector,progressState);
                    })
                }else if(input.tagName === 'SELECT'){
                    input.addEventListener('input', ()=>{
                        OrderProgress.inspectAreaInputProgress(classSelector,progressState);
                    })
                }else{
                    input.addEventListener('blur', ()=>{
                        OrderProgress.inspectAreaInputProgress(classSelector,progressState);
                    })
                }
            }
        });
    },
    display(){
        transitionElementOpen(OrderProgress.element);
    },
    initialize(progressBarElement){

        OrderProgress.element = progressBarElement;
        
        try{
            if(!progressBarElement instanceof Node){
                throw new Error('PROGRESS_BAR_ERROR: progress bar not a node element');
            }
            this.elements = [...progressBarElement.querySelectorAll('[data-progress-state]')];
        }catch(error){
            console.warn('ORDER PROGRESS ERROR: ', error.message);
        }
       
        
    }
}