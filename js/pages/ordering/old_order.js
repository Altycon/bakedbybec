
import { 
    appendElementToParentWithFragment,
    capitalize, 
    disableSelectFieldOption, 
    transitionElementClose, 
    transitionElementOpen,
    zeroPadLeftToString,
} from "../../utilities.js";
import { OrderProgress } from "./order_progress.js";
import { OrderItemData } from "./order_data.js";
import { OrderComponent } from "./order_components.js";

export const Order = {
    form: undefined,
    itemSelectField: undefined,
    itemsInput: undefined,
    retrievalSelectField: undefined,
    paymentSelectField: undefined,
    agreementCheckboxField: undefined,
    submitButton: undefined,
    selectFields: undefined,
    itemTabList: undefined,
    itemList: undefined,
    invoiceItemList: undefined,

    // utils
    createItemObjectId(itemId){
        const [ first, last ] = itemId.split('-');
        return `${first}${capitalize(last)}`; 
    },
    async getCurrentLocation(){
        try{
            const position = await new Promise( (resolve,reject)=>{
                navigator.geolocation.getCurrentPosition(resolve,reject);
            });
            if(!position.coords) throw new Error(`Browser's navigator gelocation object does not contain coordinates.`);
            const { latitude, longitude } = position.coords;
            return { latitude, longitude };
        }catch(error){
            throw new Error(error.message);
        }
       
    },
    // intros
    removeItemTabIntro(){
        const tabIntro = document.querySelector('.js-order-item-tab-intro');
        if(Order.itemTabList.contains(tabIntro)){
            Order.itemTabList.removeChild(tabIntro);
        }
    },
    removeItemIntro(){
        const itemIntro = document.querySelector('.js-order-item-intro');
        if(Order.itemList.contains(itemIntro)){
            Order.itemList.removeChild(itemIntro);
        }
    },

    // items input
    addItemToInputList(itemId){
        if(!Order.itemsInput.value || '' === Order.itemsInput.value){
            Order.itemsInput.value = itemId;
        }else{
            Order.itemsInput.value += `,${itemId}`;
        }
    },
    
    // tabs
    deactivateItemTabs(){
        document.querySelectorAll('.js-order-item-tab').forEach( tab => {
            if(tab && tab.classList.contains('active')){
                tab.classList.remove('active');
            }
        })
    },
    addItemTab(itemId,makeActive=true){
        const objectId = Order.createItemObjectId(itemId);
       
        Order.deactivateItemTabs();

        const tabComponent = OrderComponent.orderItemTabComponent(
            itemId,
            OrderItemData[objectId].imageSourcePath
        );
        appendElementToParentWithFragment(
            Order.itemTabList,
            tabComponent
        )
        tabComponent.addEventListener('click', Order.tabToItem);
        setTimeout( ()=> {
            tabComponent.classList.add('show');
        },100);
        if(makeActive){
            setTimeout( ()=> {
                tabComponent.classList.add('active');
            },200);
        }
    },

    // handlers
    getNumberOfActiveItems(){
        const orderItemsList = [...document.querySelectorAll('.js-order-item')];
        return {
            total: orderItemsList.length,
            items: orderItemsList
        }
    
    },
   
    markRetrievalInfoUnavailable(retrievalType){
        const informaitonElement = document.querySelector(`.js-retrieval-information-${retrievalType}`);
        if(!informaitonElement.classList.contains('unavailable')){
            informaitonElement.classList.add('unavailable');
        }
    },
    disableItemSelection(itemId){
        disableSelectFieldOption(Order.itemSelectField,itemId);

        if(itemId.includes('cake')){
            disableSelectFieldOption(Order.retrievalSelectField,'shipping');
            Order.markRetrievalInfoUnavailable('shipping');
        }
    },
    connectDataInputsToDataOutputs(){
        const inputs = document.querySelectorAll('[data-input]');
        inputs.forEach( input => {
            if(!input.classList.contains('connected')){
                input.addEventListener('input', (inputEvent)=>{
                    document.querySelector(`[data-output="${input.dataset.input}"]`).textContent = inputEvent.target.value;
                });
                input.classList.add('connected');
            }
        })
    },
    addToSubTotal(price){
        const subTotalInput = document.querySelector('#OrderFormSubTotal');
        if(!subTotalInput.value || subTotalInput.value === '') subTotalInput.value = '0';
        const subtotal = Number(subTotalInput.value) + Number(price);
        subTotalInput.value = `${subtotal}`;
        document.querySelector(`[data-output="invoice-sub-total"]`).textContent = `${subtotal}.00`;
    },
    addToTotal(price){
        const totalInput = document.querySelector('#OrderFormTotal');
        if(!totalInput.value || totalInput.value === '') totalInput.value = '0';
        const total = Number(totalInput.value) + Number(price);
        totalInput.value = `${total}`;
        document.querySelector(`[data-output="invoice-total"]`).textContent = `${total}.00`;
    },
    subtractFromSubTotal(price){
        const subTotalInput = document.querySelector('#OrderFormSubTotal');
        if(!subTotalInput.value || subTotalInput.value === '' || subTotalInput.value === '0'){
            return;
        }
        const subtotal = Number(subTotalInput.value) - Number(price);
        subTotalInput.value = `${subtotal}`;
        document.querySelector(`[data-output="invoice-sub-total"]`).textContent = `${subtotal}.00`;
    },
    subtractFromTotal(price){
        const totalInput = document.querySelector('#OrderFormTotal');
        if(!totalInput.value || totalInput.value === '' || totalInput.value === '0'){
            return;
        }
        if(Number(totalInput.value) < Number(price)){
            console.warn('total price input is less than price of item');
            return;
        }
        const total = Number(totalInput.value) - Number(price);
        totalInput.value = `${total}`;
        document.querySelector(`[data-output="invoice-total"]`).textContent = `${total}.00`;
    },

    // invoice
    addItemToInvoice(itemId,invoiceItemFields){
        const invoiceItemComponent = OrderComponent.orderInvoiceItemComponent(
            itemId,
            invoiceItemFields
        );
        appendElementToParentWithFragment(
            Order.invoiceItemList,
            invoiceItemComponent
        );
    },
    setOrderFormDate(){
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const dateString = `${year}-${zeroPadLeftToString(month)}-${zeroPadLeftToString(day)}`;
        
        document.querySelector('#OrderFormDate').value = dateString;
        const dateOutput = document.querySelector('[data-output="order-date"]');
        dateOutput.textContent = dateString;
    },

    // items
    activeSubmitButton(){
        if(!Order.submitButton.classList.contains('active')){
            Order.submitButton.classList.add('active');
        }
    },
    deactiveSubmitButton(){
        if(Order.submitButton.classList.contains('active')){
            Order.submitButton.classList.remove('active');
        }
    },
    hideOrderItems(){
        document.querySelectorAll('.js-order-item').forEach( orderItem =>{
            if(orderItem.classList.contains('active')){
                transitionElementClose(orderItem,(element)=>{
                    element.classList.remove('active');
                });
            }
        })
    },
    addItemToOrder(itemData){

        const itemComponent = OrderComponent.orderItemComponent(itemData);
        appendElementToParentWithFragment(
            Order.itemList,
            itemComponent
        )
        Order.addItemToInputList(itemData.name);

        transitionElementOpen(itemComponent,(element)=>{
            element.classList.add('active');
        });
    },
    tabToItem(clickEvent){
        clickEvent.preventDefault();
        const tab = clickEvent.target;
        if(!tab.classList.contains('active')){
           
            Order.deactivateItemTabs();
            Order.hideOrderItems();
    
            if(!tab.dataset.tabId){
                console.warn('item id not set on tab');
                return;
            }
            const orderItem = document.querySelector(`[data-item-id="${tab.dataset.tabId}"]`);
            if(!orderItem){
                console.warn('order item element not found when tabbing');
                return;
            }

            transitionElementOpen(orderItem, (element)=> {
                element.classList.add('active')
            });

            setTimeout(()=>{
                tab.classList.add('active');
            },100);
        }
    },
    chooseItem(changeEvent){
        const itemId = changeEvent.target.value;
        const objecId = Order.createItemObjectId(itemId);
        
        Order.removeItemIntro();
        Order.hideOrderItems();
    
        const { total, items } = Order.getNumberOfActiveItems();
    
        if(total && total === 1){
            Order.removeItemTabIntro();
            Order.addItemTab(items[0].dataset.itemId,false)
            Order.addItemTab(itemId);
        }
        if(total && total > 1){
            Order.addItemTab(itemId);
        }

        Order.addItemToOrder(OrderItemData[objecId]);

        Order.disableItemSelection(itemId);

        Order.addItemToInvoice(
            itemId,
            OrderItemData.invoiceFields[objecId]
        );

        OrderProgress.listenToAreaInputs('.js-item-info',2);
        OrderProgress.inspectAreaInputProgress('.js-item-info',2);
        OrderProgress.setState(1);
    },

    // retrieval
    selectOrderRetrievalType(changeEvent){
        const retrievalType = changeEvent.target.value;
        const personalInformationElement = document.querySelector('.js-order-form .js-personal-information');
    
        const possibleAddressElement = document.querySelector('.js-order-form .js-address-information') ||
            document.querySelector('.js-order-form .js-pickup-distance-information');
        if(possibleAddressElement){
            personalInformationElement.removeChild(possibleAddressElement);
        }
        
        if(retrievalType === 'delivery' || retrievalType === 'shipping'){

            const addressComponent = OrderComponent.orderAddressComponent(retrievalType);
            personalInformationElement.appendChild(new DocumentFragment().appendChild(addressComponent));

            setTimeout(() => {
                addressComponent.classList.add('show');
            },100);
            addressComponent.classList.add('open');

            OrderProgress.listenToAreaInputs('.js-personal-info',5);

        }else{

            personalInformationElement.appendChild(
                new DocumentFragment().appendChild(OrderComponent.getPickupOrderAddressComponent())
            );
        }

        OrderProgress.setState(3);

        
    
        const option = document.querySelector(`#OrderFormRetrieval option[value="${changeEvent.target.value}"]`);
        const retrievalPrice = option.dataset.price;

        const retrievalPriceOutput = document.querySelector(`[data-output="retrieval-price"]`);
        const retrievalCostOutput = document.querySelector(`[data-output="retrieval-cost"]`);
        if(changeEvent.target.value === 'shipping'){
            retrievalPriceOutput.textContent = `${retrievalPrice}.00`;
            retrievalCostOutput.textContent = `${retrievalPrice}.00`;
            Order.addToTotal(retrievalPrice);
        }else{
            retrievalPriceOutput.textContent = `${retrievalPrice}`;
            retrievalCostOutput.textContent = `00.00`;
            
            if(document.querySelector('#OrderFormSubTotal').value !== 
                document.querySelector('#OrderFormTotal').value){
                    Order.subtractFromTotal('15');
            }
           
        }
        
        OrderComponent.displayInputContentInOutputElement(changeEvent);
        
    
    },
    // payment
    selectPaymentType(inputEvent){
        OrderProgress.setState(4);
    },
    // aggreement
    selectOrderAgreementCheckbox(changeEvent){
        const progressState = OrderProgress.inspectState();
        const isChecked = changeEvent.target.checked;
        if(progressState.length > 0){
            changeEvent.target.checked = false;
            return;
        }
        if(isChecked){
            Order.activeSubmitButton();
            OrderProgress.setState(6);
        }else{
            Order.deactiveSubmitButton();
            OrderProgress.removeState(6);
        }
    },
    counter: 0,
    submitOrder(submitEvent){
        submitEvent.preventDefault();
        const form = submitEvent.target;
        const formData = new FormData(form);
        console.log('FormData', formData);
        const items = [];
        const data = {
            fullname: formData.get(`name`) || null,
            email: formData.get(`email`) || null,
            phoneNumber: formData.get(`phone-number`) || null,
            retrieval: formData.get(`retrieval`) || null,
            payment: formData.get(`payment`) || null,
            subTotal: formData.get(`sub-total`) || null,
            total: formData.get(`total`) || null,
            date: formData.get(`date`) || null
        }
        const street = formData.get(`street`);
        if(street){
            data.street = street;
            data.city = formData.get(`city`);
            data.state = formData.get(`state`);
            data.zipcode = formData.get(`zipcode`);
        }
        const itemsList = formData.get('items').split(',');
        if(itemsList.length > 0){
            itemsList.forEach( item => {
                const itemData = {
                    name: item,
                    dateNeeded: formData.get(`${item}-date`) || null,
                    quantity: formData.get(`${item}-quantity`) || null,
                    cost: formData.get(`${item}-cost`) || null,
                    price: formData.get(`${item}-price`) || null,
                };
                const size = formData.get(`${item}-size`);
                if(size) itemData.size = size;
                const flavor = formData.get(`${item}-flavor`);
                if(flavor) itemData.flavor = flavor;
                const frosting = formData.get(`${item}-frosting`);
                if(frosting) itemData.frosting = frosting;
                const bakingChips = formData.get(`${item}-baking-chips`);
                if(bakingChips) itemData.bakingChips = bakingChips;
                const theme = formData.get(`${item}-theme`);
                if(theme) itemData.theme = theme;
                const personalization = formData.get(`${item}-personalization`);
                if(personalization) itemData.personalization = personalization;
                items.push(itemData);
            })
        }
        data.items = items;
        console.log('data', data);
        // const list = [
        //     'I disagree with your decision. try again',
        //     'nope. not this time. try again',
        //     'really? do you think something is going to happen? try again',
        //     'fine. ill do nothing again. try again',
        //     'how long you gonna try this? try again',
        //     `you've realized that there may be more and want to continue? try again`
        // ]
        // if(clickEvent.target.classList.contains('active')){
        //     alert(list[Order.counter]);
        //     Order.counter++;
        //     if(Order.counter >= list.length){
        //         Order.counter = 0;
        //     }
        // }
    },
    listen(){
        Order.itemSelectField.addEventListener('change',Order.chooseItem);
        Order.retrievalSelectField.addEventListener('change', Order.selectOrderRetrievalType);
        Order.paymentSelectField.addEventListener('change', Order.selectPaymentType);
        Order.agreementCheckboxField.addEventListener('change', Order.selectOrderAgreementCheckbox);
        // Order.itemList.addEventListener('order:itemChange', (event)=>{
        //     console.log('itemlist event', event);
        // });
        //Order.submitButton.addEventListener('click', Order.submitOrder);
        Order.form.addEventListener('submit', Order.submitOrder);
        
    },
    initialize(){
        try{
            // order form
            Order.form = document.querySelector('#OrderForm');
            if(!Order.form) throw new Error('order form not found');

            Order.itemSelectField = document.querySelector('#OrderFormItem');
            if(!Order.itemSelectField) throw new Error('item select element not found');

            Order.itemsInput = document.querySelector('#OrderItemsInput');
            if(!Order.itemsInput) throw new Error('items input element not found');

            Order.retrievalSelectField = document.querySelector('#OrderFormRetrieval');
            if(!Order.retrievalSelectField) throw new Error('order retrieval select element not found');

            Order.paymentSelectField = document.querySelector('#OrderFormPaymentType');
            if(!Order.paymentSelectField) throw new Error('order payment select element not found');

            Order.agreementCheckboxField = document.querySelector('#OrderFormAgreementCheckbox');
            if(! Order.agreementCheckboxField) throw new Error('order agreement checkbox not found');

            Order.submitButton = document.querySelector('.js-order-form-submit-btn');
            if(!Order.submitButton) throw new Error('order submit button not found');

            Order.selectFields = document.querySelectorAll('.form-select');
            if(!Order.selectFields) throw new Error('form select fields not found');

            // order tabs
            Order.itemTabList = document.querySelector('.js-order-item-tab-list');
            if(!Order.itemTabList) throw new Error('order item list element not found');

            // order items
            Order.itemList = document.querySelector('.js-order-item-list');
            if(!Order.itemList) throw new Error('order item list element not found');

            // order invoice
            Order.invoiceItemList = document.querySelector('.js-order-invoice-item-list');
            if(!Order.invoiceItemList) throw new Error('invoice item list element not found');

            Order.listen();

        }catch(error){
            console.warn(error);
        }   
    }
};