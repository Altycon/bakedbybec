import { 
    appendElementToParentWithFragment,
    capitalize, 
    createHtmlElement, 
    limitDateInputSelection, 
    clearParentElement, 
    transitionElementOpen,
    enableSelectFieldOption
} from "../../utilities.js";
import { listOfUsStates } from "./order_data.js";
import { OrderProgress } from "./order_progress.js";



export const OrderComponent = {

    //utils
    createItemInputId(itemId,inputName){
        return `${itemId}${capitalize(inputName)}`
    },
    createItemInputName(itemName,inputName){
        return `${itemName}-${inputName}`;
    },

    //handlers
    addOrderItemTabIntro(){
        const tabIntroComponent = OrderComponent.orderItemTabIntroComponent();
        appendElementToParentWithFragment(
            document.querySelector('.js-order-item-tab-list'),
            tabIntroComponent
        )
        transitionElementOpen(tabIntroComponent);
    },
    addOrderItemIntro(){
        const itemIntroComponent = OrderComponent.orderItemIntroComponent();
        appendElementToParentWithFragment(
            document.querySelector('.js-order-item-list'),
            itemIntroComponent
        )
        transitionElementOpen(itemIntroComponent);
    },
    displayInputContentInOutputElement(event){
        if(!event.target.value) return;
        const output = document.querySelector(`[data-output="${event.target.name}"]`)
        if(output){
            output.textContent = event.target.value;
        }
        
    },
    toggleFieldSelectionStyle(event){
        if(event.target.value){
            event.target.classList.add('selected');
        }else{
            event.target.classList.remove('selected');
        }
    },
    handleItemPriceQuantityCalculation(changeEvent){
        const li = changeEvent.target.closest('li');
        const datalistOption = li.querySelector(`#${li.id}Prices option[value="${li.dataset.itemId}"]`);
        const optionPrice = datalistOption.dataset.price;
        const price = Number(optionPrice) * Number(changeEvent.target.value);
    
        const quantityOutput = document.querySelector(`[data-output="${li.dataset.itemId}-price"]`);
        quantityOutput.textContent = `${price}`;
    },
    handleCakeItemPriceQuantityCalculation(changeEvent){
        const li = changeEvent.target.closest('li');
        const sizeFieldSelect = li.querySelector(`#${li.id}Size`);
    
        if(sizeFieldSelect && sizeFieldSelect.value !== '-- select --'){
            console.log('size field found')
            const datalistOption = li.querySelector(`#${li.id}Prices option[value="${sizeFieldSelect.value}"]`);
            const optionPrice = datalistOption.dataset.price;
            const price = Number(optionPrice) * Number(changeEvent.target.value);
    
            const quantityOutput = document.querySelector(`[data-output="${li.dataset.itemId}-price"]`);
            quantityOutput.textContent = `${price}`;
        }
    },
    handleItemPriceSizeCalculation(changeEvent){
        const li = changeEvent.target.closest('li');
        const quantityFieldElement = li.querySelector(`#${li.id}Quantity`);
    
        if(quantityFieldElement && quantityFieldElement.value !== '-- select --'){
            const datalistOption = li.querySelector(`#${li.id}Prices option[value="${changeEvent.target.value}"]`)
            const optionPrice = datalistOption.dataset.price;
            const price = Number(optionPrice) * Number(quantityFieldElement.value);
    
            const quantityOutput = document.querySelector(`[data-output="${li.dataset.itemId}-price"]`);
            quantityOutput.textContent = `${price}`;
        }
    },
    activateAndShowOrderItem(itemId){
        const orderItem = document.querySelector(`[data-item-id="${itemId}"]`);
        if(!orderItem) return;
        transitionElementOpen(orderItem, (element)=>{
            element.classList.add('active');
        });
    },
    markRetrievalTypeAvailable(retrievalType){
        const informaitonElement = document.querySelector(`.js-retrieval-information-${retrievalType}`);
        if(!informaitonElement){
            console.warn(`information element type: ${retrievalType} does not exits`);
            return;
        }
        if(!informaitonElement.classList.contains('unavailable')) return;
        informaitonElement.classList.remove('unavailable');
    },
    addInspirationContent(event){
        event.preventDefault();
        const item = event.currentTarget.closest('li');
        const itemId = item.dataset.itemId;
        const inspirationContentComponent = OrderComponent.inspirationContentComponent(itemId);
        const inspirationElement = item.querySelector(`.inspiration`);
        if(!inspirationElement){
            console.warn(`${itemId} inpiration element does not exist`);
            return;
        }
        appendElementToParentWithFragment(
            inspirationElement,
            inspirationContentComponent
        );
        transitionElementOpen(inspirationContentComponent);

        item.querySelector(`.remove-inspiration-btn`).classList.add('show');
        event.currentTarget.classList.remove('show');

        OrderProgress.removeState(2);
        OrderProgress.listenToAreaInputs('.js-item-info',2);
    },
    removeInspirationContent(event){
        event.preventDefault();
        const item = event.currentTarget.closest('li');
        item.querySelector('.inspiration-content').remove();
        item.querySelector('.add-inspiration-btn').classList.add('show');
        event.currentTarget.classList.remove('show');

        OrderProgress.removeState(2);
        OrderProgress.inspectAreaInputProgress('.js-item-info',2);
    },
    itemListHasCakes(itemId){
        let hasCakes = false;
        document.querySelectorAll('.js-order-item').forEach( itemElement => {
            if(itemElement.dataset.itemId !== itemId){
                const parts = itemElement.dataset.itemId.split('-');
                if(parts.length > 0 && parts[1] === 'cake'){
                    hasCakes = true;
                }
            } 
        });
        return hasCakes;
    },
    handleItemTabActivation(){
        
        const orderItemTabs = [...document.querySelectorAll('.js-order-item-tab')];
    
        for(let i = 0; i < orderItemTabs.length; i++){
            const itemTab = orderItemTabs[i];
            if(itemTab.classList.contains('active')){
                
                const orderItemTabList = document.querySelector('.js-order-item-tab-list');
                const previousTab = orderItemTabs[i-1];
                const nextTab = orderItemTabs[i+1];

                if(previousTab && orderItemTabs.length === 2){
                    
                    clearParentElement(orderItemTabList);
                    OrderComponent.addOrderItemTabIntro();
                    OrderComponent.activateAndShowOrderItem(previousTab.dataset.tabId);

                }else if(previousTab){

                    previousTab.classList.add('active');
                    orderItemTabList.removeChild(itemTab);
                    OrderComponent.activateAndShowOrderItem(previousTab.dataset.tabId);
    
                }else if(nextTab && orderItemTabs.length === 2){
                    
                    clearParentElement(orderItemTabList);
                    OrderComponent.addOrderItemTabIntro();
                    OrderComponent.activateAndShowOrderItem(nextTab.dataset.tabId);
                }
                else if(nextTab){
                    nextTab.classList.add('active');
                    orderItemTabList.removeChild(itemTab);
                    OrderComponent.activateAndShowOrderItem(nextTab.dataset.tabId);
                }
                break;
            }
        }
    },
    removeComponentFromOrder(event){
        event.preventDefault();
        const itemId = event.currentTarget.value;
        
        OrderComponent.handleItemTabActivation();
    
        if(!OrderComponent.itemListHasCakes(itemId)){
            enableSelectFieldOption(`#OrderFormItem`,itemId);
            OrderComponent.markRetrievalTypeAvailable('shipping');
        }
        
        const orderItemList = document.querySelector('.js-order-item-list');
        orderItemList.removeChild(
            document.querySelector(`[data-item-id="${itemId}"]`)
        );
        if(orderItemList.children.length === 0){
            OrderComponent.addOrderItemIntro();
            OrderProgress.removeState(1);
            OrderProgress.removeState(2);
        }else{
            OrderProgress.inspectAreaInputProgress('.js-item-info',2);
        }
        
        const orderItemSelection = document.querySelector(`#OrderFormItem`);
        orderItemSelection.querySelector(`option[value="${itemId}"]`).removeAttribute('disabled');
        orderItemSelection.value = "";
    },


    // intro components
    orderItemTabIntroComponent(){
        return createHtmlElement('p', { class: 'order-item-tab-intro js-order-item-tab-intro'},
            `more than one item can be selected`
        );
    },
    orderItemIntroComponent(){
        return createHtmlElement('div', { class: `order-item-intro js-order-item-intro`},
            createHtmlElement('ul',{},[
                createHtmlElement('li',{},`select your item`),
                createHtmlElement('li',{},`select your retireval type`),
                createHtmlElement('li',{},`select your payment`),
                createHtmlElement('li',{},`provide your contact information`),
                createHtmlElement('li',{},`make sure everything looks good`),
                createHtmlElement('li',{},`place your order!`),
            ])
        )
    },
    
    // tab component
    orderItemTabComponent(itemId,imageSourcePath){
        const [first,last] = itemId.split('-');
    
        return createHtmlElement('li', { class: 'btn order-item-tab js-order-item-tab', 'data-tab-id':itemId },[
                createHtmlElement('div',{},[
                    `${first}`,
                    createHtmlElement('br',{}),
                    `${last}`
                ]),
                createHtmlElement('img',{ src: imageSourcePath })
        ]);
    },

    //item fields
    dateNeededInputComponent(inputId,inputName){
        const dateInput = createHtmlElement('input',{
            type: 'date',
            id: inputId,
            name: inputName,
            class: 'form-date-input js-item-info',
            required: 'true',
            autocomplete: 'off'
        });
        dateInput.addEventListener('change',OrderComponent.toggleFieldSelectionStyle);
        dateInput.addEventListener('input', OrderComponent.displayInputContentInOutputElement);
        limitDateInputSelection(dateInput,14);
    
        const calendarIconComponent = createHtmlElement('img',{ src: '/bakedbybec/img/icon/site/bbb_icon_calendar_64x64.png'});
        calendarIconComponent.addEventListener('click', ()=> dateInput.showPicker());
    
        return createHtmlElement('label',{ for: inputId, class: 'custom-date-component form-label'},[
            createHtmlElement('div',{},[
                'date needed',
                createHtmlElement('span',{ class: 'img-wrapper'},calendarIconComponent)
            ]),
            dateInput,
            createHtmlElement('p',{ class: 'form-input-message'},[
                'Orders must be placed at least ',
                createHtmlElement('br',{}),
                createHtmlElement('strong',{ class: 'pink-text'},'2 weeks '),
                'before the event.'
            ])
        ])
    },
    orderSelectComponent(selectTitle,selectId,selectName,selectOptions,inputClassName){

        const select = createHtmlElement('select',{ 
            id:selectId, 
            name:selectName, 
            class:`form-select ${inputClassName}`,
        },createHtmlElement('option',{selected: 'true', disabled: 'true'},'-- select --')
        );
        selectOptions.forEach( selectOption =>{
            if(!selectOption.content){
                select.appendChild(createHtmlElement('option',{value: selectOption.value}, selectOption.value))
            }else{
                select.appendChild(createHtmlElement('option',{value: selectOption.value}, selectOption.content))
            }
            
        });
        //select.addEventListener('change', OrderComponent.toggleFieldSelectionStyle);
        select.addEventListener('input', OrderComponent.displayInputContentInOutputElement);
        
        return createHtmlElement('label',{ for:selectId, class:'form-label' },[
            createHtmlElement('div',{},selectTitle),
            select
        ]);
    },
    orderTextInputComponent(inputTitle,inputId,inputName,inputClassName){
        const input = createHtmlElement('input',{ 
            type:'text', 
            id:inputId, 
            name:inputName, 
            required:'true',
            autocomplete:'off',
            class:`form-text-input ${inputClassName}`,
        });
        if(inputTitle === 'theme/occasion'){
            input.setAttribute('list','ItemThemes');
        }
        //input.addEventListener('change', OrderComponent.toggleFieldSelectionStyle);
        input.addEventListener('input', OrderComponent.displayInputContentInOutputElement);
    
        return createHtmlElement('label',{ for:inputId, class:`form-label` },[
            createHtmlElement('div',{},inputTitle),
            input
        ]);
    },
    orderTextAreaComponent(textareaTitle,textareaId,textareaName,inputClassName){
        const textarea = createHtmlElement('textarea',{ 
            id:textareaId, 
            name:textareaName,
            // cols: '30',
            rows: '3',
            required:'true',
            autocomplete:'off',
            class:`form-textarea ${inputClassName}`,
        });
        //textarea.addEventListener('change', OrderComponent.toggleFieldSelectionStyle);
        textarea.addEventListener('input', OrderComponent.displayInputContentInOutputElement);
    
        return createHtmlElement('label',{ for:textareaId, class:`form-label` },[
            createHtmlElement('div',{},textareaTitle),
            textarea
        ]);
    },

    //item component
    orderHeaderComponent(itemId,imageSourcePath){
        const titleParts = itemId.split('-');
    
        const removeBtn = createHtmlElement('button', { 
            type: 'button',
            value: itemId,
            class: `btn remove-order-btn`
        },'remove item');
        removeBtn.addEventListener('click', OrderComponent.removeComponentFromOrder);
    
        return createHtmlElement('header', {},[
            createHtmlElement('img', {
                src: imageSourcePath,
                class: 'order-item-img'
            }),
            createHtmlElement('h3',{}, `${capitalize(titleParts[0])} ${capitalize(titleParts[1])}`),
            removeBtn
        ])
    },
    orderItemPriceComponent(prices){
        if(prices.length <= 0) return;

        if(prices.length === 1){
            return createHtmlElement('div',{ class: 'order-item-price-display'},[
                createHtmlElement('h4',{},'price'),
                createHtmlElement('p',{},[
                    createHtmlElement('span',{ class:'pink-text' }, `$${prices[0].price}`),
                    prices[0].units || document.createElement('span')
                ])
            ]);
        }else{
            const priceDisplays = prices.map( priceInfo => {
                const priceDisplay = createHtmlElement('p',{},
                    createHtmlElement('span',{ class:'pink-text' },`$${priceInfo.price}`)
                );
                if(priceInfo.units) priceDisplay.appendChild(
                    document.createTextNode(priceInfo.units.toString())
                )
                return createHtmlElement('div',{},[
                    createHtmlElement('p',{},priceInfo.title),
                    priceDisplay
                ])
            })
            return createHtmlElement('div',{ class: 'order-item-prices-display'},[
                createHtmlElement('h4',{},'prices'),
                ...priceDisplays
            ])
        }
    },
    createOrderItemFieldsGroupComponent(itemId,itemName,fields){
        const group2 = createHtmlElement('fieldset',{ class: 'form-group'});
        fields.forEach( field => {
            const selectField = OrderComponent.orderSelectComponent(
                field.title,
                `${itemId}${capitalize(field.name)}`,
                `${itemName}-${field.name}`,
                field.options,
                'js-item-info'
            );
            if(field.title === 'size'){
                const selectFieldElement = selectField.querySelector('select');
                selectFieldElement.addEventListener('change', OrderComponent.handleItemPriceSizeCalculation);
            }
            group2.appendChild(selectField);
        });
        return group2;
    },
    inspirationContentComponent(itemId){
        const [first,last] = itemId.split('-');
        const idString = capitalize(first) + capitalize(last);
    
        const filenameOutput = createHtmlElement('div',{ class: 'filename-output'},'-- no file selected');
        const imageOutput = createHtmlElement('img', { src: "", class: `inspiration-img-output viewable`});
        const fileUploadInput = createHtmlElement('input', { 
            type: 'file', 
            id: `${idString}ImageUploadInput`, 
            name: `${itemId}-image`,
            class: 'file-upload-input js-item-info'
        });
    
        const browseBtn = createHtmlElement('button', { type: 'button', class: 'btn browse-file-btn'}, 'browse files');
        browseBtn.addEventListener('click', (clickEvent)=> {
            clickEvent.preventDefault();
            fileUploadInput.addEventListener('input', (inputEvent)=>{
                const file = inputEvent.target.files[0];
                filenameOutput.textContent = file.name;
    
                const fileReader = new FileReader();
                fileReader.onload = function(){
                    imageOutput.src = fileReader.result;
    
                    const output = document.querySelector(`[data-output="${inputEvent.target.name}"]`);
                    if(output){
                        output.src = fileReader.result;
                    }
                };
                fileReader.readAsDataURL(file);
            });
            fileUploadInput.click();
        });
    
        return createHtmlElement('div', { class: 'inspiration-content'},[
            createHtmlElement('p', {},[
                `Pictures will be `,
                createHtmlElement('span',{ class: 'pink-text' }, `used for inspiration only`),
                createHtmlElement('br',{}),
                'and will not be recreated 100%.'
            ]),
            createHtmlElement('label', { for: `${idString}ImageUploadInput`, class: 'file-upload-element'},[
                browseBtn,
                filenameOutput,
                fileUploadInput
            ]),
            createHtmlElement('div', { class: 'inspiration-img-wrapper'},
                imageOutput
            )
        ]);
    },
    inspirationComponent(){
        const addBtn = createHtmlElement('button', { type: 'button', class: 'btn add-inspiration-btn show' },[
                `+ inspiration`,
                createHtmlElement('img', { src: `/bakedbybec/img/icon/site/bbb_icon_image_64x64.png`, width: '16'})
        ]);
        addBtn.addEventListener('click', OrderComponent.addInspirationContent);
        const removeBtn = createHtmlElement('button', { type: 'button', class: `btn remove-inspiration-btn`},
            `remove`
        );
        removeBtn.addEventListener('click', OrderComponent.removeInspirationContent);
    
        return createHtmlElement('div',{ class: 'inspiration'},
            createHtmlElement('div',{ class: 'inspiration-controls' },[
                addBtn,
                removeBtn,
            ])
        );
    },
    createItemPriceDataListComponent(itemId,itemName,prices){
        const datalist = createHtmlElement('datalist',{ id: `${itemId}Prices`});
        prices.forEach( data => {
            if(data.title){
                datalist.appendChild(createHtmlElement('option',{ value: data.title, 'data-price':data.price }))
            }else{
                datalist.appendChild(createHtmlElement('option',{ value: itemName, 'data-price':data.price }))
            }
        });
        return datalist;
    },
    orderItemComponent(itemData){

        const quantityField = OrderComponent.orderSelectComponent(
            itemData.quantityField.title,
            OrderComponent.createItemInputId(
                itemData.id,
                itemData.quantityField.name
            ),
            OrderComponent.createItemInputName(
                itemData.name,
                itemData.quantityField.name
            ),
            itemData.quantityField.options,
            'js-item-info'
        );
    
        if(itemData.name === 'layer-cake' || itemData.name === 'sheet-cake'){
            const quantitySelect = quantityField.children[1];
            quantitySelect.addEventListener('change', OrderComponent.handleCakeItemPriceQuantityCalculation);
        }else{
            const quantitySelect = quantityField.children[1];
            quantitySelect.addEventListener('change', OrderComponent.handleItemPriceQuantityCalculation);
        }
    
        const li = createHtmlElement('li', { 
            id:itemData.id, 
            class: `order-item js-order-item ${itemData.name}-item`,
            'data-item-id':`${itemData.name}`
        },[
            OrderComponent.orderHeaderComponent(
                itemData.name,
                itemData.imageSourcePath
            ),
            createHtmlElement('fieldset',{ class: 'form-group'},[
                OrderComponent.orderItemPriceComponent(itemData.prices),
                OrderComponent.dateNeededInputComponent(
                    OrderComponent.createItemInputId(itemData.id,'Date'),
                    OrderComponent.createItemInputName(itemData.name,'date'),
                ),
                quantityField
            ])
        ]);
    
        if(itemData.fields.length > 0){
            const fieldset = OrderComponent.createOrderItemFieldsGroupComponent(
                itemData.id,
                itemData.name,
                itemData.fields
            )
            li.appendChild(fieldset);
        }
        if(itemData.name !== 'drop-cookies' && itemData.name !== 'cake-pops'){
            li.appendChild(
                createHtmlElement('fieldset',{ class: 'form-group'},[
                    OrderComponent.orderTextInputComponent('theme/occasion',`${itemData.id}Theme`,`${itemData.name}-theme`,'js-item-info'),
                    OrderComponent.orderTextAreaComponent('personalization',`${itemData.id}Personalization`,`${itemData.name}-personalization`,'js-item-info'),
                    OrderComponent.inspirationComponent() 
                ])
            )
        }
    
        li.appendChild(
            OrderComponent.createItemPriceDataListComponent(
                itemData.id,
                itemData.name,
                itemData.prices
            )
        )
        return li;
    },

    // address
    addAddressInformationComponent(clickEvent){
        const buttonParent = clickEvent.target.closest('.js-pickup-distance-information');
        const retrievalType = clickEvent.target.dataset.retrievalType;
        const personalInformationElement = document.querySelector('.js-order-form .js-personal-information');
        const addressComponent = OrderComponent.orderAddressComponent(retrievalType);
        buttonParent.remove();
        appendElementToParentWithFragment(
            personalInformationElement,
            addressComponent
        );
        transitionElementOpen(addressComponent);
        OrderProgress.removeState(5);
        OrderProgress.listenToAreaInputs('.js-personal-info',5);
    },
    addAddressInformationButtonComponent(){
        const addressInformationComponent = createHtmlElement('button',
            {type: 'button', class: 'btn add-personal-address-btn', 'data-retrieval-type':'pickup'},
            `I'd like to check my pick-up distance`
        );
        addressInformationComponent.addEventListener('click', OrderComponent.addAddressInformationComponent);
        return addressInformationComponent;
    },
    orderAddressDistanceComponent(addressType){
        const distanceLink = createHtmlElement('a',{
            class:'link check-distance-btn js-check-distance-btn',
            src: "",
        },(addressType === 'pickup' ? 'get approx distance':'check delivery address availability'));
    
        distanceLink.addEventListener('click', (clickEvent)=>{
            clickEvent.preventDefault();
    
            alert(`This doesn't do anything yet`);
        });
    
        if(addressType === 'pickup'){
    
            return createHtmlElement('div',{
                class: 'distance-information js-distance-information'},
                createHtmlElement('div',{},[
                    createHtmlElement('h3',{},'distance/mileage'),
                    distanceLink,
                    createHtmlElement('p',{},[
                        'approx: distance: ',
                        createHtmlElement('span',{'data-output':'distance'},'0'),
                        ' miles'
                    ])
                ])
            );
    
        }else if(addressType === 'delivery'){
    
            return createHtmlElement('div',{
                class: 'distance-information js-distance-information'},
                createHtmlElement('div',{},[
                    createHtmlElement('h3',{},'distance/mileage'),
                    distanceLink,
                    createHtmlElement('p',{},[
                        'availability: ',
                        createHtmlElement('span',{'data-output':'delivery-availability'},'none')
                    ]),
                    createHtmlElement('p',{},[
                        'approx. distance: ',
                        createHtmlElement('span',{'data-output':'distance'},'0'),
                        'miles'
                    ]),
                    createHtmlElement('p',{},[
                        'approx. price($): ',
                        createHtmlElement('span',{'data-output':'mileage-price'},'0')
                    ])
                ])
            );
        }
    },
    getPickupOrderAddressComponent(){
        return createHtmlElement('div', { class: 'pickup-distance-information js-pickup-distance-information'},[
            createHtmlElement('h3',{},'distance/mileage'),
            createHtmlElement('div',{}, OrderComponent.addAddressInformationButtonComponent())
        ]);
    },
    orderAddressComponent(addressType){
        const addressInformationComponent = createHtmlElement('div',{ class: 'address-information js-address-information'},[
            createHtmlElement('p',{class:'address-informent-message'},[
                'please provide ',
                createHtmlElement('span',{class: 'address-type-output'},addressType),
                ' address information'
            ]),
            OrderComponent.orderTextInputComponent('street','OrderFormStreet','street','js-personal-info'),
            OrderComponent.orderTextInputComponent('city','OrderFormCity','city','js-personal-info'),
            OrderComponent.orderSelectComponent('state','OrderFormState','state',(addressType === 'delivery' ? [listOfUsStates[14]]:listOfUsStates),'js-personal-info'),
            OrderComponent.orderTextInputComponent('zip','OrderFormZipCode','zip-code','js-personal-info'),
        ]);
        if(addressType === 'delivery' || addressType === 'pickup'){
            addressInformationComponent.appendChild(
                OrderComponent.orderAddressDistanceComponent(addressType)
            );
        }
        return addressInformationComponent;
    },

    // invoice
    createInvoiceItemColumnComponent(title,content,outputId){
        const p = createHtmlElement('p',{},content);
        if(outputId) p.setAttribute('data-output', outputId);
        return createHtmlElement('div', { class: 'column' },[
            createHtmlElement('h4',{},title),
            p
        ]);
    },
    orderInvoiceItemComponent(itemName,options){
        const [ first, last ] = itemName.split('-');
    
        const infoRow = createHtmlElement('div', { class: 'row' },
            OrderComponent.createInvoiceItemColumnComponent('item',`${first} ${last}`)
        );
    
        options.forEach( option => {
            infoRow.appendChild(
                OrderComponent.createInvoiceItemColumnComponent(option,'none',`${itemName}-${option === 'date needed' ? 'date':option}`)
            );
        });
    
        return createHtmlElement('li', { class: 'product-item', 'data-item-connection-id': itemName },[
            infoRow,
            createHtmlElement('div', { class: 'row' },[
                OrderComponent.createInvoiceItemColumnComponent('theme','none',`${itemName}-theme`),
                OrderComponent.createInvoiceItemColumnComponent('personalization','none',`${itemName}-personalization`),
                createHtmlElement('div', { class: 'column'},[
                    createHtmlElement('h4',{},'image'),
                    createHtmlElement('div', { class: 'img-wrapper' },
                        createHtmlElement('img',{ src: "", 'data-output':`${itemName}-image` },'none')
                    )
                ]),
                createHtmlElement('div',{ class: 'column' },
                    createHtmlElement('p',{},[
                        `price($): `,
                        createHtmlElement('span',{ 'data-output':`${itemName}-price`, class: 'invoice-item-price-output' },'00.00')
                    ])
                )
            ])
        ]);
    }
};