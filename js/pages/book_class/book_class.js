import { createIntersectionObserver } from "../../intersection_observer.js";
import { isPageNavigationDisplayed, pageNavigation } from "../../navigation.js";
import { ANotification, PageNotification } from "../../notification.js";
import { sanitizeInput } from "../../sanitation.js";
import { openInHouseBakerySign, transition } from "../../utilities.js";
import { checkInputValidity } from "../../validation.js";

const BookClass = {
    form: undefined,
    nameInput: undefined,
    emailInput: undefined,
    classTypeSelect: undefined,
    classLevelSelect: undefined,
    classTypes: ['kids','adults','duos'],
    classLevels: ['beginner','intermediate','advanced'],
    
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
    submitForm(submitEvent){
        submitEvent.preventDefault();

        const pageLoader = document.querySelector('#PageLoader');
        transition('add',pageLoader,'open',['show','loading']);

        const formData = new FormData(submitEvent.target);
        
        const name = formData.get('name');
        const email = formData.get('email');
        const classType = formData.get('class-type');
        const classLevel = formData.get('class-level');

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

            const sanitizedClassType = sanitizeInput(classType);
            const [ classTypeError, validClassType ] = checkInputValidity(sanitizedClassType,{
                isString: true,
                minLength: 3,
                maxLength: 30
            });
            if(classTypeError) throw classTypeError;
            if(validClassType && !BookClass.classTypes.includes(validClassType)){
                throw new Error('invalid class type - not in list')
            }
            const sanitizedClassLevel = sanitizeInput(classLevel);
            const [ classLevelError, validClassLevel ] = checkInputValidity(sanitizedClassLevel,{
                isString: true,
                minLength: 3,
                maxLength: 200
            });
            if(classLevelError) throw classLevelError;
            if(validClassLevel && !BookClass.classLevels.includes(validClassLevel)){
                throw new Error('invalid class type - not in list')
            }
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
        // this.form.addEventListener('submit', (event)=>{
        //     this.submitForm(event)
        // });
        this.submitButton.addEventListener('click', BookClass.fakeSubmit);
    },
    initialize(){
        this.form = document.querySelector('#BookClassForm');
        this.nameInput = document.querySelector('#BookClassFormNameInput');
        this.emailInput = document.querySelector('#BookClassFormEmailInput');
        this.classTypeSelect = document.querySelector('#BookClassFormClassSelect');
        this.classLevelSelect = document.querySelector('#BookClassFormClassTypeSelect');
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