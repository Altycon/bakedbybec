import { pageNavigation } from "../../navigation.js";
import { openInHouseBakerySign } from "../../utilities.js";

function otherTopicInputComponent(){
    const input = document.createElement('input');
    input.setAttribute('type','text');
    input.setAttribute('id','OtherTopicInput');
    input.setAttribute('name','other-topic');
    input.setAttribute('placeholder','topic');
    input.setAttribute('required','true');
    input.classList.add('form-text-input');
    return input;
};
function addTopicInputComponent(){
    const topicArea = document.querySelector('.contact-form .topic');
    const topicInput = otherTopicInputComponent();
    topicArea.appendChild(
        new DocumentFragment().appendChild(topicInput)
    );
    topicInput.classList.add('open');
    setTimeout( ()=> { topicInput.classList.add('show'); },100);
};
function removeTopicInputComponent(){
    const otherTopicInput = document.querySelector('#OtherTopicInput');
    otherTopicInput.classList.add('removing');
    setTimeout( ()=> {
        otherTopicInput.remove();
    },300)
}

function initializeContactPage(){

    pageNavigation();
    document.querySelector('.js-in-house-bakery-btn').addEventListener('click', openInHouseBakerySign);

    const topicSelect = document.querySelector('#ContactTopicSelect');
    topicSelect.addEventListener('change',(changeEvent)=>{
       

        if(changeEvent.target.value === 'other'){
            if(!document.querySelector('#OtherTopicInput')){
                addTopicInputComponent();
            }
        }else{
            if(document.querySelector('#OtherTopicInput')){
                removeTopicInputComponent();
            }
        }
    })
    
};

initializeContactPage();