import { isPageNavigationDisplayed, pageNavigation } from "../../navigation.js";
import { ANotification, PageNotification } from "../../notification.js";
import { sanitizeInput } from "../../sanitation.js";
import { createHtmlElement, openInHouseBakerySign, transition } from "../../utilities.js";
import { checkInputValidity } from "../../validation.js";


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
    fakeSubmit(clickEvent){
        clickEvent.preventDefault();
        const pageLoader = document.querySelector('#PageLoader');
        transition('add',pageLoader,'open',['show','loading']);
        setTimeout( ()=> {
            transition('remove',pageLoader,['show','loading'],'open',100, ()=>{
                PageNotification.notify('This was just a test.',
                    'Thank you for testing with Baked by Bec.',
                    'please close X'
                );
            });
        },3000)
    },
    submit(submitEvent){
        submitEvent.preventDefault();
        console.log('hellow')
        const pageLoader = document.querySelector('#PageLoader');
        transition('add',pageLoader,'open',['show','loading']);

        const formData = new FormData(Contact.form);
        
        const name = formData.get('name');
        const email = formData.get('email');
        const topic = formData.get('topic');
        const message = formData.get('message');

        try{
    
            const sanitizedName = sanitizeInput(name);
            const [ nameError ] = checkInputValidity(sanitizedName,{
                isString: true,
                minLength: 3,
                maxLength: 200
            });
            if(nameError) throw nameError;

            const sanitizedEmail = sanitizeInput(email);
            const [ emailError ] = checkInputValidity(sanitizedEmail,{
                isString: true,
                type: 'email',
                minLength: 5,
                maxLength: 254
            });
            if(emailError) throw emailError;


            const [ topicError, validTopic ] = checkInputValidity(topic,{
                isString: true,
                minLength: 3,
                maxLength: 50
            });
            if(topicError) throw topicError;
            if(validTopic && validTopic === 'other'){
                const otherTopic = formData.get('other-topic');
                if(!otherTopic)throw new Error(`"other" topic must be included. Please give a topic.`);
                const sanitizedOtherTopic = sanitizeInput(otherTopic);
                const [ otherTopicError ] = checkInputValidity(sanitizedOtherTopic,{
                    isString: true,
                    minLength: 3,
                    maxLength: 50
                });
                if(otherTopicError) throw otherTopicError;
            }
            const sanitizedMessage = sanitizeInput(message);
            const [ messageError ] = checkInputValidity(sanitizedMessage,{
                isString: true,
                minLength: 3,
                maxLength: 500
            });
            if(messageError) throw messageError;
            transition('remove',pageLoader,['show','loading'],'open',100, ()=>{
                PageNotification.notify('This was just a test',
                    'Thank you for testing with Baked by Bec',
                    'please close X',
                );
            });
        }catch(error){
            console.warn(error);
            transition('remove',pageLoader,'show',['open','loading']);
            PageNotification.notify('submission error.',
                'submition process failed. Please try again',
                'please close X'
            );
        }
    },
    listen(){
        this.topicSelect.addEventListener('change', (changeEvent)=>{
            this.handleOtherTopicOption(changeEvent);
        });
        //this.form.addEventListener('submit', Contact.submit);
       
        this.submitButton.addEventListener('click', Contact.fakeSubmit);
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
    ANotification.initialize();
    PageNotification.initialize();
};

initializeContactPage();