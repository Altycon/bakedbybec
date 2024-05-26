import { pageNavigation } from "../../navigation.js";



const OrderForm = {
    form: undefined,
    submitButton: undefined,
    itemSelectElement: undefined,
    retrivalTypeSelect: undefined,
    addressInformationDisplay: undefined,

    handleRetrievalSelect(event){

        const addressElement = document.querySelector('.address-information');

        const personalInformationElement = OrderForm.form.querySelector('.personal-information');

        const deliveryEstimatorElement = OrderForm.form.querySelector('.delivery-estimator');

        if(event.target.value === 'shipping'){

            if(!addressElement){

                const addressComponent = OrderForm.addressFormComponent(event.target.value);

                personalInformationElement.appendChild(new DocumentFragment().appendChild(addressComponent));

                setTimeout( ()=> {

                    addressComponent.classList.add('show');
    
                },100);
            }

            if(deliveryEstimatorElement){

                personalInformationElement.removeChild(deliveryEstimatorElement);

            }

            document.querySelector(`[data-output="shipping"]`).textContent = `15.00`;


        }else if(event.target.value === 'delivery'){

            if(!addressElement){

                const addressComponent = OrderForm.addressFormComponent(event.target.value);

                personalInformationElement.appendChild(new DocumentFragment().appendChild(addressComponent));

                setTimeout( ()=> {

                    addressComponent.classList.add('show');
    
                },100)
            }

            if(!deliveryEstimatorElement){

                const deliveryEsitmatorComponent = OrderForm.deliveryEstimatorComponent();

                personalInformationElement.appendChild(new DocumentFragment().appendChild(deliveryEsitmatorComponent));

                setTimeout( ()=> {

                    deliveryEsitmatorComponent.classList.add('show');
    
                },100)

            }

        }else if(event.target.value === 'pickup'){

            if(addressElement){

                addressElement.classList.remove('show');

                setTimeout( ()=>{

                    personalInformationElement.removeChild(addressElement);

                },500)

            }

            if(deliveryEstimatorElement){

                personalInformationElement.removeChild(deliveryEstimatorElement);
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
                <select name="cakepopquantity" id="CakepopQuantity" autocomplete="off" required>
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
                <input type="date" name="cakepopdateneeded" id="CakepopDateNeeded" autocomplete="off" required>
            </label>

            <label for="CakepopFlavor">
                <div>Flavor</div>
                <select name="cakepopflavor" id="CakepopFlavor" autocomplete="off" required>
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
                <select name="cakepopfrosting" id="CakepopFrosting" autocomplete="off" required>
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
                <select name="cupcakequantity" id="CupcakeQuantity" autocomplete="off" required>
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
                <input type="date" name="cupcakedateneeded" id="CupcakeDateNeeded" autocomplete="off" required>
            </label>

            <label for="CupcakeFlavor">
                <div>Flavor</div>
                <select name="cupcakeflavor" id="CupcakeFlavor" autocomplete="off" required>
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
                <select name="cupcakefrosting" id="CupcakeFrosting" autocomplete="off" required>
                    <option value=""selected disabled>-- select</option>
                    <option value="vanilla">vanilla</option>
                    <option value="chocolate">chocolate</option>
                    <option value="strawberry">strawberry</option>
                    <option value="lemon">lemon</option>
                </select>
            </label>

            <label for="CupcakeTheme">
                <div>Theme/Occasion</div>
                <input name="cupcaketheme" 
                id="CupcakeTheme" 
                list="ItemThemes"
                cols="30" 
                rows="1"  
                autocomplete="off" required/>
            </label>

            <label for="CupcakePersonalization">
                <div>Personalization</div>
                <textarea name="cupcakepersonalization" id="CupcakePersonalization" cols="30" rows="2" autocomplete="off" required></textarea>
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
                <select name="dropcookiequantity" id="DropCookieQuantity" autocomplete="off" required>
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
                <input type="date" name="dropcookiedateneeded" id="DropCookieDateNeeded" autocomplete="off" required>
            </label>

            <label for="DropCookieFlavor">
                <div>Flavor</div>
                <select name="dropcookieflavor" id="DropCookieFlavor" autocomplete="off" required>
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
                <select name="dropcookieaddon" id="DropCookieAddon" autocomplete="off" required>
                    <option value=""selected disabled>-- select</option>
                    <option value="chocolate chips">chocolate chips</option>
                    <option value="white chocolate chips">white chocolate chips</option>
                    <option value="peanut butter chips">peanut butter chips</option>
                </select>
            </label>`;

        return li;
    },
    layerCakeComponent(){
        const li = document.createElement('li');
        li.classList.add('order-item','layer-cake-information');
        li.setAttribute('data-order-item','layer-cake');
        li.setAttribute('data-item-id','lck');

        li.innerHTML += `<header>
                <h3>Layer Cake</h3>
                <button type="button" class="btn remove-order-btn" value="layer-cake">remove&nbsp;&#10007;</button>
            </header>

            

            <label for="LayerCakeQuantity">
                <div>How many would you like?</div>
                <select name="layercakequantity" id="LayerCakeQuantity" autocomplete="off" required>
                    <option value=""selected disabled>-- select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                </select>
            </label>

            <label for="LayerCakeDateNeeded">
                <div>Date needed</div>
                <input type="date" name="layercakedateneeded" id="LayerCakeDateNeeded" autocomplete="off" required>
            </label>

            <label for="LayerCakeSize">
                <div>What size of cake?</div>
                <select name="layercakesize" id="LayerCakeSize" autocomplete="off" required>
                    <option value=""selected disabled>-- select</option>
                    <option value="6inch" data-price="25">Smash Cake (serves ~12)</option>
                    <option value="8inch" data-price="35">8" (serves ~20)</option>
                    <option value="10inch" data-price="40">10" (serves ~28)</option>
                    <option value="2tier" data-price="65">2 tier (serves ~48)</option>
                    
                </select>
            </label>

            <label for="LayerCakeFlavor">
                <div>Flavor</div>
                <select name="layercakeflavor" id="LayerCakeFlavor" autocomplete="off" required>
                    <option value=""selected disabled>-- select</option>
                    <option value="vanilla">vanilla</option>
                    <option value="chocolate">chocolate</option>
                    <option value="strawberry">strawberry</option>
                    <option value="redvelvet">red velvet</option>
                    <option value="lemon">lemon</option>
                </select>
            </label>

            <label for="LayerCakeFrosting">
                <div>Frosting</div>
                <select name="layercakefrosting" id="LayerCakeFrosting" autocomplete="off" required>
                    <option value=""selected disabled>-- select</option>
                    <option value="vanilla">vanilla</option>
                    <option value="chocolate">chocolate</option>
                    <option value="strawberry">strawberry</option>
                    <option value="lemon">lemon</option>
                </select>
            </label>

            <label for="LayerCakeTheme">
                <div>Theme/Occasion</div>
                <input name="layercaketheme" 
                id="LayerCakeTheme"
                list="ItemThemes" 
                cols="30" rows="1"  
                autocomplete="off" required/>
            </label>

            <label for="LayerCakePersonalization">
                <div>Personalization</div>
                <textarea name="layercakepersonalization" id="LayerCakePersonalization" cols="30" rows="2" autocomplete="off" required></textarea>
            </label>`;

        return li;
    },
    sheetCakeComponent(){
        const li = document.createElement('li');
        li.classList.add('order-item','sheet-cake-information');
        li.setAttribute('data-order-item','sheet-cake');
        li.setAttribute('data-item-id','sck');

        li.innerHTML += `<header>
                <h3>sheet cake</h3>
                <button type="button" class="btn remove-order-btn" value="sheet-cake">remove&nbsp;&#10007;</button>
            </header>

            

            <label for="SheetCakeQuantity">
                <div>How many would you like?</div>
                <select name="sheetcakequantity" id="SheetCakeQuantity" autocomplete="off" required>
                    <option value=""selected disabled>-- select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                </select>
            </label>

            <label for="SheetCakeDateNeeded">
                <div>Date needed</div>
                <input type="date" name="cakedateneeded" id="SheetCakeDateNeeded" autocomplete="off" required>
            </label>

            <label for="SheetCakeSize">
                <div>What size of cake?</div>
                <select name="sheetcakesize" id="SheetCakeSize" autocomplete="off" required>
                    <option value=""selected disabled>-- select</option>
                    <option value="quarter" data-price="30">quarter sheet</option>
                    <option value="half" data-price="40">half sheet</option>
                </select>
            </label>

            <label for="SheetCakeFlavor">
                <div>Flavor</div>
                <select name="sheetcakeflavor" id="SheetCakeFlavor" autocomplete="off" required>
                    <option value=""selected disabled>-- select</option>
                    <option value="vanilla">vanilla</option>
                    <option value="chocolate">chocolate</option>
                    <option value="strawberry">strawberry</option>
                    <option value="redvelvet">red velvet</option>
                    <option value="lemon">lemon</option>
                </select>
            </label>

            <label for="SheetCakeFrosting">
                <div>Frosting</div>
                <select name="sheetcakefrosting" id="SheetCakeFrosting" autocomplete="off" required>
                    <option value=""selected disabled>-- select</option>
                    <option value="vanilla">vanilla</option>
                    <option value="chocolate">chocolate</option>
                    <option value="strawberry">strawberry</option>
                    <option value="lemon">lemon</option>
                </select>
            </label>

            <label for="SheetCakeTheme">
                <div>Theme/Occasion</div>
                <input name="sheetcaketheme" 
                id="SheetCakeTheme"
                list="ItemThemes" 
                cols="30" rows="1"  
                autocomplete="off" required/>
            </label>

            <label for="SheetCakePersonalization">
                <div>Personalization</div>
                <textarea name="sheetcakepersonalization" id="SheetCakePersonalization" cols="30" rows="2" autocomplete="off" required></textarea>
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
                <select name="sugarcookiesquantity" id="SugarCookiesQuantity" autocomplete="off" required>
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
                    autocomplete="off" required>
            </label>

            <label for="SugarCookiesTheme">
                <div>Theme/Occasion</div>
                <input name="sugarcookiestheme" 
                    id="SugarCookiesTheme"
                    list="ItemThemes" 
                    cols="30" rows="1"  
                    autocomplete="off" required/>
            </label>

            <label for="SugarCookiesPersonalization">
                <div>Personalization</div>
                <textarea name="sugarcookiespersonalization"
                    id="SugarCookiesPersonalization" 
                    cols="30" rows="2"  
                    autocomplete="off" required></textarea>
            </label>`;

        return li;
    },
    addressFormComponent(type){

        const div = document.createElement('div');
        div.classList.add('address-information');

        div.innerHTML += `<label for="OrderFormStreet">
            <div>Street</div>
                <input type="text" name="street" id="OrderFormStreet" autocomplete="off" required>
            </label>
            <label for="OrderFormCity">
                <div>City</div>
                <input type="text" name="city" id="OrderFormCity" autocomplete="off" required>
            </label>
            <label for="OrderFormState">
                <div>State</div>
                <input type="text" name="state" id="OrderFormState" autocomplete="off" required>
            </label>
            <label for="OrderFormZipCode">
                <div>Zip</div>
                <input type="text" name="zipcode" id="OrderFormZipCode" autocomplete="off" required>
            </label>`;

        return div;
    },
    deliveryEstimatorComponent(){
        const div = document.createElement('div');
        div.classList.add('delivery-estimator');

        div.innerHTML += `<p>Estimate delivery price based on above address information</p>
        <div>
            <button type="button" class="btn">Calculate</button>
            <p>Approx. miles:&nbsp;<span class="delivery-estimator-miles">0</span></p>
            <p>Approx. price:&nbsp;$<span class="delivery-estimator-price">0</span></p>
        </div>`;

        return div;
    },
    createOrderItem(itemType){

        switch(itemType){

            case 'sugar-cookies': return OrderForm.sugarCookieComponent();

            case 'layer-cake': return OrderForm.layerCakeComponent();

            case 'sheet-cake': return OrderForm.sheetCakeComponent();

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

                }else if(itemTabs.children[index]){

                    itemTabs.children[index].classList.add('active');

                    const connectionId = itemTabs.children[index].dataset.connectionId;

                    document.querySelector(`[data-item-id="${connectionId}"]`).classList.add('open');

                }else if(itemTabs.children[index + 1]){

                    itemTabs.children[index + 1].classList.add('active');

                    const connectionId = itemTabs.children[index + 1].dataset.connectionId;

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

            //div.textContent = parts[0] + ' ' + parts[1];
            div.innerHTML = `${parts[0]}<br>${parts[1]}`;

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
        // newTab.classList.add('show');
        newTab.classList.add('active');
        newTab.addEventListener('click', OrderForm.handleItemTabSwitch);

        const tabParent = document.querySelector('.item-information-tabs');
        tabParent.appendChild(newTab);

        setTimeout( ()=> {
            newTab.classList.add('show');
        },100)
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

        orderItemElement.querySelectorAll('select').forEach( selectElement => {

            
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

            const orderItems = [...OrderForm.form.querySelectorAll('.order-item')];

            if(orderItems && orderItems.length > 0){
                orderItems.forEach( orderItem => {
                    if(orderItem.classList.contains('open')){
                        orderItem.classList.remove('open');
                    }
                });
            }
            
            const orderItem = OrderForm.createOrderItem(event.target.value);

            document.querySelector('.order-item-list').appendChild(new DocumentFragment().appendChild(orderItem));

            OrderForm.addItemTab(orderItem.dataset.itemId,event.target.value );

            OrderForm.disableItemSelection(event.target,event.target.value)

            OrderForm.activateOrderItem(orderItem);

            OrderForm.enableOrderItemInputs(orderItem);

            OrderForm.limitDateSelection(orderItem.querySelector('input[type="date"]'),14);

            //OrderForm.listenToOrderItem(orderItem);

            setTimeout( ()=>{
                orderItem.classList.add('show');
            },100)
        }
        

        
    },
    
    submitOrder(event){

        event.preventDefault();

        alert("order not sent")
        
    },
    listen(){

        OrderForm.itemSelectElement.addEventListener('input', OrderForm.addItemToOrder);
        
        OrderForm.retrivalTypeSelect.addEventListener('input', OrderForm.handleRetrievalSelect);

        OrderForm.submitButton.addEventListener('click', OrderForm.submitOrder);

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

    let externalItemValue = undefined;

    if(window.location.hash && window.location.hash !== ""){

        externalItemValue = window.location.hash.split('#')[1];

    }

    pageNavigation();

    OrderForm.initialize();
    OrderForm.listen();

    

};
initializeOrderingPage();