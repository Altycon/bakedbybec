
export const Confirmation = {
    element: document.querySelector('.confirmation'),
    cancelButton: document.querySelector('.confirmation .controls .cancel-btn'),
    confirmButton: document.querySelector('.confirmation .controls .confirm-btn'),
    callback: undefined,
    
    cancel(event){
        event.preventDefault();
        Confirmation.close();
        event.target.removeEventListener('click', Confirmation.cancel);
        Confirmation.callback = undefined;
    },
    accept(event){
        event.preventDefault();
        Confirmation.close();
        if(Confirmation.callback) Confirmation.callback();
        Confirmation.cancelButton.removeEventListener('click', Confirmation.cancel);
        event.target.removeEventListener('click', Confirmation.accept);
        Confirmation.callback = undefined;
    },
    open(){
        Confirmation.element.classList.add('open');
        Confirmation.cancelButton.addEventListener('click', Confirmation.cancel);
        Confirmation.confirmButton.addEventListener('click', Confirmation.accept);

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
    },
    confirm(message,callback){
        Confirmation.callback = callback;
        Confirmation.setMessage(message);
        Confirmation.open();
    }
};
