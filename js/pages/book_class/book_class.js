import { createIntersectionObserver } from "../../intersection_observer.js";
import { isPageNavigationDisplayed, pageNavigation } from "../../navigation.js";
import { ANotification, PageNotification } from "../../canopy/notification.js";
import { ADate, openInHouseBakerySign, transition } from "../../utilities.js";
import { ValidateHTMLForm } from "../../form/validation.js";

const BookClass = {
    form: undefined,
    nameInput: undefined,
    emailInput: undefined,
    classTypeSelect: undefined,
    classLevelSelect: undefined,
    agreementCheckbox: undefined,
    submitButton: undefined,
    classTypes: ['kids','adults','duos'],
    classLevels: ['beginner','intermediate','advanced'],
    
    activateSubmitButton(){
        if(!BookClass.submitButton.classList.contains('active')){
            BookClass.submitButton.classList.add('active');
        }
    },
    deactivateSubmitButton(){
        if(BookClass.submitButton.classList.contains('active')){
            BookClass.submitButton.classList.remove('active');
        }
    },
    checkForEmptyFields(){
        const emptyFields = [];
        BookClass.form.querySelectorAll('[name]').forEach( field => {
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
    agree(changeEvent){
        if(changeEvent.target.checked === true){
            const emptyFields = BookClass.checkForEmptyFields();
            if(emptyFields.length > 0){
                changeEvent.target.checked = false;
                BookClass.deactivateSubmitButton();
            }else if(emptyFields.length === 0){
                BookClass.activateSubmitButton();
            }
        }else{
            BookClass.deactivateSubmitButton();
        }
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
    fakeSubmit(clickEvent){
        clickEvent.preventDefault();

        const [error,data]=ValidateHTMLForm(BookClass.form);
        if(error) console.warn(error);
        else console.log(data);

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
    async submitForm(submitEvent){
        submitEvent.preventDefault();

        const pageLoader = document.querySelector('#PageLoader');
        transition('add',pageLoader,'open',['show','loading']);

        try{
            
            const [error,data] = ValidateHTMLForm(BookClass.form);
            if(error) throw new Error(`VALIDATION_ERROR: ${error.message}`);

            data.set('date', ADate());

            const bookClassFetchURL = new URL('/book_class','http://127.0.0.1:3456');
            const fetchResponse = await fetch(bookClassFetchURL,{ method:'post', body:data });
            
            if(fetchResponse.ok){
                
                const successData = await fetchResponse.json();

                transition('remove',pageLoader,['show','loading'],'open',100, ()=>{
                    PageNotification.notify('message has been sent!',
                        'Thank you for requesting a class from Baked by Bec. I will reply to you soon!',
                        'please close X',
                        ()=> window.location.href = successData.redirect
                    );
                });

            }else{
                const errorData = await fetchResponse.json();
                BookClass.handleFetchResponseErrors(errorData.errors);

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
        this.agreementCheckbox.addEventListener('change',BookClass.agree);
        this.submitButton.addEventListener('click', BookClass.submitForm);
    },
    initialize(){
        this.form = document.querySelector('#BookClassForm');
        this.nameInput = document.querySelector('#BookClassFormNameInput');
        this.emailInput = document.querySelector('#BookClassFormEmailInput');
        this.classTypeSelect = document.querySelector('#BookClassFormClassSelect');
        this.classLevelSelect = document.querySelector('#BookClassFormClassTypeSelect');
        this.agreementCheckbox = document.querySelector('#BookClassFormAgreementCheckbox');
        this.submitButton = document.querySelector('#BookClassSubmitButton');

        this.listen();
    }
};

function initializeBookClassPage(){
    const inHouseBakeryButton = document.querySelector('.js-in-house-bakery-btn');
    if(inHouseBakeryButton){
        inHouseBakeryButton.addEventListener('click', openInHouseBakerySign);
    }
    if(!isPageNavigationDisplayed()){
        pageNavigation();
    }

    createIntersectionObserver('.intersection',0.5);
    
    BookClass.initialize();
    ANotification.initialize();
    PageNotification.initialize();
};

initializeBookClassPage();