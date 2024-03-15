export const ANotification = {

    element: document.querySelector('.notification'),
    closeButton: document.querySelector('.notification .close-btn'),

    open(){

        ANotification.element.classList.add('open');

        setTimeout(()=>{

            ANotification.element.classList.add('show');

            document.body.style.overflow = 'hidden';

        },100);

    },
    close(){

        ANotification.element.classList.remove('show');

        setTimeout(()=>{

            ANotification.element.classList.remove('open');

            document.body.style.overflow = 'auto';

            ANotification.setMessage("");

        },100);

    },
    setMessage(message){

        ANotification.element.querySelector('.message').textContent = message;
    },
    setHTML(message){

        ANotification.element.querySelector('.message').innerHTML = message;
    },  
    clear(){

        ANotification.close();

        ANotification.closeButton.addEventListener('click', ANotification.clear);

    },
    notify(message,html){

        if(html) ANotification.setHTML(message);

        else ANotification.setMessage(message);

        

        ANotification.open();

        ANotification.closeButton.addEventListener('click', ANotification.clear);

        setTimeout( ()=>{

            ANotification.clear();

        },3000)
    }
};