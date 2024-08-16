import { pageNavigation } from "../../navigation.js";
import { 
    appendElementToParentWithFragment,
    capitalize, 
    disableSelectFieldOption, 
    openInHouseBakerySign, 
    transitionElementClose, 
    transitionElementOpen,
} from "../../utilities.js";
import { OrderProgress } from "./order_progress.js";
import { OrderItemData } from "./order_data.js";
import { OrderComponent } from "./order_components.js";


const Order = {
    form: undefined,
    itemSelectField: undefined,
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
    disableRetrievalSelection(retrievalOption){
        const option = Order.retrievalSelectField.querySelector(`option[value="${retrievalOption}"]`);
        if(!option) console.warn('item retrieval option to be disabled, not found');
        option.setAttribute('disabled', 'true');
    },
    disableItemSelection(itemId){
        disableSelectFieldOption(Order.itemSelectField,itemId);

        if('layer-cake' === itemId || 'sheet-cake' === itemId){
            Order.disableRetrievalSelection('shipping');
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
    setInvoiceDate(){
        const today = new Date();
        const dateOutput = document.querySelector('[data-output="order-date"]');
        dateOutput.textContent = today.toDateString();
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
    selectOrderRetrievalType(inputEvent){
        const retrievalType = inputEvent.target.value;
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

        OrderComponent.displayInputContentInOutputElement(inputEvent);
    
        const option = document.querySelector(`#OrderFormRetrieval option[value="${inputEvent.target.value}"]`);
        const retrievalPrice = option.dataset.price;
        document.querySelector(`[data-output="retrieval-price"]`).textContent = retrievalPrice;
    
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
    submitOrder(clickEvent){
        const list = [
            'I disagree with your decision. try again',
            'nope. not this time. try again',
            'really? do you think something is going to happen? try again',
            'fine. ill do nothing again. try again',
            'how long you gonna try this? try again',
            `you've realized that there may be more and want to continue? try again`
        ]
        if(clickEvent.target.classList.contains('active')){
            alert(list[Order.counter]);
            Order.counter++;
            if(Order.counter >= list.length){
                Order.counter = 0;
            }
        }
    },
    listen(){
        Order.itemSelectField.addEventListener('change',Order.chooseItem);
        Order.retrievalSelectField.addEventListener('change', Order.selectOrderRetrievalType);
        Order.paymentSelectField.addEventListener('change', Order.selectPaymentType);
        Order.agreementCheckboxField.addEventListener('change', Order.selectOrderAgreementCheckbox);
        Order.itemList.addEventListener('order:itemChange', (event)=>{
            console.log('itemlist event', event);
        });
        Order.submitButton.addEventListener('click', Order.submitOrder);
    },
    initialize(){
        try{
            // order form
            Order.form = document.querySelector('#OrderForm');
            if(!Order.form) throw new Error('order form not found');

            Order.itemSelectField = document.querySelector('#OrderFormItem');
            if(!Order.itemSelectField) throw new Error('item select element not found');

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

function openOrderForm(event){
    event.preventDefault();

    const beforeYouOrderElement = document.querySelector('.js-before-you-order');
    const orderAreaElement = document.querySelector('.js-ordering-area');

    if(!beforeYouOrderElement || !orderAreaElement){
        console.warn('missing order area elements or error selecting elements')
    }else{
        
        beforeYouOrderElement.classList.add('close');

        Order.initialize();
        Order.connectDataInputsToDataOutputs();

        OrderProgress.initialize(document.querySelector('.js-order-progress-bar'));
        Order.setInvoiceDate();
        OrderProgress.display();

        setTimeout( ()=> {
            orderAreaElement.classList.add('show');
            OrderProgress.setState(0);
            OrderProgress.listenToAreaInputs('.js-personal-info',5);
        },400)
        setTimeout( ()=>{
            beforeYouOrderElement.classList.add('hide');
    
            orderAreaElement.classList.add('open');
            
        },300);
    }
};

function initializeOrderingPage(){

    let externalItemValue = undefined;

    if(window.location.hash && window.location.hash !== ""){

        externalItemValue = window.location.hash.split('#')[1];

    }

    pageNavigation();

    const inhouseBakerySignButton = document.querySelector('.js-in-house-bakery-btn');
    const openOrderFormButton = document.querySelector('.js-open-order-form-btn')

    if(!inhouseBakerySignButton){

    }else{
        inhouseBakerySignButton.addEventListener('click', openInHouseBakerySign);
    }
    
    if(!openOrderFormButton){
        console.warn('MISSING ELEMENT: open order form button');
    }else{
        openOrderFormButton.addEventListener('click', openOrderForm);
    }
};
initializeOrderingPage();