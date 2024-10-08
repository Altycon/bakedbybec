import { AImageViewer } from "../../canopy/image_viewer.js";
import { ANotification, PageNotification } from "../../canopy/notification.js";
import { 
    ADate,
    appendElementToParentWithFragment, 
    capitalize,
    createHtmlElement, 
    disableSelectFieldOption, 
    enableSelectFieldOption,  
    formatADate, 
    getFutureDateByDays, 
    transition
} from "../../utilities.js";
import { listOfUsStates} from "./order_data.js";
import { OrderProgress } from "./order_progress.js";
import { PRODUCT_DATA } from "./product_data.js";
import { ValidateHTMLForm, validateHTMLFormAddress } from "../../form/validation.js";

function connectInputToOutput(event){
    const outputId = event.target.id;
    const outputElement = document.querySelector(`[data-output="${outputId}"]`);
    if(outputElement){
        const value = event.target.value;
        switch(outputId){
            case 'SugarCookiesQuantity':
            case 'DropCookiesQuantity':
            case 'CupCakesQuantity':
            case 'CakePopsQuantity':
                outputElement.textContent = `${value} dozen`;
                break;
            default : 
            if(outputId.includes('Date')){
                const mpday = 86400000;
                const dayLimit = mpday*13;
                const now = Date.now();
                const futureDay = now + dayLimit;
                const limitDate = new Date(futureDay);
                const limit = limitDate.getTime();
                const selectedDate = new Date(value);
                const selected = selectedDate.getTime();

                if(selected >= limit){
                    outputElement.textContent = formatADate(value,'YYYY-MM-DD','MM/DD/YYYY');
                }else{
                    PageNotification.notify('Request too early',
                        'I need at least 2 weeks to prepare your desserts. Please select a later date.',
                        'I understand'
                    );
                    event.target.value = "";
                }
            }else{
                outputElement.textContent = value;
            }
            break;
        }
    }
};
async function getCurrentLocation(){
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
    fullNameOutput: undefined,
    emailOutput: undefined,
    phoneNumberOutput: undefined,
    subTotalOutput: undefined,
    totalOutput: undefined,
    addressArea: undefined,
    itemsList: undefined,
    imageContent: undefined,
    imageList: undefined,
    hasImages: false,
    items: [],
    images: [],
    
    setDate(dateString){
        if(!dateString) return;
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
        this.retrievalCostOutput.textContent = cost;
    },
    setRetrievalDistance(distance){
        this.retrievalDistanceOutput.textContent = distance;
    },
    setPaymentType(type){
        this.paymentTypeOutput.textContent = type;
    },
    setFullName(text){
        this.fullNameOutput.textContent = text;
    },
    setEmail(text){
        this.emailOutput.textContent = text;
    },
    setPhoneNumber(num){
        this.phoneNumberOutput.textContent = `${num}`;
    },
    setSubTotal(price){
        this.subTotalOutput.textContent = price;
    },
    setTotal(price){
        this.totalOutput.textContent = price;
    },
    setItemPriceById(itemId,price){
        const output = document.querySelector(`[data-output="${itemId}Price"]`);
        if(output) output.textContent = `${price}`;
    },
    createImagesContent(imageColumn){
        const list = createHtmlElement('ul',{ class: 'images-list' });
        this.imageList = list;
        if(imageColumn){
            list.appendChild(imageColumn);
        }
        const imageContent = createHtmlElement('div', { class:'images' },[
            createHtmlElement('h3',{},'images'),
            list
        ]);
        this.imageContent = imageContent;
        return imageContent
    },
    createImageColumn(outputId,imageSource){
        return createHtmlElement('li',{ class: 'img-wrapper', 'data-connection-id':outputId },
            createHtmlElement('img', { src: imageSource })
        )
    },
    appendImagesContent(imageContentElement){
        this.content.insertBefore(
            new DocumentFragment().appendChild(
                imageContentElement
            ),
            document.querySelector('.order-invoice .content .bottom')
        );
        this.hasImages = true;
    },
    appendImageColumn(imageColumn){
        this.imageList.appendChild(
            new DocumentFragment().appendChild(
                imageColumn
            )
        );
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

        const li = createHtmlElement('li', { class: 'item', 'data-connection-id':itemId},
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
                        createHtmlElement('span',{ 'data-output':`${itemId}Price` },'00')
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
        );
        this.items.push(item) 
    },
    addImage(outputId,imageSource){
        const image = this.createImageColumn(outputId,imageSource);
        if(!this.hasImages){
            this.appendImagesContent(
                this.createImagesContent(image)
            );
            this.images.push(image);
            return;
        }
        this.appendImageColumn(image);
        this.images.push(image);
    },
    removeImage(outputId){
        if(!this.hasImages) return;
        if(this.images.length <= 1){
            this.imageContent.remove();
            this.imageContent = undefined;
            this.hasImages = false;
        }else{
            for(let i = 0; i < this.images.length; i++){
                const image = this.images[i];
                if(image.dataset.connectionId === outputId){
                    this.images.splice(i,1);
                    image.remove();
                    break;
                }
            }
        }
    },
    removeItem(itemId){
        for(let i = 0; i < this.items.length; i++){
            const item = this.items[i];
            if(item.dataset.connectionId === itemId){
                this.items.splice(i,1);
                this.removeImage(itemId);
                item.remove();
                break;
            }
        }
    },
    showAddress(){
        if(!this.addressArea.classList.contains('show')){
            transition('add',this.addressArea,'open','show');
        }
    },
    hideAddress(){
        if(this.addressArea.classList.contains('show')){
            transition('remove',this.addressArea,'show','open');
        }
    },
    initialize(){
        try{
            this.content = document.querySelector('.js-order-invoice-content');
            if(!this.content) throw new Error('missing element - invoice content');

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

            this.fullNameOutput = document.querySelector('#InvoiceFullNameOutput');
            if(!this.fullNameOutput) throw new Error('missing element - invoice full name output');

            this.emailOutput = document.querySelector('#InvoiceEmailOutput');
            if(!this.emailOutput) throw new Error('missing element - invoice email output');

            this.phoneNumberOutput = document.querySelector('#InvoicePhoneNumberOutput');
            if(!this.phoneNumberOutput) throw new Error('missing element - invoice phone number output');

            this.subTotalOutput = document.querySelector('#InvoiceSubTotalOutput');
            if(!this.subTotalOutput) throw new Error('missing element - invoice subtotal output');

            this.totalOutput = document.querySelector('#InvoiceTotalOutput');
            if(!this.totalOutput) throw new Error('missing element - invoice total output');

            this.addressArea = document.querySelector('#InvoiceAddress');
            if(!this.addressArea) throw new Error('missing element - invoice address area');
           
        }catch(error){
            console.warn(error);
        }
        
    }
};
const FormComponent = {
    calculatePriceByQuantity(changeEvent){
        const li = changeEvent.target.closest('li');
        const datalistOption = li.querySelector(`#${li.id}Prices option[value="${li.dataset.name}"]`);
        const optionPrice = datalistOption.dataset.price;
        const price = (Number(optionPrice) * Number(changeEvent.target.value)).toFixed(2);

        const costInput = document.querySelector(`#${li.id}Cost`);
        if(costInput) costInput.value = `${optionPrice}`;
        const priceInput = document.querySelector(`#${li.id}Price`)
        if(priceInput) priceInput.value = `${price}`;
        
        OrderInvoice.setItemPriceById(li.id,price);
        OrderForm.addToSubTotal(price);
        OrderForm.addToTotal(price);
    },
    calculatePriceFromQuantityWithSize(changeEvent){
        const li = changeEvent.target.closest('li');
        const sizeFieldSelect = li.querySelector(`#${li.id}Size`);
        if(!sizeFieldSelect || !sizeFieldSelect.value || sizeFieldSelect.value === '-- select --') return;

        const datalistOption = li.querySelector(`#${li.id}Prices option[value="${sizeFieldSelect.value}"]`);
        const optionPrice = datalistOption.dataset.price;
        const price = parseFloat((Number(optionPrice) * Number(changeEvent.target.value)).toFixed(2));
        
        const costInput = document.querySelector(`#${li.id}Cost`);
        if(costInput) costInput.value = `${optionPrice}`;
        const priceInput = document.querySelector(`#${li.id}Price`)
        if(priceInput) priceInput.value = `${price}`;
       
        OrderInvoice.setItemPriceById(li.id,price);
        OrderForm.addToSubTotal(price);
        OrderForm.addToTotal(price);
    },
    calculatePriceFromSizeWithQuantity(changeEvent){
        const li = changeEvent.target.closest('li');
        const quantityFieldElement = li.querySelector(`#${li.id}Quantity`);
        
        if(!quantityFieldElement || quantityFieldElement.value === '-- select --') return;
        const datalistOption = li.querySelector(`#${li.id}Prices option[value="${changeEvent.target.value}"]`)
        const optionPrice = datalistOption.dataset.price;
        const price = parseFloat((Number(optionPrice) * Number(quantityFieldElement.value)).toFixed(2));

        const costInput = document.querySelector(`#${li.id}Cost`);
        if(costInput) costInput.value = `${optionPrice}`;
        const priceInput = document.querySelector(`#${li.id}Price`)
        if(priceInput) priceInput.value = `${price}`;
        
        OrderInvoice.setItemPriceById(li.id,`${price}`);
        OrderForm.addToSubTotal(price);
        OrderForm.addToTotal(price);
    },
    selectField(attributes,textContent,options){
        const select = createHtmlElement('select',attributes,
            createHtmlElement('option',{selected: 'true', disabled: 'true', value: ''},'-- select --'),
            { type: 'change', listen: connectInputToOutput }
        );
        if(attributes.id.includes('SugarCookiesQuantity') ||
            attributes.id.includes('DropCookiesQuantity') ||
            attributes.id.includes('CakePopsQuantity')){
            select.addEventListener('change', this.calculatePriceByQuantity);
        }else if(attributes.id.includes('Quantity')){
            select.addEventListener('change', this.calculatePriceFromQuantityWithSize);
        }else if(attributes.id.includes('Size')){
            select.addEventListener('change', this.calculatePriceFromSizeWithQuantity);
        }

        options.forEach( selectOption =>{
            select.appendChild(createHtmlElement('option',{
                value: selectOption.value
            }, `${selectOption.textContent ? selectOption.textContent:selectOption.value}`))
        });
        return createHtmlElement('div', { class: 'field' },[
            createHtmlElement('label',{ for: attributes.id, class: 'form-label' },textContent),
            select,
            createHtmlElement('div', { class: 'field-output' },`* required`)
        ])
    },
    field(tagName,attributes,textContent){
        return createHtmlElement('div', { class: 'field' },[
            createHtmlElement('label', { for: attributes.id, class: 'form-label'},textContent),
            createHtmlElement(tagName, attributes, null, 
                { type: 'input', listen: connectInputToOutput }
            ),
            createHtmlElement('div', { class: 'field-output' },`* required`)
        ]);
    },
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
};
const ProductComponent ={
    remove: undefined,
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


        // I need to change all of this and remove
        appendElementToParentWithFragment(
            inspirationElement,
            inspirationContentComponent
        );
        transition('add',inspirationContentComponent,'open','show');

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

        OrderInvoice.removeImage(clickEvent.target.dataset.imageId);

        OrderProgress.removeState(2);
        OrderProgress.inspectAreaInputProgress('.js-item-info',2);
    },
    // components
    priceDisplay(prices){
        if(prices.length === 1){
            return createHtmlElement('div',{ class: 'order-item-price-display'},[
                createHtmlElement('h4',{},'price'),
                createHtmlElement('p',{},[
                    createHtmlElement('span',{ class:'pink-text' }, `$${prices[0].value}`),
                    createHtmlElement('span',{}, `${prices[0].units || 'each'}`)
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
            FormComponent.selectField({
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
                FormComponent.selectField({
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
       
        const filenameOutput = createHtmlElement('div',{ class: `filename-output ${name}-filename-output`},'-- no file selected');
        const imageOutput = createHtmlElement('img', { src: "", class: `inspiration-img-output viewable`});
        const fileUploadInput = createHtmlElement('input', { 
            type: 'file', 
            id: `${id}ImageUploadInput`, 
            name: `${name}-image`,
            accept: 'image/png, image/jpeg',
            class: 'file-upload-input js-item-info'
        });
    
        const browseBtn = createHtmlElement('button', { type: 'button', class: 'btn browse-file-btn'}, 'browse files');
        browseBtn.addEventListener('click', (clickEvent)=> {
            clickEvent.preventDefault();

            fileUploadInput.addEventListener('input', function uploadFile(inputEvent){
                const file = inputEvent.target.files[0];
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                if(file){
                    if(!allowedTypes.includes(file.type)){
                        PageNotification.notify('invalid file type','please upload a JPEG, JPG, PNG, GIF, or WEBP','i understand X')
                        fileUploadInput.removeEventListener('input',uploadFile);
                        return;
                    }
                }
                filenameOutput.textContent = file.name;
                filenameOutput.setAttribute('title',file.name);
    
                const fileReader = new FileReader();
                fileReader.onload = function(){
                    imageOutput.src = fileReader.result;
                    imageOutput.parentElement.classList.add('show');

                    AImageViewer.addImage(imageOutput);

                    OrderInvoice.addImage(id,fileReader.result);
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
    inspirationSelect(id){
        return createHtmlElement('div',{ class: 'inspiration js-inspiration'},
            createHtmlElement('div',{ class: 'inspiration-controls' },[
                createHtmlElement('button', { type: 'button', class: 'btn add-inspiration-btn show' },[
                    `+ image`,
                    createHtmlElement('img', { src: `img/icon/site/bbb_icon_image_64x64.png`, width: '16'})
                ], { type: 'click', listen: this.addInspiration }),
                createHtmlElement('h3',{},'inspiration image'),
                createHtmlElement('button', { 
                    type: 'button', 
                    class: `btn remove-inspiration-btn`,
                    'data-image-id':id
                    },
                    `remove X`,
                    { type: 'click', listen: this.removeInspiration }
                ),
            ])
        );
    },
    themeFieldset(id,name){
        return createHtmlElement('fieldset',{ class: 'theme'},[
            FormComponent.field('input',{
                id: `${id}Theme`,
                name: `${name}-theme`,
                class:`form-text-input js-item-info`,
                placeholder: 'birthday, wedding, personal, etc.',
                list: 'ItemThemes',
                required:'true',
                autocomplete:'off'
            }, 'theme/occasion'),
            FormComponent.field('textarea',{
                id: `${id}Personalization`, 
                name: `${name}-personalization`,
                class:`form-textarea js-item-info`,
                placeholder: 'names, words, colors, style, etc.',
                rows: '3',
                required:'true',
                autocomplete:'off',
            },'personalization'),
            this.inspirationSelect(id) 
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
    create(pid,itemId,itemName,itemTitle,itemPrices,itemImage,itemFields,itemThemed){
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
                id: `${itemId}PID`,
                name: `${itemName}-pid`,
                value: `${pid}`,
                autocomplete: 'off',
                hidden: 'true'
            }),
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
    initialize(removeHandler){
        if(removeHandler){
            this.remove = removeHandler
        }
    }
}
const AddressComponent = {
    fetchDistanceForPickup: undefined,
    fetchDistanceForDelivery: undefined,
    
    distanceButton(addressType){
        const textContent = (addressType === 'pickup' ? 'get approx distance':'check delivery availability')
        const distanceButton = createHtmlElement('button',{
            type: 'button',
            class:'btn check-distance-btn js-check-distance-btn',
        },textContent);
        if(addressType === 'pickup'){
            distanceButton.addEventListener('click', this.fetchDistanceForPickup);
        }else if(addressType === 'delivery'){
            distanceButton.addEventListener('click', this.fetchDistanceForDelivery);
        }
        return distanceButton;
    },
    addressDistance(addressType){
        if(addressType === 'pickup'){
            return createHtmlElement('div',{
                class: 'distance-information js-distance-information'},[
                createHtmlElement('header',{},[
                    createHtmlElement('h3',{},'distance/mileage'),
                    this.distanceButton(addressType)
                ]),
                createHtmlElement('div', { class: 'distance-output' },[
                    createHtmlElement('div', { class: 'distance-output-response' },[
                        createHtmlElement('p', { id: 'DistanceResponseOutput' },'all measurements are approximate'),
                        createHtmlElement('div',{ class: 'distance-loader js-distance-loader'},[
                            createHtmlElement('div', { class: 'animator' },[
                                createHtmlElement('span',{ style: '--i: 1;'}),
                                createHtmlElement('span',{ style: '--i: 2;'}),
                                createHtmlElement('span',{ style: '--i: 3;'}),
                                createHtmlElement('span',{ style: '--i: 4;'}),
                                createHtmlElement('span',{ style: '--i: 5;'})
                            ])
                        ])
                    ]),
                    createHtmlElement('div', { class: 'distance-output-data' },[
                        createHtmlElement('p',{},[
                            'approx: distance: ',
                            createHtmlElement('span',{ id:'PickupDistance'},'00.00 miles')
                        ]),
                        createHtmlElement('p',{},[
                            'approx: time: ',
                            createHtmlElement('span',{ id:'PickupTime'},'00h 00m')
                        ]),
                        createHtmlElement('input', { 
                            type: 'text',
                            id: 'PickupDistanceInput',
                            name: 'pickup-distance',
                            autocomplete: 'off',
                            hidden: 'true'
                        }),
                        createHtmlElement('input', { 
                            type: 'text',
                            id: 'PickupTimeInput',
                            name: 'pickup-time',
                            autocomplete: 'off',
                            hidden: 'true'
                        })
                    ])
                ])
            ]);
        }else if(addressType === 'delivery'){
            return createHtmlElement('div',{
                class: 'distance-information js-distance-information'},[
                createHtmlElement('header',{},[
                    createHtmlElement('h3',{},'distance/mileage'),
                    this.distanceButton(addressType),
                ]),
                createHtmlElement('div', { class: 'distance-output' },[
                    createHtmlElement('div', { class: 'distance-output-response' },[
                        createHtmlElement('p', { id: 'DistanceResponseOutput' },'distance will be retrieved from google'),
                        createHtmlElement('div',{ class: 'distance-loader js-distance-loader'},[
                            createHtmlElement('div', { class: 'animator' },[
                                createHtmlElement('span',{ style: '--i: 1;'}),
                                createHtmlElement('span',{ style: '--i: 2;'}),
                                createHtmlElement('span',{ style: '--i: 3;'}),
                                createHtmlElement('span',{ style: '--i: 4;'}),
                                createHtmlElement('span',{ style: '--i: 5;'})
                            ])
                        ])
                    ]),
                    createHtmlElement('div', { class: 'distance-output-data' },[
                        createHtmlElement('p',{},[
                            'availability: ',
                            createHtmlElement('span',{ id:'DeliveryAvailability'},'none')
                        ]),
                        createHtmlElement('p',{},[
                            'approx. distance: ',
                            createHtmlElement('span',{ id:'DeliveryDistance' },'00.00')
                        ]),
                        createHtmlElement('p',{},[
                            'approx. time: ',
                            createHtmlElement('span',{ id:'DeliveryTime' },'00h 00m')
                        ]),
                        createHtmlElement('p',{},[
                            'approx. price($): ',
                            createHtmlElement('span',{ id:'DeliveryPrice' },'00.00')
                        ]),
                        createHtmlElement('input', { 
                            type: 'text',
                            id: 'DeliveryAvailabilityInput',
                            name: 'delivery-availability',
                            autocomplete: 'off',
                            hidden: 'true'
                        }),
                        createHtmlElement('input', { 
                            type: 'text',
                            id: 'DeliveryDistanceInput',
                            name: 'delivery-distance',
                            autocomplete: 'off',
                            hidden: 'true'
                        }),
                        createHtmlElement('input', { 
                            type: 'text',
                            id: 'DeliveryTimeInput',
                            name: 'delivery-time',
                            autocomplete: 'off',
                            hidden: 'true'
                        }),
                        
                        createHtmlElement('input', { 
                            type: 'text',
                            id: 'DeliveryPriceInput',
                            name: 'delivery-price',
                            autocomplete: 'off',
                            hidden: 'true'
                        })
                    ]),
                ])
            ]);
        }
    },
    addressFieldset(addressType){
        const addressInformationComponent = createHtmlElement('fieldset',{ class: 'address-information js-address-information'},[
            createHtmlElement('p',{class:'address-informent-message'},[
                'please provide ',
                createHtmlElement('span',{class: 'address-type-output'},addressType),
                ' address information'
            ]),
            FormComponent.field('input',{ 
                type: 'text',
                id: 'OrderFormStreet', 
                name: 'street', 
                class: 'form-text-input js-personal-info',
                minLength: '3',
                maxLength: '50',
                title: 'must be more than 3 characters',
                placeholder: '137 72nd St',
                autocomplete: 'off',
                required: 'true' 
            },'street'
            ),
            FormComponent.field('input',{
                type: 'text',
                id: 'OrderFormCity',
                name: 'city',
                class: 'form-text-input js-personal-info',
                minLength: '2',
                maxLength: '30',
                title: 'must be more than 3 characters',
                placeholder: 'Camelot',
                autocomplete: 'off',
                required: 'true' 
            },'city'),
            FormComponent.selectField({
                id:'OrderFormState',
                name: 'state',
                class: 'form-select js-personal-info',
                autocomplete: 'off',
                required: 'true'
            },'state',(addressType === 'pickup' ? listOfUsStates:[listOfUsStates[14]])),
            FormComponent.field('input',{
                type: 'text',
                id: 'OrderFormZipCode',
                name: 'zipcode',
                class: 'form-text-input js-personal-info',
                inputmode: 'decimal',
                pattern: "[0-9]{5}(-[0-9]{4})?",
                title: 'please enter correct zipcode format 12345',
                placeholder: '12345',
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
    addAddress(clickEvent){
        const buttonParent = clickEvent.target.closest('.js-pickup-distance-information');
        const retrievalType = clickEvent.target.dataset.retrievalType;
        const personalInformationElement = document.querySelector('.js-order-form .js-personal-information');
        const addressComponent = AddressComponent.addressFieldset(retrievalType);
        buttonParent.remove();
        appendElementToParentWithFragment(
            personalInformationElement,
            addressComponent
        );
        transition('add',addressComponent,'open','show');

        OrderInvoice.showAddress();

        OrderProgress.removeState(5);
        OrderProgress.listenToAreaInputs('.js-personal-info',5);
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
    initialize(fetchDistanceForPickup,fetchDistanceForDelivery){
        if(!fetchDistanceForPickup || !fetchDistanceForDelivery){
            console.warn('missing handlers - address component missing one or all handlers')
            return;
        }
        this.fetchDistanceForPickup = fetchDistanceForPickup;
        this.fetchDistanceForDelivery = fetchDistanceForDelivery;
    }
}
export const OrderForm = {
    maxImageSize: 5242880, // (5 * 1024 * 1024) 5MB
    form: undefined,
    dateInput: undefined,
    itemSelect: undefined,
    itemsInput: undefined,
    retrievalSelect: undefined,
    paymentSelect: undefined,
    fullNameInput: undefined,
    emailInput: undefined,
    phoneNumberInput: undefined,
    agreementCheckbox: undefined,
    personalInformationElement: undefined,
    retrievalPriceInformationItems: undefined,
    totalInput: undefined,
    subTotalInput: undefined,
    submitButton: undefined,
    tabList: undefined,
    itemList: undefined,
    items: [],
    tabs: [],

    createItemUID(pid){
        
    },
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
    setDate(){
        const dateString = ADate();
        const formatedDate = formatADate(dateString,'YYYY-MM-DD','MM/DD/YYYY');
        OrderForm.dateInput.value = dateString;
        OrderInvoice.setDate(formatedDate);
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
    setRetrievalInformationAvailability(retrievalType,available=true){
        
        const retrievalPriceInfo = this.retrievalPriceInformationItems.find( priceItem => priceItem.dataset.retrievalId === retrievalType);
        if(available){
            if(retrievalPriceInfo.classList.contains('unavailable')){
                retrievalPriceInfo.classList.remove('unavailable');
            }
        }else{
            if(!retrievalPriceInfo.classList.contains('unavailable')){
                retrievalPriceInfo.classList.add('unavailable');
            }
        }
    },
    activateSubmitButton(){
        if(!OrderForm.submitButton.classList.contains('active')){
            OrderForm.submitButton.classList.add('active');
        }
    },
    deactivateSubmitButton(){
        if(OrderForm.submitButton.classList.contains('active')){
            OrderForm.submitButton.classList.remove('active');
        }
    },
    addToSubTotal(price){
        const subtotal = (Number(this.subTotalInput.value) + Number(price)).toFixed(2);
        this.subTotalInput.value = `${subtotal}`;
        OrderInvoice.setSubTotal(`${subtotal}`);
    },
    addToTotal(price){
        const total = (Number(this.totalInput.value) + Number(price)).toFixed(2);
        this.totalInput.value = `${total}`;
        OrderInvoice.setTotal(`${total}`);
    },
    subtractFromSubTotal(price){
        if(this.subTotalInput.value === '0') return;

        const subtotal = Number(this.subTotalInput.value) - Number(price);
        this.subTotalInput.value = `${subtotal}`;

        OrderInvoice.setSubTotal(`${subtotal}.00`);
    },
    subtractFromTotal(price){
        if(this.totalInput.value === '0') return;
        if(Number(this.totalInput.value) < Number(price)) return;

        const total = Number(this.totalInput.value) - Number(price);
        this.totalInput.value = `${total}`;

        OrderInvoice.setTotal(`${total}.00`);
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
        for(let i = 0; i < this.tabs.length; i++){
            const tab = this.tabs[i];
            const nextTab = this.tabs[i+1] || this.tabs[i-1];
            if(tab && tab.dataset.tabId === tabId){
                if(nextTab){
                    transition('add',nextTab,'active');
                }
                this.tabs.splice(i,1);
                tab.remove();
                return nextTab;
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
    addToItemInput(itemName){
        if(this.itemsInput.value === ''){
            this.itemsInput.value = itemName;
        }else{
            this.itemsInput.value = `${this.itemsInput.value},${itemName}`;
        }
    },
    removeItem(clickEvent){
        clickEvent.preventDefault();
        const itemElement = clickEvent.target.closest('li');
        if(!itemElement){
            console.warn(`order item element does not exist to remove`);
            return;
        }
        const itemId = itemElement.id;
        const itemPrice = itemElement.querySelector(`#${itemId}Price`).value;

        for(let i = 0; i < OrderForm.items.length; i++){
            const item = OrderForm.items[i];
            if(item.id === itemId){
                const nextTab = OrderForm.removeTab(itemId);
                if(nextTab){
                    const itemToActive = OrderForm.items.find( element => element.id === nextTab.dataset.tabId);
                    if(itemToActive) transition('add',itemToActive,'open',['show','active']);
                }
                OrderForm.subtractFromSubTotal(itemPrice);
                OrderForm.subtractFromTotal(itemPrice);
                OrderForm.items.splice(i,1);
                item.remove();
                break;
            }
        }
        enableSelectFieldOption(OrderForm.itemSelect,itemElement.dataset.name);
        OrderForm.itemSelect.value = "";

        OrderInvoice.removeItem(itemId);
        OrderInvoice.subtractNumberOfItems();

        const tabIntro = document.querySelector('.js-order-item-tab-intro');

        if(OrderForm.items.length === 0){
            if(!tabIntro) OrderForm.addTabIntro(); 
            OrderForm.addItemIntro();
        }
        if(OrderForm.hasCakes(itemId)){
            disableSelectFieldOption(OrderForm.retrievalSelect,'shipping');
            OrderForm.setRetrievalInformationAvailability('shipping',false);
        }else{
            enableSelectFieldOption(OrderForm.retrievalSelect,'shipping');
            OrderForm.setRetrievalInformationAvailability('shipping',true);
        }
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
    addItem(pid,itemId,itemName,itemTitle,itemPrices,itemImage,itemFields,itemThemed){
        const item = ProductComponent.create(
            pid,
            itemId,
            itemName,
            itemTitle,
            itemPrices,
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
        OrderForm.addToItemInput(itemName);
        transition('add',item,'open',['show','active'],100);
    },
    selectItem(changeEvent){
        
        const itemName = changeEvent.target.value;
        const itemId = OrderForm.itemIdFromName(itemName);
        const data = PRODUCT_DATA[itemId];
        
        OrderForm.removeItemIntro();
        OrderForm.hideItems();

        OrderForm.addItem(
            data.pid,
            data.id,
            data.name,
            data.title,
            data.prices,
            data.image,
            data.fields,
            data.themed
        );

        disableSelectFieldOption(OrderForm.itemSelect,itemName);

        OrderForm.addTab(data.id,data.name,data.image);

        OrderInvoice.addItem(data.id,data.title,data.themed,data.invoiceFields);
        OrderInvoice.addNumberOfItems();
        
        data.retrievalRestrictions.forEach( restriction => {
            disableSelectFieldOption(OrderForm.retrievalSelect,restriction);
            OrderForm.setRetrievalInformationAvailability(restriction,false);
        })

        OrderProgress.listenToAreaInputs('.js-item-info',2);
        OrderProgress.inspectAreaInputProgress('.js-item-info',2);
        OrderProgress.setState(1);

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
                AddressComponent.addressFieldset(retrievalType)
            );
            OrderInvoice.showAddress();
            OrderProgress.listenToAreaInputs('.js-personal-info',5);
        }else{
            this.appendAddress(
                AddressComponent.pickupDistanceInformation()
            );
            OrderInvoice.hideAddress();
        }
    },
    selectRetrievalType(changeEvent){
        const retrievalType = changeEvent.target.value;
        const currentState = changeEvent.target.dataset.state;

        OrderForm.setAddress(retrievalType);
        OrderInvoice.setRetrievalType(retrievalType);

        OrderProgress.setState(3);

        const option = [...changeEvent.target.options].find( option => option.value === retrievalType);
        const retrievalPrice = option.dataset.price;

        OrderInvoice.setRetrievalPrice(retrievalPrice);
        
        if(changeEvent.target.value === 'shipping'){
            OrderInvoice.setRetrievalPrice(`${retrievalPrice}.00`);
            OrderInvoice.setRetrievalCost(`${retrievalPrice}.00`);
            OrderForm.addToTotal(retrievalPrice);
        }else{
            OrderInvoice.setRetrievalPrice(`${retrievalPrice}`);
            OrderInvoice.setRetrievalCost(`00.00`);
            
            if(currentState === 'delivery' || currentState === 'shipping'){
                const total = +document.querySelector('#OrderFormTotal').value;
                const subtotal = +document.querySelector('#OrderFormSubTotal').value;
                const difference = total - subtotal;
                if(total !== subtotal && difference > 0 && difference < subtotal){
                    OrderForm.subtractFromTotal(difference);
                }
            }
        }
        changeEvent.target.dataset.state = retrievalType;
    },
    selectPaymentType(changeEvent){
        const paymentType = changeEvent.target.value;
        OrderInvoice.setPaymentType(paymentType);
        OrderProgress.setState(4);
    },
    selectAgreementCheckbox(changeEvent){
        const progressState = OrderProgress.inspectState();
        const isChecked = changeEvent.target.checked;
        if(progressState.length > 0){
            changeEvent.target.checked = false;
            ANotification.notify('please fill out all empty fields before you order');

            const inputs = [...document.querySelectorAll('#OrderForm [name]')];
            const emptyInputs = inputs.filter( input => (input.value === "" || input.value === '-- select --'));
            emptyInputs.forEach( input => {
                if(!input.hidden){
                    const item = input.closest('li.order-item');
                    if(item && !item.classList.contains('active')){
                        const tab = OrderForm.tabs.find( tab => tab.dataset.tabId === item.id);
                        if(tab){
                            tab.addEventListener('click', function removeEmptyFieldAnimation(){
                                tab.classList.remove('empty-field');
                                tab.removeEventListener('click', removeEmptyFieldAnimation);
                            })
                            tab.classList.add('empty-field');
                        };
                    }
                    const field = input.closest('.field');
                    field.classList.add('required');
                    input.addEventListener('focus', function removeOutline(){
                        field.classList.remove('required');
                        input.removeEventListener('focus', removeOutline);
                    })
                }
            })

            return;
        }
        if(isChecked){
            OrderForm.activateSubmitButton();
            OrderProgress.setState(6);
            ANotification.notify('Place your order!')
        }else{
            OrderForm.deactivateSubmitButton();
            OrderProgress.removeState(6);
        }
    },


    setDistanceLoader(){
        const loader = document.querySelector('.order-form .distance-loader');
        if(loader && !loader.classList.contains('loading')){
            loader.classList.add('loading');
        }
    },
    removeDistanceLoader(){
        const loader = document.querySelector('.order-form .distance-loader');
        if(loader && loader.classList.contains('loading')){
            loader.classList.remove('loading');
        }
    },
    getAddressData(){
        const formData = new FormData(OrderForm.form);
        const street = formData.get('street');
        const city = formData.get('city');
        const state = formData.get('state');
        const zipCode = formData.get('zipcode');
        if(!street || !city || !state || !zipCode){
            return null;
        }
        return { street,city,state,zipCode };
    },
    setPickupDistanceAndTimeInputsAndDisplay(distance,time){
        const pickupDistanceInput = document.querySelector('#PickupDistanceInput');
        pickupDistanceInput.value = distance;
        const pickupTimeInput = document.querySelector('#PickupTimeInput');
        pickupTimeInput.value = time;

        const pickupDistanceOutput = document.querySelector('#PickupDistance');
        pickupDistanceOutput.textContent = distance;
        const pickupTimeOutput = document.querySelector('#PickupTime');
        pickupTimeOutput.textContent = time;
    },
    setDeliveryAvailabilityInputsAndDisplay(availability,distance,time,price){
        const deliveryAvailabilityInput = document.querySelector('#DeliveryAvailabilityInput');
        deliveryAvailabilityInput.value = availability ? 'available':'not available';
        const deliveryDistanceInput = document.querySelector('#DeliveryDistanceInput');
        deliveryDistanceInput.value = distance;
        const deliveryTimeInput = document.querySelector('#DeliveryTimeInput');
        deliveryTimeInput.value = time;
        const deliveryPriceInput = document.querySelector('#DeliveryPriceInput');
        deliveryPriceInput.value = price;

        const deliveryAvailabilityOutput = document.querySelector('#DeliveryAvailability');
        deliveryAvailabilityOutput.textContent = availability;
        const deliveryDistanceOutput = document.querySelector('#DeliveryDistance');
        deliveryDistanceOutput.textContent = distance;
        const deliveryTimeOutput = document.querySelector('#DeliveryTime');
        deliveryTimeOutput.textContent = time;
        const deliveryPriceOutput = document.querySelector('#DeliveryPrice');
        deliveryPriceOutput.textContent = price;

        const retrievalDistanceOutput = document.querySelector('#InvoiceRetrievalDistanceOutput');
        retrievalDistanceOutput.textContent = distance;

        OrderInvoice.setRetrievalCost(price);
        OrderForm.addToTotal(price);
    },
    handleFetchResposeErrors(errors){
        if(Array.isArray(errors)){
            errors.forEach( error => {
                if(error.type === 'field'){
                    ANotification.notify(error.msg);
                }else{
                    ANotification.notify(error.message);
                }
            })
        }else{
            ANotification.notify(errors);
        }
    },
    fakeRequest(type){
        ANotification.notify('This is only a test.')
        OrderForm.setDistanceLoader();
        if(type === 'pickup'){
            setTimeout( ()=> {
                OrderForm.setPickupDistanceAndTimeInputsAndDisplay(`11`,`1h 11m`);
                OrderForm.removeDistanceLoader();
            },3000)
        }else if(type === 'delivery'){
            setTimeout( ()=> {
                OrderForm.setDeliveryAvailabilityInputsAndDisplay('available','23','4h 11m','6.53');
                OrderForm.removeDistanceLoader();
            },3000)
        }else{
            ANotification.notify('request error');
            OrderForm.removeDistanceLoader();
        }
    },
    async requestPickupDistance(clickEvent){
        clickEvent.preventDefault();
        OrderForm.fakeRequest('pickup');

        // const fieldNames = ['street','city','state','zipcode'];
        // OrderForm.setDistanceLoader();

        // try{
        //     const [error,data] = validateHTMLFormAddress(OrderForm.form,fieldNames);
        //     if(error) throw new Error(`VALIDATION_ERROR: ${error.message}`);

        //     const destination = `${data.get('street')},${data.get('city')},${data.get('state')},${data.get('zipcode')}`;
        //     const distanceRequestUrl = new URL(`/api/distance/:destination=${destination}`,'http://127.0.0.1:3456');
            
        //     const fetchResponse = await fetch(distanceRequestUrl);

        //     if(fetchResponse.ok){

        //         const successData = await fetchResponse.json();

        //         const { distance, duration } = successData;
        //         OrderForm.setPickupDistanceAndTimeInputsAndDisplay(distance,duration);

        //         ANotification.notify('success!!');

        //         OrderForm.removeDistanceLoader();
        //     }else{
        //         const errorData = await fetchResponse.json();
           
        //         OrderForm.handleFetchResposeErrors(errorData.errors);

        //         OrderForm.removeDistanceLoader();
        //     }
        // }catch(error){
        //     OrderForm.removeDistanceLoader();
        //     console.error('Pickup Distance Request Error: ', error.message);
        //     PageNotification.notify('request failed.',
        //         error.message,
        //         'please close X'
        //     );
        // }
    },
    async requestDeliveryAvailabilityCheck(){
        OrderForm.fakeRequest('delivery');

        // const fieldNames = ['street','city','state','zipcode'];
        // OrderForm.setDistanceLoader();

        // try{
        //     const [error,data] = validateHTMLFormAddress(OrderForm.form,fieldNames);
        //     if(error) throw new Error(`VALIDATION_ERROR: ${error.message}`);

        //     const destination = `${data.get('street')},${data.get('city')},${data.get('state')},${data.get('zipcode')}`;
        //     const distanceRequestUrl = new URL(`/api/delivery/:destination=${destination}`,'http://127.0.0.1:3456');
            
        //     const fetchResponse = await fetch(distanceRequestUrl);

        //     if(fetchResponse.ok){

        //         const successData = await fetchResponse.json();

        //         const { availability, distance, duration, price } = successData;
        //         OrderForm.setDeliveryAvailabilityInputsAndDisplay(availability, distance, duration, price);

        //         ANotification.notify('success!!');

        //         OrderForm.removeDistanceLoader();
        //     }else{
        //         const errorData = await fetchResponse.json();
           
        //         OrderForm.handleFetchResposeErrors(errorData.errors);

        //         OrderForm.removeDistanceLoader();
        //     }
        // }catch(error){
        //     OrderForm.removeDistanceLoader();
        //     console.error('Pickup Distance Request Error: ', error.message);
        //     PageNotification.notify('request failed.',
        //         error.message,
        //         'please close X'
        //     );
        // }
    },
    redirectToSuccessPageWithFormData(redirectPath){
        
        const formData = new FormData(OrderForm.form);
        const data = {
            success: 'true',
            name: formData.get('name'),
            items: formData.get('items')
        }
        const params = new URLSearchParams(data).toString();
        const fakeLocation = `https://altycon.github.io/bakedbybec/pages/order_response.html?${params}`;
        
        redirectPath = redirectPath || fakeLocation;
        window.location.href = redirectPath;
    },
    fakeSubmit(clickEvent){
        clickEvent.preventDefault();

        const pageLoader = document.querySelector('#PageLoader');
        transition('add',pageLoader,'open',['show','loading']);

        const [error] = ValidateHTMLForm(OrderForm.form);
        if(error){
            setTimeout( ()=> {
                transition('remove',pageLoader,['show','loading'],'open',100, ()=>{
                    PageNotification.notify('This is just a test.',
                        error.message,
                        'please close X'
                    );
                });
            },3000);
        }else{
            setTimeout( ()=> {
                transition('remove',pageLoader,['show','loading'],'open',100, ()=>{
                    PageNotification.notify('This is just a test.',
                        'Thank you for testing with Baked by Bec.',
                        'please close X',
                        ()=> OrderForm.redirectToSuccessPageWithFormData()
                    );
                });
            },3000);
        }
    },
    async submit(clickEvent){
        clickEvent.preventDefault();

        const pageLoader = document.querySelector('#PageLoader');
        transition('add',pageLoader,'open',['show','loading']);
        
        try{
            const [error,data] = ValidateHTMLForm(OrderForm.form);
            if(error) throw new Error(`VALIDATION_ERROR: ${error.message}`);

            const orderFetchURL = new URL('/order','http://127.0.0.1:3456');
            const fetchResponse = await fetch(orderFetchURL,{ method:'post', body:data });

            if(fetchResponse.ok){
                
                const successData = await fetchResponse.json();

                transition('remove',pageLoader,['show','loading'],'open',100, ()=>{
                    PageNotification.notify('order success!!',
                        'You have successfully placed and order. A confirmation email has been sent with your order. I will reply to you soon!',
                        'please close X',
                        ()=> window.location.href = successData.redirect
                    );
                });

            }else{
                const errorData = await fetchResponse.json();
            
                OrderForm.handleFetchResposeErrors(errorData.errors);

                transition('remove',pageLoader,'show',['open','loading']);
                PageNotification.notify('order failed.',
                    'Order failed to process. Please try again',
                    'please close X'
                );
            }

        }catch(error){
            transition('remove',pageLoader,'show',['open','loading']);
            PageNotification.notify('order failed.',
                error.message,
                'please close X'
            );
        }
    },
    
    listen(){
        this.itemSelect.addEventListener('change',this.selectItem);
        this.retrievalSelect.addEventListener('change', this.selectRetrievalType);
        this.paymentSelect.addEventListener('change', this.selectPaymentType);
        this.fullNameInput.addEventListener('input', (inputEvent)=>{
            OrderInvoice.setFullName(inputEvent.target.value);
        });
        this.emailInput.addEventListener('input', (inputEvent)=>{
            OrderInvoice.setEmail(inputEvent.target.value);
        });
        this.phoneNumberInput.addEventListener('input', (inputEvent)=>{
            OrderInvoice.setPhoneNumber(inputEvent.target.value);
        });
        this.agreementCheckbox.addEventListener('change', this.selectAgreementCheckbox);
        this.submitButton.addEventListener('click', this.fakeSubmit);
    },
    initialize(initialItemName){
        try{
            this.form = document.querySelector('#OrderForm');
            if(!this.form) throw new Error('missing element - order form');

            this.itemSelect = document.querySelector('#OrderFormItem');
            if(!this.itemSelect) throw new Error('missing element - order item select');

            this.retrievalSelect = document.querySelector('#OrderFormRetrieval');
            if(!this.retrievalSelect) throw new Error('missing element - order retrieval select');

            this.paymentSelect = document.querySelector('#OrderFormPaymentType');
            if(!this.paymentSelect) throw new Error('missing element - order payment select');
            
            this.fullNameInput = document.querySelector('#OrderFormFullNameInput');
            if(!this.fullNameInput) throw new Error('missing element - order full name input');

            this.emailInput = document.querySelector('#OrderFormEmailInput');
            if(!this.emailInput) throw new Error('missing element - order email input');

            this.phoneNumberInput = document.querySelector('#OrderFormPhoneNumberInput');
            if(!this.phoneNumberInput) throw new Error('missing element - order phone number input');

            this.agreementCheckbox = document.querySelector('#OrderFormAgreementCheckbox');
            if(! this.agreementCheckbox) throw new Error('missing element - order agreement checkbox');

            this.dateInput = document.querySelector('#OrderFormDate');
            if(!this.dateInput) throw new Error('missing element - order date input');

            this.itemsInput = document.querySelector('#OrderItemsInput');
            if(!this.itemsInput) throw new Error('missing element - order items list');

            this.totalInput = document.querySelector('#OrderFormTotal');
            if(!this.totalInput) throw new Error('missing element - order total input');

            this.subTotalInput = document.querySelector('#OrderFormSubTotal');
            if(!this.subTotalInput) throw new Error('missing element - order subtotal input');

            this.personalInformationElement = document.querySelector('.js-order-form .js-personal-information');
            if(!this.personalInformationElement) throw new Error('missing element - order personal information');

            this.retrievalPriceInformationItems = [...document.querySelectorAll('[data-retrieval-id]')];
            if(this.retrievalPriceInformationItems.length < 3) throw new Error('missing element(s) - order retrieval information price item(s)');

            this.submitButton = document.querySelector('.js-order-form-submit-btn');
            if(!this.submitButton) throw new Error('missing element - order submit button');

            this.tabList = document.querySelector('.js-order-item-tab-list');
            if(!this.tabList) throw new Error('missing element - order item tab list');

            this.itemList = document.querySelector('.js-order-item-list');
            if(!this.itemList) throw new Error('missing element - order item list');

            ProductComponent.initialize(this.removeItem);
            AddressComponent.initialize(
                this.requestPickupDistance,
                this.requestDeliveryAvailabilityCheck
            );
            OrderInvoice.initialize();

            this.listen();
            this.setDate();

        }catch(error){
            console.warn(error);
            throw error;
        }
        
        if(initialItemName){
            this.itemSelect.querySelectorAll('option').forEach( option =>{
                if(initialItemName && initialItemName === option.value){
                    option.setAttribute('selected','true');
                }
            });
            this.itemSelect.dispatchEvent(new Event('change'));
        }
    }
};

