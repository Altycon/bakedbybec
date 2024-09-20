
export const Confirmation = {
    element: undefined,
    messageOutput: undefined,
    cancelButton: undefined,
    confirmButton: undefined,
    callback: undefined,
    
    cancel(event){
        event.preventDefault();
        Confirmation.close();
        event.target.removeEventListener('click', Confirmation.cancel);
        if(Confirmation.callback){
            Confirmation.callback(false);
            Confirmation.callback = undefined;
        }
    },
    accept(event){
        event.preventDefault();
        Confirmation.close();
        if(Confirmation.callback) Confirmation.callback(true);
        Confirmation.cancelButton.removeEventListener('click', Confirmation.cancel);
        event.target.removeEventListener('click', Confirmation.accept);
        if(Confirmation.callback) Confirmation.callback = undefined;
    },
    open(){
        Confirmation.cancelButton.addEventListener('click', Confirmation.cancel);
        Confirmation.confirmButton.addEventListener('click', Confirmation.accept);

        Confirmation.element.classList.add('open');
        setTimeout(()=>{
            Confirmation.element.classList.add('show');
            document.body.style.overflow = 'hidden';
        },100);
    },
    close(){
        Confirmation.element.classList.add('removing');
        setTimeout(()=>{
            Confirmation.element.classList.remove('open','show','removing');
            Confirmation.messageOutput.textContent = "";
            document.body.style.overflow = 'auto';
        },500);
    },
    setMessage(message){
        Confirmation.messageOutput.textContent = message;
    },
    confirm(message,callback){
        Confirmation.setMessage(message);
        if(callback) Confirmation.callback = callback;
        Confirmation.open();
    },
    initialize(){
        try{
            Confirmation.element = document.querySelector('.confirmation');
            if(!Confirmation.element) throw new Error('missing element - confirmation element');
            Confirmation.messageOutput = document.querySelector('.confirmation .message');
            if(!Confirmation.messageOutput) throw new Error('missing element - confirmation message');
            Confirmation.cancelButton = document.querySelector('.js-confirmation-cancel-btn');
            if(!Confirmation.cancelButton) throw new Error('missing element - confirmation cancel button');
            Confirmation.confirmButton = document.querySelector('.js-confirmation-confirm-btn');
            if(!Confirmation.confirmButton) throw new Error('missing element - confirmation confirm button');
        }catch(error){
            console.error('Confirmation Error: ',error.message);
            throw error;
        }
    }
};
