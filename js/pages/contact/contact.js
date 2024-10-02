import { isPageNavigationDisplayed, pageNavigation } from "../../navigation.js";
import { ANotification, PageNotification } from "../../canopy/notification.js";
import { ADate, createHtmlElement, openInHouseBakerySign, transition } from "../../utilities.js";
import { ValidateHTMLForm } from "../../form/validation.js";


const Contact = {
    form: undefined,
    topicSelect: undefined,
    topicArea: undefined,
    agreementCheckbox: undefined,
    submitButton: undefined,

    activateSubmitButton(){
        if(!Contact.submitButton.classList.contains('active')){
            Contact.submitButton.classList.add('active');
        }
    },
    deactivateSubmitButton(){
        if(Contact.submitButton.classList.contains('active')){
            Contact.submitButton.classList.remove('active');
        }
    },
    checkForEmptyFields(){
        const emptyFields = [];
        Contact.form.querySelectorAll('[name]').forEach( field => {
            if(!field.value || field.value === "" || field.value === '-- select --' ){
                field.addEventListener('focus', function removeOutline(focusEvent){
                    focusEvent.target.parentElement.classList.remove('required');
                    focusEvent.target.removeEventListener('focus',removeOutline);
                })
                field.parentElement.classList.add('required');
                emptyFields.push(field);
            }
        });
        return emptyFields;
    },
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
    agree(changeEvent){
        if(changeEvent.target.checked === true){
            const emptyFields = Contact.checkForEmptyFields();
            if(emptyFields.length > 0){
                changeEvent.target.checked = false;
                Contact.deactivateSubmitButton();
            }else if(emptyFields.length === 0){
                Contact.activateSubmitButton();
            }
        }else{
            Contact.deactivateSubmitButton();
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
    handleFetchResponseErrors(errors){
        if(Array.isArray(errors)){
            errors.forEach( error => {
                if(error.type === 'field'){
                    ANotification.notify(error.msg);
                    console.log(`Fetch Response Error: ${error.msg}`)
                }
            })
        }
    },
    async submit(submitEvent){
        submitEvent.preventDefault();
        
        const pageLoader = document.querySelector('#PageLoader');
        transition('add',pageLoader,'open',['show','loading']);

        try{
            const [ error, data ] = ValidateHTMLForm(Contact.form);
            if(error) throw new Error(`VALIDATION_ERROR: ${error.message}`);

            data.set('date', ADate());

            const contactFetchURL = new URL('/contact','http://127.0.0.1:3456');
            const fetchResponse = await fetch(contactFetchURL,{ method:'post', body:data });
            
            if(fetchResponse.ok){
                
                const successData = await fetchResponse.json();
                console.log('success data', successData);

                transition('remove',pageLoader,['show','loading'],'open',100, ()=>{
                    PageNotification.notify('message has been sent!',
                        'Thank you for contacting Baked by Bec. I will reply to you soon!',
                        'please close X',
                        ()=> window.location.href = successData.redirect
                    );
                });

            }else{
                const errorData = await fetchResponse.json();
                Contact.handleFetchResponseErrors(errorData.errors);

                transition('remove',pageLoader,'show',['open','loading']);
                PageNotification.notify('request failed.',
                    'Failed to process request. Please try again',
                    'please close X'
                );
            }
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
        this.agreementCheckbox.addEventListener('change', Contact.agree)
        this.submitButton.addEventListener('click', Contact.fakeSubmit);
    },
    initialzie(){
        this.form = document.querySelector('#ContactForm');
        this.topicArea = document.querySelector('.contact-form .topic');
        this.topicSelect = document.querySelector('#ContactTopicSelect');
        this.agreementCheckbox = document.querySelector('#ContactFormAgreementCheckbox')
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