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

        },100);

    },
    setMessage(message){

        ANotification.element.querySelector('.message').textContent = message;
    }
};