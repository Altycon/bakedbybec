
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

    createItemOutputElement(title,value,itemId){
        const div = document.createElement('div');
        const span = document.createElement('span');
        span.textContent = title;
        const p = document.createElement('p');
        if(title !== 'Type'){
           
            p.setAttribute('data-output', `${itemId}${title.toLowerCase()}`);
        }
        p.textContent = value;
        div.append(span,p);
        return div;
    },
    createItemDetailsElement(details,itemId){
        const div = document.createElement('div');
        div.classList.add('details');
        const span = document.createElement('span');
        span.textContent = 'Details';
        div.appendChild(span);
    
        Object.keys(details).forEach( key => {
    
            const p = document.createElement('p');
            p.textContent = `${key}:`;
            const span = document.createElement('span');
            span.setAttribute('data-output', `${itemId}${key.toLowerCase()}`);
            span.textContent = details[key];
            p.appendChild(span);
            
            div.appendChild(p);
        });
    
        return div;
    },
    createItemTotalElement(totalPrice,itemId){
        const div = document.createElement('div');
        div.classList.add('item-total');
        const span = document.createElement('span');
        span.textContent = 'Total';
        div.appendChild(span);
    
        const p = document.createElement('p');
        p.classList.add('item-total-price')
        p.innerHTML = `$&nbsp;<span data-output="${itemId}totalprice">${totalPrice}</span>`;
    
        div.appendChild(p);
        return div;
    },
    createItem(itemType,itemId){

        let itemName;

        const parts = itemType.split('-');

        if(parts.length > 1){
            itemName = parts[0] + ' ' + parts[1];
        }else{
            itemName = itemType;
        }

        let details = {};

        switch(itemType){

            case 'sugar-cookies':
                details.theme = 'none';
                details.personalization = 'none';
            break;
            case 'cakes':
                details.flavor = 'none';
                details.frosting = 'none';
                details.theme = 'none';
                details.personalization = 'none';
            break;
            case 'cupcakes':
                details.flavor = 'none';
                details.frosting = 'none';
                details.theme = 'none';
                details.personalization = 'none';
            break;
            case 'drop-cookies':
                details.flavor = 'none';
                details.addon = 'none';
            break;
            case 'cake-pops':
                details.flavor = 'none';
                details.frosting = 'none';
            break;
        }

        

        const item = document.createElement('li');
        item.classList.add('order-invoice-item');
        item.setAttribute('data-item-id',itemId);
    
        item.append(
            OrderInvoice.createItemOutputElement('Type',itemName,itemId),
            OrderInvoice.createItemOutputElement('Quantity', 'none',itemId),
            OrderInvoice.createItemOutputElement('Date', 'none',itemId),
            OrderInvoice.createItemOutputElement('Size', `none`,itemId),
            OrderInvoice.createItemDetailsElement(details,itemId),
            OrderInvoice.createItemTotalElement('00.00',itemId)
        );
    
        return item;
    },
    addItemToInvoice(itemType,itemId){
        
        OrderInvoice.itemListElement.appendChild(
            OrderInvoice.createItem(itemType,itemId)
        )
        
    },
    removeItemFromInvoice(itemId){

        const invoiceItem = OrderInvoice.element.querySelector(`[data-item-id="${itemId}"]`);
        const parent = invoiceItem.closest('ul');
        parent.removeChild(invoiceItem);
    },
    addDataToInvoice(event){

        OrderInvoice.element.querySelector(`[data-output="${event.target.dataset.input}"]`).textContent = event.target.value;
    },
    calculateInvoiceTotal(){

        let sum = 0;

        OrderInvoice.element.querySelectorAll('.item-total-price').forEach( itemTotalElement => {

            const totalItemPrice = Number(itemTotalElement.textContent.substring(2));

            sum += totalItemPrice;
        });

        OrderInvoice.element.querySelector(`[data-output="sub-total"]`).textContent = `${sum}.00`;

        const deliveryPriceElement = OrderInvoice.element.querySelector('[data-output="delivery"]');
        const deliveryPrice = Number(deliveryPriceElement.textContent.substring(2));

        console.log('delivery', deliveryPrice)

        if(deliveryPrice > 0){

            sum += deliveryPrice;
        }

        const shippingPriceElement = OrderInvoice.element.querySelector('[data-output="shipping"]');
        const shippingPrice = Number(shippingPriceElement.textContent);

        
        
        if(shippingPrice > 0){

            sum += shippingPrice;
        }

        OrderInvoice.element.querySelector(`[data-output="total"]`).textContent = `${sum}.00`

    },
    closeInvoice(event){

        event.preventDefault();

        OrderInvoice.element.classList.remove('show');

        setTimeout( ()=> {

            OrderInvoice.element.classList.remove('open');

        },500)
    },
    openInvoice(event){

        event.preventDefault();

        OrderInvoice.element.classList.add('open');

        setTimeout( ()=> {

            OrderInvoice.element.classList.add('show');

        },100);

        document.querySelector('.order-invoice-close-btn').addEventListener('click', OrderInvoice.closeInvoice);
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

    displayInformation(event){
        
        if(event.target.dataset.input){

            document.querySelector(`[data-output=${event.target.dataset.input}]`).textContent = event.target.value;
        }

    },
    handleRetrievalSelect(event){

        if(event.target.value === 'shipping' || event.target.value === 'delivery'){

            if(event.target.value === 'shipping'){

                document.querySelector(`[data-output="shipping"]`).textContent = `15.00`;

                OrderInvoice.calculateInvoiceTotal();

            }else{

                // open a delivery milage price calculator?
            }

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
    handleItemTabSwitch({target}){

        if(target.classList.contains('show')){

            const itemTabs = document.querySelector('.item-information-tabs');

           [...itemTabs.children].forEach( tab => {
                if(tab.classList.contains('active')){
                    tab.classList.remove('active');
                }
            });

            target.classList.add('active');

            OrderForm.orderItemElements.forEach( orderItem => {
                if(orderItem.classList.contains('open')){
                    orderItem.classList.remove('open');
                }
            });

            document.querySelector(`[data-item-id="${target.dataset.connectionId}"]`).classList.add('open');

        }
    },
    removeItemTab(itemId){
        
        const itemTabs = document.querySelector('.item-information-tabs');

        [...itemTabs.children].forEach( (tab,index) => {
         
            if(tab && tab.dataset.connectionId === itemId){
                itemTabs.removeChild(tab);

                if(itemTabs.children[index - 1]){
                    itemTabs.children[index - 1].classList.add('active');

                    const connectionId = itemTabs.children[index - 1].dataset.connectionId;

                    document.querySelector(`[data-item-id="${connectionId}"]`).classList.add('open');
                }
            }
        })
    },
    createItemTab(connectionId,itemType){
        const div = document.createElement('div');
        div.classList.add('item-tab');
        div.setAttribute('data-connection-id', connectionId);

        const parts = itemType.split('-');
        if(parts.length > 1){

            div.textContent = parts[0] + ' ' + parts[1];

        }else{

            div.textContent = itemType
        }
        
        return div;
    },
    addItemTab(connectionId,itemType){

        const itemTabs = document.querySelector('.item-information-tabs');

        [...itemTabs.children].forEach( tab => {

            if(tab.classList.contains('active')){
                tab.classList.remove('active');
            }
        });

        const newTab = OrderForm.createItemTab(connectionId,itemType);
        newTab.classList.add('show');
        newTab.classList.add('active');
        newTab.addEventListener('click', OrderForm.handleItemTabSwitch);

        const tabParent = document.querySelector('.item-information-tabs');
        tabParent.appendChild(newTab);
    },
    enableItemSelection(itemSelection,itemValue){

        itemSelection.querySelector(`option[value="${itemValue}"]`).removeAttribute('disabled');

        OrderForm.itemSelectElement.value = "";
    },
    removeItemFromOrder(event){

        event.preventDefault();

        const orderItem = event.target.closest('li');

        orderItem.classList.remove('open');

        orderItem.classList.remove('active');

        OrderForm.disableOrderItemInputs(orderItem);

        OrderForm.removeItemTab(orderItem.dataset.itemId);

        OrderForm.enableItemSelection(OrderForm.itemSelectElement,orderItem.dataset.orderItem);


        OrderInvoice.removeItemFromInvoice(orderItem.dataset.itemId);

        OrderInvoice.calculateInvoiceTotal();
    },
    
    disableItemSelection(itemSelection,itemValue){
      
        itemSelection.querySelector(`option[value="${itemValue}"]`).setAttribute('disabled', 'true');
    },
    activateOrderItem(orderItem){

        orderItem.classList.add('open');

        orderItem.classList.add('active'); // active state

        orderItem.querySelector('.remove-order-btn').addEventListener('click', OrderForm.removeItemFromOrder)

       
    },
    listenToOrderItem(orderItemElement){

        orderItemElement.querySelectorAll('[data-input]').forEach( dataInput => {

            dataInput.addEventListener('input', OrderInvoice.addDataToInvoice);
        });

        orderItemElement.querySelectorAll('select').forEach( selectElement => {

            if(selectElement.name.includes('cake') && !selectElement.name.includes('cup') && !selectElement.name.includes('pop')){

                if(selectElement.name.includes('size')){

                    selectElement.addEventListener('input', (event)=>{
                        [...event.target.children].forEach( option => {
                            if(option.value === event.target.value){

                                const itemPrice = Number(option.dataset.price);

                                const cakeQuantity = orderItemElement.querySelector('select[name="cakequantity"]').value;

                                if(cakeQuantity){

                                    const currentItemPrice = Number(cakeQuantity) * itemPrice;

                                    document.querySelector(`[data-output="${orderItemElement.dataset.itemId}totalprice"]`).textContent = `${currentItemPrice}.00`;

                                    OrderInvoice.calculateInvoiceTotal();

                                }

                            }
                        })
                    })
                }

                if(selectElement.name.includes('quantity')){

                    selectElement.addEventListener('input', (event)=>{

                        const cakeSizeElement = orderItemElement.querySelector('select[name="cakesize"]');

                        if(cakeSizeElement && cakeSizeElement.value !== ""){

                            [...cakeSizeElement.children].forEach( option => {

                                if(option.value === cakeSizeElement.value){

                                    const optionPrice = option.dataset.price;

                                    const newPrice = Number(optionPrice) * Number(event.target.value);

                                    document.querySelector(`[data-output="${orderItemElement.dataset.itemId}totalprice"]`).textContent = `${newPrice}.00`;

                                    OrderInvoice.calculateInvoiceTotal();
                                }
                            })
                        }

                    })
                }

            }else{

                if(selectElement.name.includes('quantity')){

                    selectElement.addEventListener('input', (event)=>{
                        [...event.target.children].forEach( option => {
                            if(option.value === event.target.value){

                                const itemPrice = option.dataset.price;

                                document.querySelector(`[data-output="${orderItemElement.dataset.itemId}totalprice"]`).textContent = `${itemPrice}.00`;

                                OrderInvoice.calculateInvoiceTotal();
                            }
                        })
                    })
                }

            }

            
        })
    },
    disableOrderItemInputs(orderItemElement){
        orderItemElement.querySelectorAll('[data-input]').forEach( dataInput => {

            dataInput.setAttribute('disabled',true);
        });
    },
    enableOrderItemInputs(orderItemElement){
        orderItemElement.querySelectorAll('[data-input]').forEach( dataInput => {

            dataInput.removeAttribute('disabled');
        });
    },
    addItemToOrder(event){

        if(event.target.value){

            

            OrderForm.orderItemElements.forEach( orderItem => {
                if(orderItem.classList.contains('open')){
                    orderItem.classList.remove('open');
                }
            });

            const orderItem = document.querySelector(`[data-order-item="${event.target.value}"]`);

            OrderForm.addItemTab(orderItem.dataset.itemId,event.target.value );

            OrderForm.disableItemSelection(event.target,event.target.value)

            OrderForm.activateOrderItem(orderItem);

            OrderForm.enableOrderItemInputs(orderItem);

            // invoice

            OrderInvoice.addItemToInvoice(event.target.value,orderItem.dataset.itemId);


            OrderForm.listenToOrderItem(orderItem);
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
        
        
        OrderForm.retrivalTypeSelect.addEventListener('input', OrderForm.handleRetrievalSelect);

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
    }
};

function initializeOrderingPage(){

    if(innerWidth < 1100){

        document.querySelector('.navigation-secondary-open-btn').addEventListener('click', (event)=>{
            document.querySelector('.navigation-secondary').classList.toggle('show');
        });
    }

    OrderInvoice.initialize();

    OrderForm.initialize();
    OrderForm.listen();

    document.querySelector('.order-form-invoice-open-btn').addEventListener('click', OrderInvoice.openInvoice);

};
initializeOrderingPage();