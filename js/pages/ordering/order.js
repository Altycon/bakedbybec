import { pageNavigation } from "../../navigation.js";

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

            event.target.removeEventListener('click', OrderInvoice.closeInvoice);

        },500)
    },
    openInvoice(event){

        if(event) event.preventDefault();

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
    submitButton: undefined,
    itemSelectElement: undefined,
    retrivalTypeSelect: undefined,
    addressInformationDisplay: undefined,

    displayInformation(event){
        
        if(event.target.dataset.input){

            document.querySelector(`[data-output=${event.target.dataset.input}]`).textContent = event.target.value;
        }

    },
    handleRetrievalSelect(event){

        if(event.target.value === 'shipping' || event.target.value === 'delivery'){

            const addressComponent = OrderForm.addressFormComponent();

            OrderForm.form.querySelector('.personal-information').appendChild(new DocumentFragment().appendChild(addressComponent));

            setTimeout( ()=> {

                addressComponent.classList.add('show');
            },100)


            if(event.target.value === 'shipping'){

                document.querySelector(`[data-output="shipping"]`).textContent = `15.00`;

                OrderInvoice.calculateInvoiceTotal();

            }else{

                // open a delivery milage price calculator?
            }

        }else{

            const addressElement = document.querySelector('.address-information');

            if(addressElement){

                addressElement.classList.remove('show');

                setTimeout( ()=>{

                    OrderForm.form.querySelector('.personal-information').removeChild(addressElement);

                },500)

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
    capatilizeWord(word){
        
        return word[0].toUpperCase() + word.substring(1);

    },
    initialWords(words){
        let initials = '';

        for(let i = 0; i < words.length; i++){

            initials += words[i][0]; 
        }

        return initials;
    },
    cakepopComponent(){
        
        const li = document.createElement('li');
        li.classList.add('order-item','cakepop-information');
        li.setAttribute('data-order-item','cake-pops');
        li.setAttribute('data-item-id','cp');

        li.innerHTML += `<header>
                <h3>Cake Pops</h3>
                <button type="button" class="btn remove-order-btn" value="cake-pops">remove&nbsp;&#10007;</button>
            </header>

            <label for="CakepopQuantity">
                <div>How many would you like?</div>
                <select name="cakepopquantity" id="CakepopQuantity" data-input="cpquantity" autocomplete="off" required>
                    <option value=""selected disabled>-- select</option>
                    <option value="1" data-price="18">1 dozen</option>
                    <option value="2" data-price="36">2 dozen</option>
                    <option value="3" data-price="54">3 dozen</option>
                    <option value="4" data-price="72">4 dozen</option>
                    <option value="5" data-price="90">5 dozen</option>
                    <option value="6" data-price="108">6 dozen</option>
                </select>
            </label>

            <label for="CakepopDateNeeded">
                <div>Date needed</div>
                <input type="date" name="cakepopdateneeded" id="CakepopDateNeeded" data-input="cpdate" autocomplete="off" required>
            </label>

            <label for="CakepopFlavor">
                <div>Flavor</div>
                <select name="cakepopflavor" id="CakepopFlavor" data-input="cpflavor" autocomplete="off" required>
                    <option value=""selected disabled>-- select</option>
                    <option value="vanilla">vanilla</option>
                    <option value="chocolate">chocolate</option>
                    <option value="strawberry">strawberry</option>
                    <option value="redvelvet">red velvet</option>
                    <option value="lemon">lemon</option>
                </select>
            </label>

            <label for="CakepopFrosting">
                <div>Frosting</div>
                <select name="cakepopfrosting" id="CakepopFrosting" data-input="cpfrosting" autocomplete="off" required>
                    <option value=""selected disabled>-- select</option>
                    <option value="vanilla">vanilla</option>
                    <option value="chocolate">chocolate</option>
                    <option value="strawberry">strawberry</option>
                    <option value="lemon">lemon</option>
                </select>
            </label>`;
        
        return li;
    },
    cupcakeComponent(){

        const li = document.createElement('li');
        li.classList.add('order-item','cupcake-information');
        li.setAttribute('data-order-item','cupcakes');
        li.setAttribute('data-item-id','cc');

        li.innerHTML += `<header>
                <h3>Cupcakes</h3>
                <button type="button" class="btn remove-order-btn" value="cupcakes">remove&nbsp;&#10007;</button>
            </header>

            <label for="CupcakeQuantity">
                <div>How many would you like?</div>
                <select name="cupcakequantity" id="CupcakeQuantity" data-input="ccquantity" autocomplete="off" required>
                    <option value=""selected disabled>-- select</option>
                    <option value="1" data-price="20">1 dozen</option>
                    <option value="2" data-price="40">2 dozen</option>
                    <option value="3" data-price="60">3 dozen</option>
                    <option value="4" data-price="80">4 dozen</option>
                    <option value="5" data-price="100">5 dozen</option>
                    <option value="6" data-price="120">6 dozen</option>
                </select>
            </label>

            <label for="CupcakeDateNeeded">
                <div>Date needed</div>
                <input type="date" name="cupcakedateneeded" id="CupcakeDateNeeded" data-input="ccdate" autocomplete="off" required>
            </label>

            <label for="CupcakeFlavor">
                <div>Flavor</div>
                <select name="cupcakeflavor" id="CupcakeFlavor" data-input="ccflavor"  autocomplete="off" required>
                    <option value=""selected disabled>-- select</option>
                    <option value="vanilla">vanilla</option>
                    <option value="chocolate">chocolate</option>
                    <option value="strawberry">strawberry</option>
                    <option value="redvelvet">red velvet</option>
                    <option value="lemon">lemon</option>
                </select>
            </label>

            <label for="CupcakeFrosting">
                <div>Frosting</div>
                <select name="cupcakefrosting" id="CupcakeFrosting" data-input="ccfrosting" autocomplete="off" required>
                    <option value=""selected disabled>-- select</option>
                    <option value="vanilla">vanilla</option>
                    <option value="chocolate">chocolate</option>
                    <option value="strawberry">strawberry</option>
                    <option value="lemon">lemon</option>
                </select>
            </label>

            <label for="CupcakeTheme">
                <div>Theme/Occasion</div>
                <textarea name="cupcaketheme" id="CupcakeTheme" cols="30" rows="1" data-input="cctheme" autocomplete="off" required></textarea>
            </label>

            <label for="CupcakePersonalization">
                <div>Personalization</div>
                <textarea name="cupcakepersonalization" id="CupcakePersonalization" cols="30" rows="2" data-input="ccpersonalization" autocomplete="off" required></textarea>
            </label>`;

        return li;
    },
    dropCookieComponent(){

        const li = document.createElement('li');
        li.classList.add('order-item','drop-cookie-information');
        li.setAttribute('data-order-item','drop-cookies');
        li.setAttribute('data-item-id','dc');

        li.innerHTML += `<header>
            <h3>Drop Cookies</h3>
            <button type="button" class="btn remove-order-btn" value="drop-cookies">remove&nbsp;&#10007;</button>
            </header>

            <label for="DropCookieQuantity">
                <div>How many would you like?</div>
                <select name="dropcookiequantity" id="DropCookieQuantity" data-input="dcquantity" autocomplete="off" required>
                    <option value=""selected disabled>-- select</option>
                    <option value="1" data-price="25">1 dozen</option>
                    <option value="2" data-price="50">2 dozen</option>
                    <option value="3" data-price="75">3 dozen</option>
                    <option value="4" data-price="100">4 dozen</option>
                    <option value="5" data-price="125">5 dozen</option>
                    <option value="6" data-price="150">6 dozen</option>
                </select>
            </label>

            <label for="DropCookieDateNeeded">
                <div>Date needed</div>
                <input type="date" name="dropcookiedateneeded" id="DropCookieDateNeeded" data-input="dcdate" autocomplete="off" required>
            </label>

            <label for="DropCookieFlavor">
                <div>Flavor</div>
                <select name="dropcookieflavor" id="DropCookieFlavor" data-input="dcflavor" autocomplete="off" required>
                    <option value=""selected disabled>-- select</option>
                    <option value="vanilla">vanilla</option>
                    <option value="chocolate">chocolate</option>
                    <option value="lemon">lemon</option>
                    <option value="raspberry">raspberry</option>
                    <option value="strawberry">strawberry</option>
                </select>
            </label>

            <label for="DropCookieAddon">
                <div>Add-on</div>
                <select name="dropcookieaddon" id="DropCookieAddon" data-input="dcaddon" autocomplete="off" required>
                    <option value=""selected disabled>-- select</option>
                    <option value="chocolate chips">chocolate chips</option>
                    <option value="white chocolate chips">white chocolate chips</option>
                    <option value="peanut butter chips">peanut butter chips</option>
                </select>
            </label>`;

        return li;
    },
    cakeComponent(){
        const li = document.createElement('li');
        li.classList.add('order-item','cake-information');
        li.setAttribute('data-order-item','cakes');
        li.setAttribute('data-item-id','ck');

        li.innerHTML += `<header>
                <h3>Cake</h3>
                <button type="button" class="btn remove-order-btn" value="cakes">remove&nbsp;&#10007;</button>
            </header>

            

            <label for="CakeQuantity">
                <div>How many would you like?</div>
                <select name="cakequantity" id="CakeQuantity" data-input="ckquantity" autocomplete="off" required>
                    <option value=""selected disabled>-- select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                </select>
            </label>

            <label for="CakeDateNeeded">
                <div>Date needed</div>
                <input type="date" name="cakedateneeded" id="CakeDateNeeded" data-input="ckdate" autocomplete="off" required>
            </label>

            <label for="CakeSize">
                <div>What size of cake?</div>
                <select name="cakesize" id="CakeSize" data-input="cksize" autocomplete="off" required>
                    <option value=""selected disabled>-- select</option>
                    <option value="6inch" data-price="25">Smash Cake (serves ~12)</option>
                    <option value="8inch" data-price="35">8" (serves ~20)</option>
                    <option value="10inch" data-price="40">10" (serves ~28)</option>
                    <option value="2tier" data-price="65">2 tier (serves ~48)</option>
                    
                </select>
            </label>

            <label for="CakeFlavor">
                <div>Flavor</div>
                <select name="cakeflavor" id="CakeFlavor" data-input="ckflavor" autocomplete="off" required>
                    <option value=""selected disabled>-- select</option>
                    <option value="vanilla">vanilla</option>
                    <option value="chocolate">chocolate</option>
                    <option value="strawberry">strawberry</option>
                    <option value="redvelvet">red velvet</option>
                    <option value="lemon">lemon</option>
                </select>
            </label>

            <label for="CakeFrosting">
                <div>Frosting</div>
                <select name="cakefrosting" id="CakeFrosting" data-input="ckfrosting" autocomplete="off" required>
                    <option value=""selected disabled>-- select</option>
                    <option value="vanilla">vanilla</option>
                    <option value="chocolate">chocolate</option>
                    <option value="strawberry">strawberry</option>
                    <option value="lemon">lemon</option>
                </select>
            </label>

            <label for="CakeTheme">
                <div>Theme/Occasion</div>
                <textarea name="caketheme" id="CakeTheme" cols="30" rows="1" data-input="cktheme" autocomplete="off" required></textarea>
            </label>

            <label for="CakePersonalization">
                <div>Personalization</div>
                <textarea name="cakepersonalization" id="CakePersonalization" cols="30" rows="2" data-input="ckpersonalization" autocomplete="off" required></textarea>
            </label>`;

        return li;
    },
    sugarCookieComponent(){

        const li = document.createElement('li');
        li.classList.add('order-item','sugar-cookie-information');
        li.setAttribute('data-order-item','sugar-cookies');
        li.setAttribute('data-item-id','sc');

        li.innerHTML += `<header>
            <h3>Sugar Cookies</h3>
            <button type="button" class="btn remove-order-btn" value="sugar-cookies">remove&nbsp;&#10007;</button>
            </header>

            <label for="SugarCookiesQuantity">
                <div>How many would you like?</div>
                <select name="sugarcookiesquantity" id="SugarCookiesQuantity" data-input="scquantity" autocomplete="off" required disabled>
                    <option value=""selected disabled>-- select</option>
                    <option value="1" data-price="30">1 dozen</option>
                    <option value="2" data-price="60">2 dozen</option>
                    <option value="3" data-price="90">3 dozen</option>
                    <option value="4" data-price="120">4 dozen</option>
                    <option value="5" data-price="150">5 dozen</option>
                    <option value="6" data-price="180">6 dozen</option>
                </select>
            </label>

            <label for="SugarCookiesDateNeeded">
                <div>When are they needed?</div>
                <input type="date"
                    name="sugarcookiesdate" 
                    id="SugarCookiesDateNeeded" 
                    min="" 
                    data-input="scdate" 
                    autocomplete="off" required disabled>
            </label>

            <label for="SugarCookiesTheme">
                <div>Theme/Occasion</div>
                <textarea name="sugarcookiestheme" 
                    id="SugarCookiesTheme" 
                    cols="30" rows="1" 
                    data-input="sctheme" 
                    autocomplete="off" required disabled></textarea>
            </label>

            <label for="SugarCookiesPersonalization">
                <div>Personalization</div>
                <textarea name="sugarcookiespersonalization"
                    id="SugarCookiesPersonalization" 
                    cols="30" rows="2" 
                    data-input="scpersonalization" 
                    autocomplete="off" required disabled></textarea>
            </label>`;

        return li;
    },
    addressFormComponent(){

        const div = document.createElement('div');
        div.classList.add('address-information');

        div.innerHTML += `<label for="OrderFormStreet">
            <div>Street</div>
                <input type="text" name="street" id="OrderFormStreet" data-input="street" autocomplete="off" required>
            </label>
            <label for="OrderFormCity">
                <div>City</div>
                <input type="text" name="city" id="OrderFormCity" data-input="city" autocomplete="off" required>
            </label>
            <label for="OrderFormState">
                <div>State</div>
                <input type="text" name="state" id="OrderFormState" data-input="state" autocomplete="off" required>
            </label>
            <label for="OrderFormZipCode">
                <div>Zip</div>
                <input type="text" name="zipcode" id="OrderFormZipCode" data-input="zipcode" autocomplete="off" required>
            </label>`;

        return div;
    },
    createOrderItem(itemType){

        switch(itemType){

            case 'sugar-cookies': return OrderForm.sugarCookieComponent();

            case 'cakes': return OrderForm.cakeComponent();

            case 'drop-cookies': return OrderForm.dropCookieComponent();
            
            case 'cupcakes': return OrderForm.cupcakeComponent();

            case 'cake-pops': return OrderForm.cakepopComponent();

        }
     

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

            [...OrderForm.form.querySelectorAll('.order-item')].forEach( orderItem => {
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

        orderItem.closest('ul').removeChild(orderItem);



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

            [...OrderForm.form.querySelectorAll('.order-item')].forEach( orderItem => {
                if(orderItem.classList.contains('open')){
                    orderItem.classList.remove('open');
                }
            });
            
          
            const orderItem = OrderForm.createOrderItem(event.target.value); //document.querySelector(`[data-order-item="${event.target.value}"]`);

            document.querySelector('.order-item-list').appendChild(new DocumentFragment().appendChild(orderItem));

            OrderForm.addItemTab(orderItem.dataset.itemId,event.target.value );

            OrderForm.disableItemSelection(event.target,event.target.value)

            OrderForm.activateOrderItem(orderItem);

            OrderForm.enableOrderItemInputs(orderItem);

            // invoice

            OrderInvoice.addItemToInvoice(event.target.value,orderItem.dataset.itemId);

            OrderForm.limitDateSelection(orderItem.querySelector('input[type="date"]'),14);

            OrderForm.listenToOrderItem(orderItem);
        }
        

        
    },
    confirmOrder(event){

        event.preventDefault();

        OrderInvoice.openInvoice();

        const orderInvoiceCloseButton = document.querySelector('.order-invoice-close-btn');
        orderInvoiceCloseButton.innerHTML = `confirm&nbsp;&#10003;`;
        orderInvoiceCloseButton.addEventListener('click', (event)=>{
            OrderForm.submitButton.setAttribute('type', 'submit');
            OrderForm.submitButton.textContent = 'Place order!';
            

            OrderForm.form.addEventListener('submit', (event)=>{
                // event.preventDefault();

                const formData = new FormData(event.target);

                const action = event.target.getAttribute('action');
                const clientName = formData.get('name');

                console.log(action,clientName)
            })
        });

        OrderForm.submitButton.removeEventListener('click', OrderForm.confirmOrder);
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

        OrderForm.submitButton.addEventListener('click', OrderForm.confirmOrder);

    },
    initialize(){
        OrderForm.form = document.querySelector('.order-form');
        OrderForm.itemSelectElement = document.querySelector('#OrderFormItem');
        OrderForm.retrivalTypeSelect = document.querySelector('#OrderFormRetrival');
        OrderForm.addressInformationDisplay = document.querySelector('.address-information');

        OrderForm.submitButton = document.querySelector('.order-submit-btn');
    }
};

function initializeOrderingPage(){

    pageNavigation();

    OrderInvoice.initialize();

    OrderForm.initialize();
    OrderForm.listen();

    document.querySelector('.order-form-invoice-open-btn').addEventListener('click', OrderInvoice.openInvoice);

};
initializeOrderingPage();