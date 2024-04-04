
function createSugarCookieFormItem(){

    const sugarCookieItem = document.createElement('div');
    sugarCookieItem.classList.add('sugar-cookie-information','open');

    const header = document.createElement('header');

    const h3 = document.createElement('h3');
    h3.textContent = 'sugar cookies';
    const removeButton = document.createElement('button');
    removeButton.setAttribute('type', 'button');
    removeButton.setAttribute('value', 'sugar-cookie');
    removeButton.classList.add('btn','remove-order-btn');
    removeButton.textContent = 'X';

    header.append(h3,removeButton);

    const quantityDozenLabel = document.createElement('label');
    quantityDozenLabel.setAttribute('for', 'SugarCookieQuantity');

    const quantityDozenLabelTextElement = document.createElement('div');
    quantityDozenLabelTextElement.textContent = 'How many would you like?';

    // stoped here....

    return `<div class="sugar-cookie-information open">
        <header>
            <h3>Sugar Cookies</h3>
            <button type="button" class="btn remove-order-btn" value="sugarcookie">X</button>
        </header>

        <label for="SugarCookieQuantity">
            <div>How many would you like?</div>
            <select name="sugarcookiequantity" id="SugarCookieQuantity" autocomplete="off" required>
                <option value="1" selected>1 dozen</option>
                <option value="2">2 dozen</option>
                <option value="3">3 dozen</option>
                <option value="4">4 dozen</option>
                <option value="5">5 dozen</option>
                <option value="6">6 dozen</option>
            </select>
        </label>

        <label for="SugarCookieDateNeeded">
            <div>When are they needed?</div>
            <input type="date" name="sugarcookiedate" id="SugarCookieDateNeeded" min="2024-04-17" autocomplete="off" required>
        </label>

        <label for="SugarCookieTheme">
            <div>Theme/Occasion</div>
            <textarea name="sugarcookietheme" id="SugarCookieTheme" cols="30" rows="1" autocomplete="off" required></textarea>
        </label>

        <label for="SugarCookiePersonalization">
            <div>Personalization</div>
            <textarea name="sugarcookiepersonalization" id="SugarCookiePersonalization" cols="30" rows="2" autocomplete="off" required></textarea>
        </label>
    </div>`;
};

const OrderForm = {
    form: undefined,
    itemSelectElement: undefined,
    retrivalTypeSelect: undefined,
    addressInformationDisplay: undefined,
    orderItemElements: undefined,
    itemTabs: undefined,

    displayInformation(event){
        
        if(event.target.dataset.input){

            document.querySelector(`[data-output=${event.target.dataset.input}]`).textContent = event.target.value;
        }

    },
    handleAddressDisplay(event){

        if(event.target.value === 'shipping' || event.target.value === 'delivery'){

            if(!OrderForm.addressInformationDisplay.classList.contains('show')){

                OrderForm.addressInformationDisplay.classList.add('show');

            }   

        }else{

            if(OrderForm.addressInformationDisplay.classList.contains('show')){

                OrderForm.addressInformationDisplay.classList.remove('show');

            }               
        }
    },
    zeroPadLeftToString(num){

        if(+num > 9) return `${num}`;

        return `0${num}`;
    },
    limitDateSelection(dateElement,numberOfDaysToLimit){

        const today = new Date();
        const now = today.getTime();
        const milliseconds = 86400000;
        const minumumDateTime = now + (numberOfDaysToLimit * milliseconds);
        const minDate = new Date(minumumDateTime);
        const yearSring = OrderForm.zeroPadLeftToString(minDate.getFullYear());
        const monthString = OrderForm.zeroPadLeftToString(minDate.getMonth() + 1);
        const dayString = OrderForm.zeroPadLeftToString(minDate.getDate());
        const dateString = `${yearSring}-${monthString}-${dayString}`;

        dateElement.setAttribute('min', dateString);
    },
    addItemToOrder(event){
        OrderForm.itemTabs.forEach( itemTab => {
            if(itemTab.classList.contains('active')){
                itemTab.classList.remove('active');
            }
        });

        OrderForm.orderItemElements.forEach( orderItem => {
            if(orderItem.classList.contains('open')){
                orderItem.classList.remove('open');
            }
        });
        if(event.target.value){
            const itemTab = document.querySelector(`[data-item-tab="${event.target.value}"]`);
            itemTab.classList.add('active');
            itemTab.classList.add('show');

            const orderItem = document.querySelector(`[data-order-item="${event.target.value}"]`);
            orderItem.classList.add('open');
        }
        

        
    },
    handleItemTabSwitch({target}){

        if(target.classList.contains('show')){

            OrderForm.itemTabs.forEach( itemTab => {
                if(itemTab.classList.contains('active')){
                    itemTab.classList.remove('active');
                }
            });

            target.classList.add('active');

            OrderForm.orderItemElements.forEach( orderItem => {
                if(orderItem.classList.contains('open')){
                    orderItem.classList.remove('open');
                }
            });

            document.querySelector(`[data-order-item="${target.dataset.itemTab}"]`).classList.add('open');

        }
    },
    listen(){

        OrderForm.itemSelectElement.addEventListener('input', OrderForm.addItemToOrder);

        OrderForm.form.querySelectorAll('input').forEach( inputElement => {

            inputElement.addEventListener('input', OrderForm.displayInformation)
        });
        OrderForm.form.querySelectorAll('select').forEach( selectElement => {

            selectElement.addEventListener('input', OrderForm.displayInformation)
        });
        
        
        OrderForm.retrivalTypeSelect.addEventListener('input', OrderForm.handleAddressDisplay);

        OrderForm.itemTabs.forEach( itemTab => {
            itemTab.addEventListener('click', OrderForm.handleItemTabSwitch)
        });
    },
    initialize(){
        OrderForm.form = document.querySelector('.order-form');
        OrderForm.itemSelectElement = document.querySelector('#OrderFormItem');
        OrderForm.retrivalTypeSelect = document.querySelector('#OrderFormRetrival');
        OrderForm.addressInformationDisplay = document.querySelector('.address-information');

        OrderForm.form.querySelectorAll('input[type=date]').forEach( dateInputElement => {

            OrderForm.limitDateSelection(dateInputElement,14);
        });

        OrderForm.orderItemElements = document.querySelectorAll('.order-item');
        OrderForm.itemTabs = document.querySelectorAll('[data-item-tab]');
    }
};

function initializeOrderCookiePage(){

    OrderForm.initialize();
    OrderForm.listen();

};
initializeOrderCookiePage();