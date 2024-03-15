
export const Confirmation = {

    element: document.querySelector('.confirmation'),
    cancelButton: document.querySelector('.confirmation .controls .cancel-btn'),
    confirmButton: document.querySelector('.confirmation .controls .confirm-btn'),

    open(){

        Confirmation.element.classList.add('open');

        setTimeout(()=>{

            Confirmation.element.classList.add('show');

            document.body.style.overflow = 'hidden';

        },100);

    },
    close(){

        Confirmation.element.classList.remove('show');

        setTimeout(()=>{

            Confirmation.element.classList.remove('open');

            document.body.style.overflow = 'auto';

        },100);

    },
    setMessage(message){

        Confirmation.element.querySelector('.message').textContent = message;
    }
};
