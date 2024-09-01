import { createIntersectionObserver } from "../../intersection_observer.js";
import { isPageNavigationDisplayed, pageNavigation } from "../../navigation.js";
import { sanitizeInputs } from "../../sanitation.js";
import { openInHouseBakerySign } from "../../utilities.js";
import { validate } from "../../validation.js";

const BookClass = {
    form: undefined,
    nameInput: undefined,
    emailInput: undefined,
    classTypeSelect: undefined,
    classLevelSelect: undefined,

   
    submitForm(submitEvent){
        submitEvent.preventDefault();

        const formData = new FormData(submitEvent.target);
        
        const name = formData.get('name');
        const email = formData.get('email');
        const classType = formData.get('class-type');
        const classLevel = formData.get('class-level');

        const sanitized = sanitizeInputs([
            name,email,classType,classLevel
        ]);

        try{
            const validated = validate([
                { value: sanitized.name, type: 'NAME'},
                { value: sanitized.email, type: 'EMAIL'}
            ])

        }catch(error){

        }
    },
    listen(){
        this.form.addEventListener('submit', (event)=>{
            this.submitForm(event)
        });
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
};

initializeBookClassPage();