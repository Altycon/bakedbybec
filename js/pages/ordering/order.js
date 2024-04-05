
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


const OrderInvoice = {
    element: undefined,
    itemListElement: undefined,

    createItemOutputElement(title,value){
        const div = document.createElement('div');
        const span = document.createElement('span');
        span.textContent = title;
        const p = document.createElement('p');
        p.textContent = value;
        div.append(span,p);
        return div;
    },
    createItemDetailsElement(details){
        const div = document.createElement('div');
        div.classList.add('details');
        const span = document.createElement('span');
        span.textContent = 'Details';
        div.appendChild(span);
    
        Object.keys(details).forEach( key => {
    
            const p = document.createElement('p');
            p.textContent = key;
            const span = document.createElement('span');
            span.textContent = details[key];
            p.appendChild(span);
            
            div.appendChild(p);
        });
    
        return div;
    },
    createItemTotalElement(totalPrice){
        const div = document.createElement('div');
        div.classList.add('item-total');
        const span = document.createElement('span');
        span.textContent = 'Total';
        div.appendChild(span);
    
        const p = document.createElement('p');
        p.innerHTML = `$&nbsp;<span>${totalPrice}</span>`;
    
        div.appendChild(p);
        return div;
    },
    createItem(itemType){

        let itemName;

        const parts = itemType.split('-');

        if(parts.length > 1){
            itemName = parts[0] + ' ' + parts[1];
        }else{
            itemName = itemType;
        }

        const item = document.createElement('li');
        item.classList.add('order-invoice-item');
    
        item.append(
            OrderInvoice.createItemOutputElement('Type',itemName),
            OrderInvoice.createItemOutputElement('Quantity', 'N/A'),
            OrderInvoice.createItemOutputElement('Date', 'N/A'),
            OrderInvoice.createItemOutputElement('Size', `'N/A`),
            OrderInvoice.createItemDetailsElement({none: 'no details added'}),
            OrderInvoice.createItemTotalElement('N/A')
        );
    
        return item;
    },
    addItemToInvoice(itemType){
        
        OrderInvoice.itemListElement.appendChild(
            OrderInvoice.createItem(itemType)
        )
        
    },
    initialize(){
        OrderInvoice.element = document.querySelector('.order-invoice');
        OrderInvoice.itemListElement = document.querySelector('.order-invoice-items-list');
    }
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
    
    addItemTab(targetValue){

        OrderForm.itemTabs.forEach( itemTab => {
            if(itemTab.classList.contains('show')){
                itemTab.classList.remove('active');
            }
        });

        for(let i = 0; i < OrderForm.itemTabs.length; i++){

            if(!OrderForm.itemTabs[i].classList.contains('active') && !OrderForm.itemTabs[i].classList.contains('show')){

                const parts = targetValue.split('-');
                if(parts.length > 1){

                    OrderForm.itemTabs[i].textContent = parts[0] + ' ' + parts[1];

                }else{

                    OrderForm.itemTabs[i].textContent = targetValue;
                }

                OrderForm.itemTabs[i].setAttribute('data-item-tab', targetValue);
                

                OrderForm.itemTabs[i].classList.add('active');
                OrderForm.itemTabs[i].classList.add('show');

                break;
            }
        }
    },
    removeItemTab(orderItemValue){

        for(let i = 0; i < OrderForm.itemTabs.length; i++){

            if(OrderForm.itemTabs[i].dataset.itemTab === orderItemValue){

                OrderForm.itemTabs[i].classList.remove('active');
                OrderForm.itemTabs[i].classList.remove('show');

                OrderForm.itemTabs[i].dataset.itemTab = "";
                OrderForm.itemTabs[i].textContent = "";

                if(OrderForm.itemTabs[i - 1]){

                    OrderForm.itemTabs[i - 1].classList.add('active');
                    const orderItem = OrderForm.form.querySelector(`[data-order-item="${OrderForm.itemTabs[i-1].dataset.itemTab}"]`);
                    
                    OrderForm.activateOrderItem(orderItem);
                }
                break;
            }
        }
    },
    inableItemSelection(itemSelection,itemValue){

        itemSelection.querySelector(`option[value="${itemValue}"]`).removeAttribute('disabled');

        OrderForm.itemSelectElement.value = "";
    },
    removeItemFromOrder(event){

        event.preventDefault();

        const orderItem = event.target.closest('li');

        orderItem.classList.remove('open');

        orderItem.classList.remove('active');

        OrderForm.removeItemTab(orderItem.dataset.orderItem);

        OrderForm.inableItemSelection(OrderForm.itemSelectElement,orderItem.dataset.orderItem);
    },
    
    disableItemSelection(itemSelection,itemValue){
      
        itemSelection.querySelector(`option[value="${itemValue}"]`).setAttribute('disabled', 'true');
    },
    activateOrderItem(orderItem){

        orderItem.classList.add('open');

        orderItem.classList.add('active'); // active state

        orderItem.querySelector('.remove-order-btn').addEventListener('click', OrderForm.removeItemFromOrder)

       
    },
    
    addItemToOrder(event){

        if(event.target.value){

            OrderForm.orderItemElements.forEach( orderItem => {
                if(orderItem.classList.contains('open')){
                    orderItem.classList.remove('open');
                }
            });

            const orderItem = document.querySelector(`[data-order-item="${event.target.value}"]`);

            OrderForm.disableItemSelection(event.target,event.target.value)

            OrderForm.activateOrderItem(orderItem);

            OrderForm.addItemTab(event.target.value);


            // invoice

            OrderInvoice.addItemToInvoice(event.target.value);
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

    OrderInvoice.initialize();

    OrderForm.initialize();
    OrderForm.listen();

};
initializeOrderCookiePage();