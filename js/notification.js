export const ANotification = {
    element: undefined,
    list: undefined,
    active: false,
    timeOut: undefined,
    timeOutDelay: 2000,
    items: [],
    handleEndingTransition(transitionEvent){
        if(ANotification.items.length === 0){
            setTimeout( ()=>{
                ANotification.active = false;
                ANotification.element.classList.remove('open');
            },500);
        }else{
            if(ANotification.timeOut) clearTimeout(ANotification.timeOut);
            ANotification.open();
        }
        transitionEvent.target.remove();
    },
    open(){
        if(!ANotification.element.classList.contains('open')){
            ANotification.element.classList.add('open');
        }
        if(ANotification.items.length > 0){
            const item = ANotification.items[0];
            if(item){
                ANotification.list.appendChild(item);
                ANotification.timeOut = setTimeout(()=>{
                    item.addEventListener('transitionend', (transitionEvent)=>{
                        setTimeout( ()=>{
                            for(let i = 0; i < ANotification.items.length; i++){
                                const storedItem = ANotification.items[i];
                                if(storedItem && storedItem === item){
                                    ANotification.items.splice(i,1);
                                    item.addEventListener('transitionend', ANotification.handleEndingTransition);
                                    transitionEvent.target.classList.remove('show');
                                    break;
                                }
                            }
                        },ANotification.timeOutDelay);
                    });
                    item.classList.add('show');
                },100);
            }
        }
    },
    addItem(item){
        ANotification.items.push(item);
    },
    createItem(message){
        const li = document.createElement('li');
        li.classList.add('notification-item','js-notification-item')
        const button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.classList.add('btn','notification-close-btn','js-notification-close-btn');
        button.textContent = 'x';
        button.addEventListener('click', ()=>{
            for(let i = 0; i < ANotification.items.length; i++){
                const storedItem = ANotification.items[i];
                if(storedItem && storedItem === li){
                    ANotification.items.splice(i,1);
                    li.remove();
                    if(ANotification.timeOut) clearTimeout(ANotification.timeOut);
                    break;
                }
            }
            if(ANotification.items.length > 0){
                ANotification.open();
            }
            
        });
        const messageElement = document.createElement('p');
        messageElement.classList.add('message');
        messageElement.textContent = message;
        li.append(button,messageElement);
        
        return li;
    },
    notify(message){
        if(!ANotification.active){
            ANotification.active = true;
            ANotification.addItem(
                ANotification.createItem(message)
            );
            if(ANotification.items.length > 0){
                ANotification.open();   
            }
        }else{
            ANotification.addItem(
                ANotification.createItem(message)
            );
        }
    },
   
    initialize(){
        try{
            ANotification.element = document.querySelector('.js-notification');
            if(!ANotification.element) throw new Error('missing element - notification element');
            ANotification.list = document.querySelector('.js-notification-list');
            if(!ANotification.list) throw new Error('missing element - notification list');
          
        }catch(error){
            console.error(`ANotification Error: `,error.message);
        }
    }
};