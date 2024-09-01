import { isPageNavigationDisplayed, pageNavigation } from "../../navigation.js";
import { createHtmlElement, openInHouseBakerySign } from "../../utilities.js";


const Contact = {
    form: undefined,
    topicSelect: undefined,
    topicArea: undefined,
    submitButton: undefined,

    otherTopicComponent(){
        return createHtmlElement('input', {
            type: 'text',
            id: 'OtherTopicInput',
            name: 'other-topic',
            placeholder: 'topic',
            required: 'true',
            class: 'form-text-input'
        });
    },
    appendComponent(component,parent,callback){
        parent.appendChild(
            new DocumentFragment().appendChild(component)
        );
        if(callback) callback(component)
    },
    removeComponent(selector, callback){
        const component = document.querySelector(selector);
        if(callback){
            callback(component);
        }else{
            component.remove();
        }
    },
    addOtherTopicComponent(){
        this.appendComponent( 
            this.otherTopicComponent(),
            this.topicArea, 
            (component)=>{
                component.classList.add('open');
                setTimeout( ()=> { component.classList.add('show'); },100);
        });
    },
    removeOtherTopicComponent(){
        this.removeComponent('#OtherTopicInput', (component)=>{
            component.classList.add('removing');
            setTimeout( ()=> { component.remove(); },300);
        });
    },
    handleOtherTopicOption(changeEvent){
        if(changeEvent.target.value === 'other'){
            if(!document.querySelector('#OtherTopicInput')){
                this.addOtherTopicComponent();
            }
        }else{
            if(document.querySelector('#OtherTopicInput')){
                this.removeOtherTopicComponent();
            }
        }
    },
    listen(){
        this.topicSelect.addEventListener('change', (changeEvent)=>{
            this.handleOtherTopicOption(changeEvent);
        });
        // this.form.addEventListener('submit', (submitEvent)=>{
        //     submitEvent.preventDefault();
        //     const formData = new FormData(submitEvent.target);
        //     console.log(formData);
        // });
        this.submitButton.addEventListener('click', ()=>{
            alert( `you can't do that`)
        })
    },
    initialzie(){
        this.form = document.querySelector('#ContactForm');
        this.topicArea = document.querySelector('.contact-form .topic');
        this.topicSelect = document.querySelector('#ContactTopicSelect');
        this.submitButton = document.querySelector('.js-contact-form-submit-btn');
        this.listen();
    }
}
function initializeContactPage(){

    const inHouseBakeryButton = document.querySelector('.js-in-house-bakery-btn');
    if(inHouseBakeryButton){
        inHouseBakeryButton.addEventListener('click', openInHouseBakerySign);
    }
    if(!isPageNavigationDisplayed()){
        pageNavigation();
    }

    Contact.initialzie();
    
};

initializeContactPage();