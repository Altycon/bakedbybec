import { transition } from "../../utilities.js";

export const OrderProgress = {
    element: undefined,
    elements: undefined,

    hide(){
        transition('remove',OrderProgress.element,null,'show');
    },
    display(){
        transition('add',OrderProgress.element,'open','show');
        setTimeout( ()=> OrderProgress.hide(),2000);
    },
    activate(element,callback){
        if(!element.classList.contains('active')){
            element.classList.add('active');
            OrderProgress.display();
            if(callback) callback();
        }
    },
    deactivate(element,callback){
        if(element.classList.contains('active')){
            element.classList.remove('active');
            OrderProgress.display();
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
            if(!item.classList.contains('active') && 
                item.dataset.progressState !== '5' && 
                    item.dataset.progressState !== '6'){
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
                    input.addEventListener('change', ()=>{
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
    reset(){
        [...document.querySelectorAll(`.js-order-form [name]`)].forEach( input => {
            if(input.classList.contains('listening')){
                input.classList.remove('listening');
            }
        });
        this.elements.forEach( element => {
            this.uncomplete(element);
            this.deactivate(element);
        });
        this.setState(0);
    },
    initialize(){

        OrderProgress.element = document.querySelector('.js-order-progress-bar');
        
        try{
            if(!OrderProgress.element instanceof Node){
                throw new Error('PROGRESS_BAR_ERROR: progress bar not a node element');
            }
            this.elements = [...OrderProgress.element.querySelectorAll('[data-progress-state]')];
        }catch(error){
            console.warn('ORDER PROGRESS ERROR: ', error.message);
            throw error;
        } 
    }
}