

const OrderForm = {
    form: undefined,

    displayInformation(event){
        
        if(event.target.dataset.input){

            document.querySelector(`[data-output=${event.target.dataset.input}]`).textContent = event.target.value;
        }

    },
    listen(){

        OrderForm.form.querySelectorAll('input').forEach( inputElement => {

            inputElement.addEventListener('input', OrderForm.displayInformation)
        });
        OrderForm.form.querySelectorAll('select').forEach( selectElement => {

            selectElement.addEventListener('input', OrderForm.displayInformation)
        })
    },
    initialize(){
        OrderForm.form = document.querySelector('.order-form');
        
    }
};

function initializeOrderCookiePage(){

    const retrivalTypeSelect = document.querySelector('#OrderFormRetrival');

    retrivalTypeSelect.addEventListener('input', (event)=>{

        const addressInformation = document.querySelector('.address-information');

        if(event.target.value === 'shipping' || event.target.value === 'delivery'){

            if(!addressInformation.classList.contains('open') &&
            !addressInformation.classList.contains('show')){

                addressInformation.classList.add('open');

                setTimeout(() => {
    
                    addressInformation.classList.add('show');
    
                }, 100);
            }   

        }else{

            if(addressInformation.classList.contains('open') ||
            addressInformation.classList.contains('show')){

                addressInformation.classList.remove('show');

                setTimeout(() => {
    
                    addressInformation.classList.remove('open');
    
                }, 200);
            }               
        }
    });

    OrderForm.initialize();
    OrderForm.listen();

};
initializeOrderCookiePage();