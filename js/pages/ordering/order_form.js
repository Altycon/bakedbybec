import { 
    appendElementToParentWithFragment, 
    capitalize, 
    createHtmlElement, 
    disableSelectFieldOption, 
    enableSelectFieldOption, 
    getFutureDateByDays, 
    getTodaysDateString, 
    transitionElementOpen 
} from "../../utilities.js";
import { listOfUsStates, OrderItemData } from "./order_data.js";
import { OrderProgress } from "./order_progress.js";
import { PRODUCT_DATA } from "./product_data.js";

const removeEvent = new CustomEvent('bbb:remove-item')
function transition(type,element,immediateClassNames,delayedClassNames,delay,delayedCallback){
    function handleClasses(classNames,action){
        if(classNames){
            if(Array.isArray(classNames)){
                element.classList[action](...classNames)  
            }else{
                element.classList[action](classNames)
            }
        }
    }
    switch(type){
        case 'add':
        case 'remove':
            handleClasses(immediateClassNames,type);
            if(delayedClassNames){
                setTimeout( ()=>{
                    handleClasses(delayedClassNames,type);
                    if(delayedCallback) delayedCallback(element);
                },delay ? delay:100)
            }
        break;
        case 'add-remove':
            handleClasses(immediateClassNames,'add');
            if(delayedClassNames){
                setTimeout( ()=>{
                    handleClasses(delayedClassNames,'remove');
                    if(delayedCallback) delayedCallback(element);
                },delay ? delay:100)
            }
        break;
    }
};
function connectInputToOutput(event){
    console.log(event.target)
    const outputId = event.target.id;
    const outputElement = document.querySelector(`[data-output="${outputId}"]`);
    if(outputElement){
        switch(outputId){
            case 'SugarCookiesQuantity':
            case 'DropCookiesQuantity':
            case 'CupCakesQuantity':
            case 'CakePopsQuantity':
                outputElement.textContent = `${event.target.value} dozen`;
                break;
            default : 
            outputElement.textContent = event.target.value;
            break;
        }
        
    }else{
        console.error(`output element for ${outputId} missing or not connected`)
    }
};
const OrderInvoice = {
    content: undefined,
    dateOutput: undefined,
    itemQuantityOutput: undefined,
    retrievalTypeOutput: undefined,
    retrievalPriceOutput: undefined,
    retrievalCostOutput: undefined,
    retrievalDistanceOutput: undefined,
    paymentTypeOutput: undefined,
    itemsList: undefined,
    imageList: undefined,
    hasImages: false,
    
    setDate(dateString){
        if(!dateString) dateString = getTodaysDateString();
        this.dateOutput.textContent = dateString;
    },
    addNumberOfItems(){
        let currentNumber = Number(this.itemQuantityOutput.textContent);
        
        currentNumber++;
        this.itemQuantityOutput.textContent = `${currentNumber}`;
    },
    subtractNumberOfItems(){
        let currentNumber = Number(this.itemQuantityOutput.textContent);
        currentNumber--;
        this.itemQuantityOutput.textContent = `${currentNumber}`;
    },
    setRetrievalType(type){
        this.retrievalTypeOutput.textContent = type;
    },
    setRetrievalPrice(price){
        this.retrievalPriceOutput.textContent = price;
    },
    setRetrievalCost(cost){
        this.retrievalCostOutput = cost;
    },
    setRetrievalDistance(distance){
        this.retrievalDistanceOutput.textContent = distance;
    },
    setPaymentType(type){
        this.paymentTypeOutput.textContent = type;
    },
    createImagesContent(imageColumn){
        const list = createHtmlElement('ul',{ class: 'images-list' });
        this.imageList = list;
        if(imageColumn){
            list.appendChild(imageColumn);
        }
        return createHtmlElement('div', { class:'images' },[
            createHtmlElement('h3',{},'images'),
            list
        ]);
    },
    createImageColumn(outputId,imagePath){
        return createHtmlElement('li',{ class: 'img-wrapper' },
            createHtmlElement('img', { src: imagePath, 'data-output':outputId})
        )
    },
    appendImagesContent(){
        this.content.insertBefore(
            new DocumentFragment().appendChild(
                this.createImagesContent()
            ),
            document.querySelector('.order-invoice .content .bottom')
        );
        this.hasImages = true;
    },
    appendImageColumn(outputId,imagePath){
        const imageColumn = this.createImageColumn(outputId,imagePath);
        if(!this.hasImages){
            this.createImages(imageColumn);
        }else{
            this.imageList.appendChild(
                new DocumentFragment().appendChild(
                    imageColumn
                )
            )
        }
        
    },
    createItemDescription(itemId,itemTitle,fields){
        const description = createHtmlElement('p',{});
        if(fields.length === 0){
            const span1 = createHtmlElement('span',{},itemTitle)
            description.appendChild(span1);
        }else{
            for(let i = 0; i < fields.length; i++){
                if(fields[i] === '/' && fields[i+1]){
                    const fieldName = fields[i+1] === 'baking chips' ? 'chips':fields[i+1]
                    description.append(
                        createHtmlElement('span',{},itemTitle),
                        createHtmlElement('span',{},'/w'),
                        createHtmlElement('span',{ 
                            'data-output':`${itemId}${capitalize(fieldName)}`
                        }),
                        createHtmlElement('span',{},fields[i+1])
                    );
                    break;
                }else if(fields[i] === '/'){
                    description.appendChild(
                        createHtmlElement('span',{},itemTitle),
                    );
                    break;
                }
                description.appendChild(
                    createHtmlElement('span',{ 'data-output':`${itemId}${capitalize(fields[i])}`})
                )
            }
        }
        
        return description;
    },
    createItem(itemId,itemTitle,themed,fields){

        const li = createHtmlElement('li', { class: 'item' },
            createHtmlElement('div', { class: 'row' },[
                createHtmlElement('div', { class: 'column' },
                    createHtmlElement('p', { 'data-output':`${itemId}Quantity` },'0')
                ),
                createHtmlElement('div', { class: 'column' },
                    this.createItemDescription(itemId,itemTitle,fields)
                ),
                createHtmlElement('div', { class: 'column' },
                    createHtmlElement('p', { 'data-output':`${itemId}Date`})
                ),
                createHtmlElement('div', { class:'column' },
                    createHtmlElement('p',{},[
                        createHtmlElement('span',{},'$'),
                        createHtmlElement('span',{ 'data-output':`${itemId}Price` })
                    ])
                )
            ])
        );

        if(themed){
            li.appendChild(
                createHtmlElement('div', { class:'row' },[
                    createHtmlElement('div', { class:'column' },
                        createHtmlElement('h4',{},'details:')
                    ),
                    createHtmlElement('div', { class: 'column' },
                        createHtmlElement('p',{ 'data-output':`${itemId}Theme` })
                    ),
                    createHtmlElement('div',{ class: 'column' },
                        createHtmlElement('p',{ 'data-output':`${itemId}Personalization` })
                    )
                ])
            );
        }
        return li;
    },
    addItem(itemName,itemTitle,themed,fields){
        const item = this.createItem(itemName,itemTitle,themed,fields);
        if(!item){
            console.warn(`Error creating item: ${itemName}`);
            return;
        }
        this.itemsList.appendChild(
            new DocumentFragment().appendChild(item)
        )   
    },
    initialize(){
        try{
            this.itemsList = document.querySelector('.js-invoice-items-list');
            if(!this.itemsList) throw new Error('missing element - invoice items list');

            this.itemQuantityOutput = document.querySelector('#InvoiceItemQuantity');
            if(!this.itemQuantityOutput) throw new Error('missing element - invoice item quantity output');

            this.dateOutput = document.querySelector('#InvoiceDateOutput');
            if(!this.dateOutput) throw new Error('missing element - invoice date output');

            this.retrievalTypeOutput = document.querySelector('#InvoiceRetrievalTypeOutput');
            if(!this.retrievalTypeOutput) throw new Error('missing element - invoice retrieval type output');

            this.retrievalPriceOutput = document.querySelector('#InvoiceRetrievalPriceOutput');
            if(!this.retrievalPriceOutput) throw new Error('missing element - invoice retrieval price output');

            this.retrievalCostOutput = document.querySelector('#InvoiceRetrievalCostOutput');
            if(!this.retrievalCostOutput) throw new Error('missing element - invoice retrieval cost output');

            this.retrievalDistanceOutput = document.querySelector('#InvoiceRetrievalDistanceOutput');
            if(!this.retrievalDistanceOutput) throw new Error('missing element - invoice retrieval distance output');

            this.paymentTypeOutput = document.querySelector('#InvoicePaymentTypeOutput');
            if(!this.paymentTypeOutput) throw new Error('missing element - invoice payment type output');

        }catch(error){
            console.warn(error);
        }
        
    }
};
const TabComponent = {
    intro(){
        return createHtmlElement('p', { class: 'order-item-tab-intro js-order-item-tab-intro'},
            `more than one item can be selected`
        );
    },
    create(itemId,itemName,imagePath){
        const [ first, last ] = itemName.split('-');
        return createHtmlElement('li', { class: 'btn order-item-tab js-order-item-tab', 'data-tab-id':itemId },[
            createHtmlElement('div',{},[
                `${first}`,
                createHtmlElement('br',{}),
                `${last}`
            ]),
            createHtmlElement('img',{ src: imagePath })
        ], { type: 'click', listen: TabComponent.switchTab});
    }
}
const ProductComponent ={
    intro(){
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
    // handlers
    remove(clickEvent){
        if(clickEvent instanceof Event){
            clickEvent.preventDefault();
        }
        const itemElement = clickEvent.target.closest('li');
        if(!itemElement){
            console.warn(`order item element does not exist to remove`);
            return;
        }
        transition('add-remove',itemElement,'removing',['open','show','active','removing'],500,
            (element)=> element.remove()
        );
        OrderForm.removeItem(itemElement.id);

        enableSelectFieldOption(OrderForm.itemSelectElement,itemElement.dataset.name);
        OrderForm.itemSelectElement.value = "";
        OrderInvoice.subtractNumberOfItems();

        const activeTab = document.querySelector(`[data-tab-id="${itemElement.id}"].active`);
        if(activeTab){
            let nextTab = activeTab.nextElementSibling || activeTab.previousElementSibling;
            if(nextTab){
                nextTab.classList.add('active');
                for(let i = 0; i < OrderForm.items.length; i++){
                    const item = OrderForm.items[i];
                    if(item.id === nextTab.dataset.tabId){
                        transition('add',item,'open',['show','active']);
                        break;
                    }
                }
            }
            activeTab.remove();
            OrderForm.removeTab(activeTab.dataset.tabId);
        }
        
        if(OrderForm.items.length === 0){
            OrderForm.addTabIntro();
            OrderForm.addItemIntro();
        }

        if(OrderForm.hasCakes(itemElement.id)){
            disableSelectFieldOption('#OrderFormRetrieval','shipping');
        }else{
            enableSelectFieldOption('#OrderFormRetrieval','shipping');
        }
    },
    addInspiration(event){
        event.preventDefault();
        // gotta get the id and name 
        const item = event.currentTarget.closest('li');
        const itemId = item.id;
        const itemName = item.dataset.name;

        const inspirationContentComponent = ProductComponent.inspiration(itemId,itemName); // <-- fix this
        const inspirationElement = item.querySelector(`.js-inspiration`);
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
        item.querySelector(`.inspiration-controls > h3`).classList.add('show');
        event.currentTarget.classList.remove('show');

        OrderProgress.removeState(2);
        OrderProgress.listenToAreaInputs('.js-item-info',2);
    },
    removeInspiration(clickEvent){
        clickEvent.preventDefault();
        const item = clickEvent.currentTarget.closest('li');
        item.querySelector('.inspiration-content').remove();
        item.querySelector('.add-inspiration-btn').classList.add('show');
        item.querySelector(`.inspiration-controls > h3`).classList.remove('show');
        clickEvent.currentTarget.classList.remove('show');

        const invoiceItemImageElement = document.querySelector(`img[data-output="${item.dataset.itemId}"]`);
        if(invoiceItemImageElement){
            invoiceItemImageElement.src = "";
        }else{
            console.warn('invoice item image elemnent does not exist to be cleared');
        }

        // OrderProgress.removeState(2);
        // OrderProgress.inspectAreaInputProgress('.js-item-info',2);
    },
    addAddress(clickEvent){
        const buttonParent = clickEvent.target.closest('.js-pickup-distance-information');
        const retrievalType = clickEvent.target.dataset.retrievalType;
        const personalInformationElement = document.querySelector('.js-order-form .js-personal-information');
        const addressComponent = ProductComponent.addressFieldset(retrievalType);
        buttonParent.remove();
        appendElementToParentWithFragment(
            personalInformationElement,
            addressComponent
        );
        transitionElementOpen(addressComponent);
        // OrderProgress.removeState(5);
        // OrderProgress.listenToAreaInputs('.js-personal-info',5);
    },

    // components
    selectField(attributes,textContent,options){
        const select = createHtmlElement('select',attributes,
            createHtmlElement('option',{selected: 'true', disabled: 'true'},'-- select --'),
            { type: 'change', listen: connectInputToOutput }
        );
        // if(attributes.name && attributes.name === 'layer-cakes')
        options.forEach( selectOption =>{
            select.appendChild(createHtmlElement('option',{
                value: selectOption.value
            }, `${selectOption.textContent ? selectOption.textContent:selectOption.value}`))
        });
        return createHtmlElement('div', { class: 'field' },[
            createHtmlElement('label',{ for: attributes.id, class: 'form-label' },textContent),
            select,
            createHtmlElement('div', { class: 'field-output' },'select field output area')
        ])
    },
    field(tagName,attributes,textContent){
        return createHtmlElement('div', { class: 'field' },[
            createHtmlElement('label', { for: attributes.id, class: 'form-label'},textContent),
            createHtmlElement(tagName, attributes, null, 
                { type: 'input', listen: connectInputToOutput }
            ),
            createHtmlElement('div', { class: 'field-output' },'field output area')
        ]);
    },
    
    priceDisplay(prices){
        if(prices.length === 1){
            return createHtmlElement('div',{ class: 'order-item-price-display'},[
                createHtmlElement('h4',{},'price'),
                createHtmlElement('p',{},[
                    createHtmlElement('span',{ class:'pink-text' }, `$${prices[0].value}`),
                    prices[0].units || document.createElement('span')
                ])
            ]);
        }else{
            const priceDisplays = prices.map( price => {
                const priceDisplay = createHtmlElement('p',{},
                    createHtmlElement('span',{ class:'pink-text' },`$${price.value}`)
                );
                if(price.units) priceDisplay.appendChild(
                    document.createTextNode(price.units.toString())
                )
                return createHtmlElement('div',{},[
                    createHtmlElement('p',{},price.title),
                    priceDisplay
                ])
            })
            return createHtmlElement('div',{ class: 'order-item-prices-display'},[
                createHtmlElement('h4',{},'prices'),
                ...priceDisplays
            ])
        }
    },
    dateNeededField(id,name){
        const input = createHtmlElement('input',{
            type: 'date',
            id: id,
            name: name,
            class: 'form-date-input js-item-info',
            min: getFutureDateByDays(14),
            placeholder: 'mm/dd/yyyy',
            required: 'true',
            autocomplete: 'off'
        },null,
            { type: 'change', listen: connectInputToOutput }
        )
        return createHtmlElement('div', { class: 'custom-date-field field' },[
            createHtmlElement('label',{ for: id, class: 'form-label'},[
                'date needed',
                createHtmlElement('span',{ class:'img-wrapper' },[
                    createHtmlElement('img', { src: `img/icon/site/bbb_icon_calendar_64x64.png`, width: 16 },null,
                        { type: 'click', listen: ()=> input.showPicker() }
                    )
                ])
            ]),
            input,
            createHtmlElement('div', { class: 'field-output show' },[
                'Orders must be placed at least ',
                createHtmlElement('br',{}),
                createHtmlElement('strong',{ class: 'pink-text'},'2 weeks '),
                'before the event.'
            ])
        ]);
    },
    header(id,title,image){
        return createHtmlElement('header', {},[
            createHtmlElement('img', {
                src: image,
                class: 'order-item-img'
            }),
            createHtmlElement('h3',{}, title),
            createHtmlElement('button', { 
                type: 'button',
                value: id,
                class: `btn remove-order-btn`
            },'remove X', { type:'click', listen: this.remove })
        ])
    },
    commonFieldset(id,name,prices,quantity){
        return createHtmlElement('fieldset',{ class: 'common'},[
            this.priceDisplay(prices),
            this.dateNeededField(`${id}Date`,`${name}-date`),
            this.selectField({
                id: quantity.id,
                name: quantity.name,
                class: 'form-select js-item-info',
                autocomplete: 'off',
                required: 'true'
            },quantity.textContent,quantity.options )
        ])
    },
    extraFieldset(fields){
        const extraFields = [];
        for(const key in fields){
            if(key === 'quantity' || key === 'extended') continue;
            const field = fields[key];
            
            extraFields.push(
                this.selectField({
                    id: field.id,
                    name: field.name,
                    class: 'form-select js-item-info',
                    autocomplete: 'off',
                    required: 'true'
                },field.textContent,field.options)
            )
        }
        return createHtmlElement('fieldset', { class: 'extra' },extraFields)
    },
    inspiration(id,name){
       
        const filenameOutput = createHtmlElement('div',{ class: 'filename-output'},'-- no file selected');
        const imageOutput = createHtmlElement('img', { src: "", class: `inspiration-img-output viewable`});
        const fileUploadInput = createHtmlElement('input', { 
            type: 'file', 
            id: `${id}ImageUploadInput`, 
            name: `${name}-image`,
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
                    imageOutput.parentElement.classList.add('show');
                    AImageViewer.addImage(imageOutput);

                    const output = document.querySelector(`img[data-output="${name}"]`);
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
            createHtmlElement('label', { for: `${id}ImageUploadInput`, class: 'file-upload-element'},[
                browseBtn,
                filenameOutput,
                fileUploadInput
            ]),
            createHtmlElement('div', { class: 'inspiration-img-wrapper'},
                imageOutput
            )
        ]);
    },
    inspirationSelect(){
        return createHtmlElement('div',{ class: 'inspiration js-inspiration'},
            createHtmlElement('div',{ class: 'inspiration-controls' },[
                createHtmlElement('button', { type: 'button', class: 'btn add-inspiration-btn show' },[
                    `+ inspiration`,
                    createHtmlElement('img', { src: `img/icon/site/bbb_icon_image_64x64.png`, width: '16'})
                ], { type: 'click', listen: this.addInspiration }),
                createHtmlElement('h3',{},'inspiration image'),
                createHtmlElement('button', { type: 'button', class: `btn remove-inspiration-btn`},
                    `remove X`,
                    { type: 'click', listen: this.removeInspiration }
                ),
            ])
        );
    },
    themeFieldset(id,name){
        return createHtmlElement('fieldset',{ class: 'theme'},[
            this.field('input',{
                id: `${id}Theme`,
                name: `${name}-theme`,
                class:`form-text-input js-item-info`,
                placeholder: 'birthday/wedding',
                list: 'ItemThemes',
                required:'true',
                autocomplete:'off'
            }, 'theme/occasion'),
            this.field('textarea',{
                id: `${id}Personalization`, 
                name: `${name}-personalization`,
                class:`form-textarea js-item-info`,
                placeholder: 'names,words,colors,style',
                rows: '3',
                required:'true',
                autocomplete:'off',
            },'personalization'),
            this.inspirationSelect() 
        ])
    },
    priceDataList(id,name,prices){
        const datalist = createHtmlElement('datalist',{ id: `${id}Prices`});
        if(prices.length > 1){
            prices.forEach( price => {
                datalist.appendChild(
                    createHtmlElement('option',{ value: price.title, 'data-price':price.value })
                );
            });
        }else{
            datalist.appendChild(
                createHtmlElement('option',{ value: name, 'data-price':prices[0].value })
            );
        }
        
        return datalist;
    },
    create(itemId,itemName,itemTitle,itemPrices,itemImage,itemFields,itemThemed){
        const component = createHtmlElement('li', { 
            id: itemId, 
            class: 'order-item js-order-item',
            'data-name':itemName 
        });
        const header = this.header(itemId,itemTitle,itemImage);
        const commonFieldset = this.commonFieldset(
            itemId,
            itemName,
            itemPrices,
            itemFields.quantity
        );
        component.append(header,commonFieldset);

        if(itemFields.extended){
            component.appendChild(
                this.extraFieldset(itemFields)
            )
        }

        if(itemThemed){
                component.appendChild(this.themeFieldset(itemId,itemName));
        }
        component.append(
            this.priceDataList(itemId,itemName,itemPrices),
            createHtmlElement('input',{
                type: 'text',
                id: `${itemId}Price`,
                name: `${itemName}-price`,
                autocomplete: 'off',
                hidden: 'true'
            }),
            createHtmlElement('input',{
                type: 'text',
                id: `${itemId}Cost`,
                name: `${itemName}-cost`,
                autocomplete: 'off',
                hidden: 'true'
            })
        )
        return component;
    },
    
    addressDistance(addressType){
        const distanceButton = createHtmlElement('button',{
            type: 'button',
            class:'button check-distance-btn js-check-distance-btn',
        },(addressType === 'pickup' ? 'get approx distance':'check delivery address availability'));
    
        distanceButton.addEventListener('click', async (clickEvent)=>{
            clickEvent.preventDefault();

            if(!confirm('Are you sure you want to continue?')) return;

            try{
                //const currentLocation = await Order.getCurrentLocation();

                const fetchResponse = await fetch(new URL('/api/distance-request','http://127.0.0.1:3456'),{
                    method: 'post',
                    headers: {
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify(currentLocation)
                });
               
                //const data = await fetchResponse.json();

                console.log('data', data);
            }catch(error){
                console.warn('Distance Request Error: ', error.message);
            }
        });
    
        if(addressType === 'pickup'){
            return createHtmlElement('div',{
                class: 'distance-information js-distance-information'},
                createHtmlElement('div',{},[
                    createHtmlElement('h3',{},'distance/mileage'),
                    distanceButton,
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
                    distanceButton,
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
    addressFieldset(addressType){
        const addressInformationComponent = createHtmlElement('fieldset',{ class: 'address-information js-address-information'},[
            createHtmlElement('p',{class:'address-informent-message'},[
                'please provide ',
                createHtmlElement('span',{class: 'address-type-output'},addressType),
                ' address information'
            ]),
            this.field('input',{ 
                type: 'text',
                id: 'OrderFormStreet', 
                name: 'street', 
                class: 'form-text-input js-personal-info',
                autocomplete: 'off',
                required: 'true' 
            },'street'
            ),
            this.field('input',{
                type: 'text',
                id: 'OrderFormCity',
                name: 'city',
                class: 'form-text-input js-personal-info',
                autocomplete: 'off',
                required: 'true' 
            },'city'),
            this.selectField({
                id:'OrderFormState',
                name: 'state',
                class: 'form-select js-personal-info',
                autocomplete: 'off',
                required: 'true'
            },'state',(addressType === 'pickup' ? listOfUsStates:[listOfUsStates[14]])),
            this.field('input',{
                type: 'text',
                id: 'OrderFormZipCode',
                name: 'zipcode',
                class: 'form-text-input js-personal-info',
                autocomplete: 'off',
                required: 'true'
            },'zipcode')
        ]);
        if(addressType === 'delivery' || addressType === 'pickup'){
            addressInformationComponent.appendChild(
                this.addressDistance(addressType)
            );
        }
        return addressInformationComponent;
    },
    pickupDistanceInformation(){
        return createHtmlElement('div', { class: 'pickup-distance-information js-pickup-distance-information'},[
            createHtmlElement('h3',{},'distance/mileage'),
            createHtmlElement('div',{}, 
                createHtmlElement('button', { 
                    type: 'button', 
                    class: 'btn add-personal-address-btn', 'data-retrieval-type':'pickup'
                },`I'd like to check my pick-up distance`,
                { type: 'click', listen: this.addAddress }
            ))
        ]);
    },
}
export const OrderForm = {
    form: undefined,
    itemSelectElement: undefined,
    itemsInput: undefined,
    retrievalSelectElement: undefined,
    paymentSelectElement: undefined,
    agreementCheckboxElement: undefined,
    personalInformationElement: undefined,
    submitButton: undefined,
    selectElements: undefined,
    tabList: undefined,
    itemList: undefined,
    invoiceItemList: undefined,
    items: [],
    tabs: [],


    itemIdFromName(itemName){
        if(!itemName){
            console.warn(`Function: "itemIdFromName" missing argument: "itemName" string.`);
            return;
        }
        return itemName.split('-').map( (part,index)=> {
            if(index === 0) return part;
            else return capitalize(part);
        }).join('');
    },
    setDate(dateString){
        if(!dateString){
            dateString = getTodaysDateString();
        }
        document.querySelector('#OrderFormDate').value = dateString;
        OrderInvoice.setDate(dateString);
    },
    hasCakes(itemId){
        const activeItems = document.querySelectorAll('.js-order-item');
        for(let i = 0; i < activeItems.length; i++){
            const item = activeItems[i];
            if(itemId && itemId === item.id) continue;
            if(item.id.includes('Cake')){
                return true;
            }
        }
        return false;
    },
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
   
    // intros
    removeTabIntro(){
        const tabIntro = document.querySelector('.js-order-item-tab-intro');
        if(this.tabList.contains(tabIntro)){
            tabIntro.remove();
        }
    },
    removeItemIntro(){
        const itemIntro = document.querySelector('.js-order-item-intro');
        if(this.itemList.contains(itemIntro)){
            transition('add-remove',itemIntro,'removing',['show','active','removing'],500,
                (element)=>element.remove());
        }
    },
    addTabIntro(){
        if(OrderForm.tabs.length > 0) return;
        const tabIntro = TabComponent.intro();
        OrderForm.tabList.appendChild(
            new DocumentFragment().appendChild(tabIntro)
        );
        transition('add',tabIntro,'open','show');
    },
    addItemIntro(){
        if(OrderForm.items.length > 0) return;
        const itemIntro = ProductComponent.intro();
        OrderForm.itemList.appendChild(
            new DocumentFragment().appendChild(itemIntro)
        );
        transition('add',itemIntro,'open','show',100);
    },

    //tabs
    deactivateTabs(){
        document.querySelectorAll('.js-order-item-tab').forEach( tab => {
            if(tab && tab.classList.contains('active')){
                tab.classList.remove('active');
            }
        })
    },
    tabToItem(clickEvent){
        clickEvent.preventDefault();
        const currentTab = clickEvent.target;
        if(!currentTab.classList.contains('active')){
            OrderForm.deactivateTabs();
            OrderForm.hideItems();
    
            if(!currentTab.dataset.tabId){
                console.warn('item id not set on tab');
                return;
            }
            const orderItem = document.querySelector(`#${currentTab.dataset.tabId}`);
            if(!orderItem){
                console.warn('order item element not found when tabbing');
                return;
            }
            transition('add',orderItem,'open',['show','active'],100);
            currentTab.classList.add('active');
        }
    },
    removeTab(tabId){
        for(let i = 0; i < OrderForm.tabs.length; i++){
            const tab = OrderForm.tabs[i];
            if(tab && tab.dataset.tabId === tabId){
                OrderForm.tabs.splice(i,1);
                break;
            }
        }
    },
    appendTab(tab,active){
        this.tabList.appendChild(
            new DocumentFragment().appendChild(tab)
        );
        const classNames = ['show'];
        if(active) classNames.push('active');
        transition('add',tab,'open',classNames,100)
    },
    deactiveTabs(){
        OrderForm.tabs.forEach( tab => {
            if(tab.classList.contains('active')){
                tab.classList.remove('active');
            }
        });
    },
    appendAndActivateTabs(itemId){
        this.deactivateTabs();
        if(OrderForm.tabs.length === 2){
            OrderForm.removeTabIntro();
            for(let i = 0; i < OrderForm.tabs.length; i++){
                const tab = OrderForm.tabs[i];
                OrderForm.appendTab(tab,false);
                if(itemId === tab.dataset.tabId){
                    OrderForm.appendTab(tab,true);
                }
            }
        }else if(OrderForm.tabs.length > 2){
            for(let i = 0; i < OrderForm.tabs.length; i++){
                const tab = OrderForm.tabs[i];
                if(itemId === tab.dataset.tabId){
                    OrderForm.appendTab(tab,true);
                    break;
                }
            }
        }
    },
    addTab(itemId,itemName,imagePath){
        const tab = TabComponent.create(itemId,itemName,imagePath);
        if(!tab){
            console.warn(`Error creating tab component - ${itemId}`);
            return;
        }
        tab.addEventListener('click', OrderForm.tabToItem,false);
        this.tabs.push(tab);
        this.appendAndActivateTabs(itemId);
        return tab;
    },
    
  
    
    // item
    removeItem(itemId){
        OrderForm.items.forEach( (item,index)=>{
            if(item && item.id === itemId){
                OrderForm.items.splice(index,1)
            }
        });
    },
    hideItems(){
        if(this.itemList.children.length <= 0) return;
        for(const index in this.itemList.children){
            const child = this.itemList.children[index];
            if(!(child instanceof Node)) continue;
            if(child.classList.contains('active')){
                transition('add-remove',child,'keeping',['open','show','active','keeping'],500);
            }
        }
    },
    addItem(itemId,itemName,itemTitle,itemPrices,itemQuantity,itemImage,itemFields,itemThemed){
        const item = ProductComponent.create(
            itemId,
            itemName,
            itemTitle,
            itemPrices,
            itemQuantity,
            itemImage,
            itemFields,
            itemThemed
        );
       
        if(!item){
            console.warn(`Error creating item: ${itemId}`);
            return;
        }
        this.itemList.appendChild(
            new DocumentFragment().appendChild(item)
        );
        this.items.push(item);
        transition('add',item,'open',['show','active'],100);
    },
    selectItem(changeEvent){
        const itemName = changeEvent.target.value;
        const itemId = OrderForm.itemIdFromName(itemName);
        const data = PRODUCT_DATA[itemId];
        
        OrderForm.removeItemIntro();
        OrderForm.hideItems();

        OrderForm.addItem(data.id,data.name,data.title,data.prices,data.image,data.fields,data.themed);

        disableSelectFieldOption(OrderForm.itemSelectElement,itemName);

        OrderForm.addTab(data.id,data.name,data.image);
        //OrderForm.activateTabs(data.id);

        OrderInvoice.addItem(data.id,data.title,data.themed,data.invoiceFields);
        OrderInvoice.addNumberOfItems();
        
        data.retrievalRestrictions.forEach( restriction => {
            disableSelectFieldOption(OrderForm.retrievalSelectElement,restriction);
        })

        // OrderProgress.listenToAreaInputs('.js-item-info',2);
        // OrderProgress.inspectAreaInputProgress('.js-item-info',2);
        // OrderProgress.setState(1);

        changeEvent.target.value = "";
    },

    // retrieval
    appendAddress(component){
        this.personalInformationElement.appendChild(
            new DocumentFragment().appendChild(component)
        );
        transition('add',component,'open','show',100);
    },
    setAddress(retrievalType){
        const possibleAddressElement = document.querySelector('.js-order-form .js-address-information') ||
            document.querySelector('.js-order-form .js-pickup-distance-information');
        if(possibleAddressElement){
            possibleAddressElement.remove();
        }
        if(retrievalType === 'delivery' || retrievalType === 'shipping'){
            this.appendAddress(
                ProductComponent.addressFieldset(retrievalType)
            );
            //OrderProgress.listenToAreaInputs('.js-personal-info',5);
        }else{
            this.appendAddress(
                ProductComponent.pickupDistanceInformation()
            );
        }
    },
    selectRetrievalType(changeEvent){
        const retrievalType = changeEvent.target.value;

        OrderForm.setAddress(retrievalType);
        
        OrderInvoice.setRetrievalType(retrievalType);

        //OrderProgress.setState(3);

        const option = [...changeEvent.target.options].find( option => option.value === retrievalType);
        const retrievalPrice = option.dataset.price;

        OrderInvoice.setRetrievalPrice(retrievalPrice);
        
        if(changeEvent.target.value === 'shipping'){
            OrderInvoice.setRetrievalPrice(`${retrievalPrice}.00`);
            OrderInvoice.setRetrievalCost(`${retrievalPrice}.00`);
            //Order.addToTotal(retrievalPrice);
        }else{
            OrderInvoice.setRetrievalPrice(`${retrievalPrice}`);
            OrderInvoice.setRetrievalCost(`00.00`);
            
            // if(document.querySelector('#OrderFormSubTotal').value !== 
            //     document.querySelector('#OrderFormTotal').value){
            //         Order.subtractFromTotal('15');
            // }
           
        }
    },
    selectPaymentType(changeEvent){
        const paymentType = changeEvent.target.value;
        OrderInvoice.setPaymentType(paymentType);

        //OrderProgress.setState(4);
    },
    selectAgreementCheckbox(){
        const progressState = OrderProgress.inspectState();
        const isChecked = changeEvent.target.checked;
        if(progressState.length > 0){
            changeEvent.target.checked = false;
            return;
        }
        if(isChecked){
            OrderForm.activeSubmitButton();
            //OrderProgress.setState(6);
        }else{
            OrderForm.deactiveSubmitButton();
            //OrderProgress.removeState(6);
        }
    },
    submit(){

    },
    listen(){
        OrderForm.itemSelectElement.addEventListener('change',OrderForm.selectItem);
        OrderForm.retrievalSelectElement.addEventListener('change', OrderForm.selectRetrievalType);
        OrderForm.paymentSelectElement.addEventListener('change', OrderForm.selectPaymentType);
        OrderForm.agreementCheckboxElement.addEventListener('change', OrderForm.selectAgreementCheckbox);
        OrderForm.form.addEventListener('submit', OrderForm.submit)
    },
    initialize(){
        try{
            // order form
            OrderForm.form = document.querySelector('#OrderForm');
            if(!OrderForm.form) throw new Error('missing element - order form');

            OrderForm.itemSelectElement = document.querySelector('#OrderFormItem');
            if(!OrderForm.itemSelectElement) throw new Error('missing element - order item select');

            OrderForm.itemsInput = document.querySelector('#OrderItemsInput');
            if(!OrderForm.itemsInput) throw new Error('missing element - order items list');

            OrderForm.retrievalSelectElement = document.querySelector('#OrderFormRetrieval');
            if(!OrderForm.retrievalSelectElement) throw new Error('missing element - order retrieval select');

            OrderForm.paymentSelectElement = document.querySelector('#OrderFormPaymentType');
            if(!OrderForm.paymentSelectElement) throw new Error('missing element - order payment select');

            OrderForm.agreementCheckboxElement = document.querySelector('#OrderFormAgreementCheckbox');
            if(! OrderForm.agreementCheckboxElement) throw new Error('missing element - order agreement checkbox');

            OrderForm.personalInformationElement = document.querySelector('.js-order-form .js-personal-information');
            if(! OrderForm.personalInformationElement) throw new Error('missing element - order personal information');

            OrderForm.submitButton = document.querySelector('.js-order-form-submit-btn');
            if(!OrderForm.submitButton) throw new Error('missing element - order submit button');

            // OrderForm.selectElements = document.querySelectorAll('.form-select');
            // if(!OrderForm.selectElements) throw new Error('missing element - order form ');

            // order tabs
            OrderForm.tabList = document.querySelector('.js-order-item-tab-list');
            if(!OrderForm.tabList) throw new Error('missing element - order item tab list');

            // order items
            this.itemList = document.querySelector('.js-order-item-list');
            if(!this.itemList) throw new Error('missing element - order item list');


            OrderForm.listen();

            OrderInvoice.initialize();

            OrderForm.setDate();

            const div = document.createElement('div');
            transition('show',div,['show','active'],'open',5000);

        }catch(error){
            console.warn(error);
        }   
    }
};

