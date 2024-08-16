class OrderFieldData{
    constructor(name,title,options){
        this.name = name;
        this.title = title;
        this.options = [];
        options.forEach( option => {
            const [ value, content ] = option.split(',');
            if(!content){
                this.options.push({ value: value, content: value });
            }else{
                this.options.push({ value: value, content: content });
            }
           
        });
    }
};

const cakeFlavors = ['vanilla','chocolate','lemon','red velvet','strawberry','carrot'];
const cakeFrostings = ['vanilla','chocolate','lemon','strawberry','cream cheese'];

export const OrderItemData ={
    invoiceFields:{
        sugarCookies: ['quantity','date needed'],
        dropCookies: ['quantity', 'flavor','baking chips','date needed'],
        layerCake: ['quantity', 'size', 'flavor','frosting','date needed'],
        sheetCake: ['quantity', 'size', 'flavor','frosting','date needed'],
        cupCakes: ['quantity','flavor','frosting','date needed'],
        cakePops: ['quantity','flavor','frosting','date needed']
    },
    // note
    // make quantityField into...
    // quantityName 'auntity' 
    // quantityOptions []
    sugarCookies:{
        title: 'Sugar Cookies',
        id: 'SugarCookies',
        name: 'sugar-cookies',
        prices: [{price: 30, units: '/dozen'}],
        quantityField: new OrderFieldData('quantity','quantity',[
            '1,1 dozen','2,2 dozen','3,3 dozen','4,4 dozen','5,5 dozen','6,6 dozen'
        ]),
        fields: [],
        imageSourcePath: `img/icon/product/bbb_icon_sugarcookies_128x128.png`
    },
    dropCookies:{
        title: 'Drop Cookies',
        id: 'DropCookies',
        name: 'drop-cookies',
        prices: [{price: 25, units: '/dozen'}],
        quantityField: new OrderFieldData('quantity','quantity',[
            '1,1 dozen','2,2 dozen','3,3 dozen','4,4 dozen','5,5 dozen','6,6 dozen'
        ]),
        fields: [
            new OrderFieldData('flavor','flavor',[
                'vanilla','chocolate','lemon','raspberry','strawberry'
            ]),
            new OrderFieldData('chips','baking chips',[
                'chocolate','white chocolate','peanut butter'
            ])
        ],
        imageSourcePath: `img/icon/product/bbb_icon_dropcookies_128x128.png`
    },
    layerCake:{
        title: 'Layer Cake',
        id: 'LayerCake',
        name: 'layer-cake',
        prices: [
            {price: 25, title: '6 inch'},
            {price: 35, title: '8 inch'},
            {price: 45, title: '10 inch'},
            {price: 65, title: '2 tier'},
        ],
        quantityField: new OrderFieldData('quantity','quantity',['1','2']),
        fields: [
            new OrderFieldData('size','size',[
                '6 inch,6" smash','8 inch,8"','10 inch,10"','2 tier,2 tier'
            ]),
            new OrderFieldData('flavor','flavor',cakeFlavors),
            new OrderFieldData('frosting','frosting',cakeFrostings)
        ],
        imageSourcePath: `img/icon/product/bbb_icon_layercake_128x128.png`
    },
    sheetCake:{
        title: 'Sheet Cake',
        id: 'SheetCake',
        name: 'sheet-cake',
        prices: [{price: 30, title: 'quarter'},{price: 45, title: 'half'}],
        quantityField: new OrderFieldData('quantity','quantity',['1','2']),
        fields: [
            new OrderFieldData('size','size',[
                'quarter','half'
            ]),
            new OrderFieldData('flavor','flavor',cakeFlavors),
            new OrderFieldData('frosting','frosting',cakeFrostings)
        ],
        imageSourcePath: `img/icon/product/bbb_icon_sheetcake_128x128.png`
    },
    cupCakes:{
        title: 'Cup Cakes',
        id: 'CupCakes',
        name: 'cup-cakes',
        prices: [{price: 25, title:'mini',units:'/dozen'},{price: 30,title:'standard',units:'/dozen'}],
        quantityField: new OrderFieldData('quantity','quantity',[
            '1,1 dozen','2,2 dozen','3,3 dozen','4,4 dozen','5,5 dozen','6,6 dozen'
        ]),
        fields: [
            new OrderFieldData('size','size',[
                'mini','standard'
            ]),
            new OrderFieldData('flavor','flavor',cakeFlavors),
            new OrderFieldData('frosting','frosting',cakeFrostings)
        ],
        imageSourcePath: `img/icon/product/bbb_icon_cupcakes_128x128.png`
    },
    cakePops:{
        title: 'Cake Pops',
        id: 'CakePops',
        name: 'cake-pops',
        prices: [{price: 18, units: '/dozen'}],
        quantityField:  new OrderFieldData('quantity','quantity',[
            '1,1 dozen','2,2 dozen','3,3 dozen','4,4 dozen','5,5 dozen','6,6 dozen'
        ]),
        fields: [
            new OrderFieldData('flavor','flavor',cakeFlavors),
            new OrderFieldData('frosting','frosting',cakeFrostings)
        ],
        imageSourcePath: `img/icon/product/bbb_icon_cakepops_128x128.png`
    },
}

export const listOfUsStates = [
  { content: "Alabama", value: "AL" },
  { content: "Alaska", value: "AK" },
  { content: "Arizona", value: "AZ" },
  { content: "Arkansas", value: "AR" },
  { content: "California", value: "CA" },
  { content: "Colorado", value: "CO" },
  { content: "Connecticut", value: "CT" },
  { content: "Delaware", value: "DE" },
  { content: "Florida", value: "FL" },
  { content: "Georgia", value: "GA" },
  { content: "Hawaii", value: "HI" },
  { content: "Idaho", value: "ID" },
  { content: "Illinois", value: "IL" },
  { content: "Indiana", value: "IN" },
  { content: "Iowa", value: "IA" },
  { content: "Kansas", value: "KS" },
  { content: "Kentucky", value: "KY" },
  { content: "Louisiana", value: "LA" },
  { content: "Maine", value: "ME" },
  { content: "Maryland", value: "MD" },
  { content: "Massachusetts", value: "MA" },
  { content: "Michigan", value: "MI" },
  { content: "Minnesota", value: "MN" },
  { content: "Mississippi", value: "MS" },
  { content: "Missouri", value: "MO" },
  { content: "Montana", value: "MT" },
  { content: "Nebraska", value: "NE" },
  { content: "Nevada", value: "NV" },
  { content: "New Hampshire", value: "NH" },
  { content: "New Jersey", value: "NJ" },
  { content: "New Mexico", value: "NM" },
  { content: "New York", value: "NY" },
  { content: "North Carolina", value: "NC" },
  { content: "North Dakota", value: "ND" },
  { content: "Ohio", value: "OH" },
  { content: "Oklahoma", value: "OK" },
  { content: "Oregon", value: "OR" },
  { content: "Pennsylvania", value: "PA" },
  { content: "Rhode Island", value: "RI" },
  { content: "South Carolina", value: "SC" },
  { content: "South Dakota", value: "SD" },
  { content: "Tennessee", value: "TN" },
  { content: "Texas", value: "TX" },
  { content: "Utah", value: "UT" },
  { content: "Vermont", value: "VT" },
  { content: "Virginia", value: "VA" },
  { content: "Washington", value: "WA" },
  { content: "West Virginia", value: "WV" },
  { content: "Wisconsin", value: "WI" },
  { content: "Wyoming", value: "WY" }
];
  
