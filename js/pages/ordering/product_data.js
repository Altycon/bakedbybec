const DOZEN_QUANTITY_OPTIONS = [
    { textContent: '1 dozen', value: '1' },
    { textContent: '2 dozen', value: '2' },
    { textContent: '3 dozen', value: '3' },
    { textContent: '4 dozen', value: '4' },
    { textContent: '5 dozen', value: '5' },
    { textContent: '6 dozen', value: '6' },
];
const COOKIE_FLAVOR_OPTIONS =[
    { textContent:'vanilla', value:'vanilla'},
    { textContent:'chocolate', value:'chocolate' },
    { textContent:'lemon', value:'lemon' },
    { textContent:'raspberry', value:'raspberry' },
    { textContent:'strawberry', value:'strawberry' },
];
const CAKE_FLAVOR_OPTIONS = [
    { textContent:'vanilla', value:'vanilla'},
    { textContent:'chocolate', value:'chocolate' },
    { textContent:'funfetti', value:'funfetti' },
    { textContent:'lemon', value:'lemon' },
    { textContent:'red velvet', value:'red velvet' },
    { textContent:'strawberry', value:'strawberry' },
    { textContent:'carrot', value:'carrot' },
];
const CAKE_FROSTING_OPTIONS = [
    { textContent:'vanilla', value:'vanilla' },
    { textContent:'chocolate', value:'chocolate' },
    { textContent:'lemon', value:'lemon' },
    { textContent:'strawberry', value:'strawberry' },
    { textContent:'cream cheese', value:'cream cheese' },
];
const BAKING_CHIPS_OPTIONS = [
    { textContent:'chocolate', value:'chocolate' },
    { textContent:'white chocolate', value:'white chocolate'},
    { textContent:'peanut butter', value:'peanut butter' },
];
export const PRODUCT_DATA = {
    sugarCookies: {
        id: 'SugarCookies',
        title: 'Sugar Cookies',
        name: 'sugar-cookies',
        themed: true,
        prices: [
            { value: '30', units: '/dozen' }
        ],
        fields: {
            quantity: {
                id:'SugarCookiesQuantity',
                name: 'sugar-cookies-quantity',
                textContent: 'quantity',
                options: DOZEN_QUANTITY_OPTIONS
            },
            extended: false
        },
        invoiceFields: [],
        retrievalRestrictions: [],
        image: `img/icon/product/bbb_icon_sugarcookies_128x128.png`
    },
    dropCookies: {
        id: 'DropCookies',
        title: 'Drop Cookies',
        name: 'drop-cookies',
        themed: false,
        prices: [
            { value: '25', units: '/dozen' }
        ],
        fields: {
            quantity: {
                id:'DropCookiesQuantity',
                name: 'drop-cookies-quantity',
                textContent: 'quantity',
                options: DOZEN_QUANTITY_OPTIONS
            },
            flavor: {
                id:'DropCookiesFlavor',
                name: 'drop-cookies-flavor',
                textContent: 'flavor',
                options: COOKIE_FLAVOR_OPTIONS
            },
            bakingChips: {
                id:'DropCookiesChips',
                name: 'drop-cookies-chips',
                textContent: 'baking chips',
                options: BAKING_CHIPS_OPTIONS
            },
            extended: true
        },
        invoiceFields: ['flavor', '/', 'baking chips'],
        retrievalRestrictions: [],
        image: `img/icon/product/bbb_icon_dropcookies_128x128.png`
    },
    layerCake: {
        id: 'LayerCake',
        title: 'Layer Cake',
        name: 'layer-cake',
        themed: true,
        prices: [
            { value: '25', title: '6 inch' },
            { value: '35', title: '8 inch' },
            { value: '45', title: '10 inch' },
            { value: '65', title: '2 tier' },
        ],
        fields: {
            quantity: {
                id:'LayerCakeQuantity',
                name: 'layer-cake-quantity',
                textContent: 'quantity',
                options: [
                    { textContent:'1', value:'1' },
                    { textContent:'2', value:'2' },
                ],
            },
            size: {
                id:'LayerCakeSize',
                name: 'layer-cake-size',
                textContent:'size',
                options: [
                    { textContent:'6" smash', value:'6 inch' },
                    { textContent: '8"', value:'8 inch' },
                    { textContent:'10"', value:'10 inch' },
                    { textContent:'2 tier', value:'2 tier' },
                ]
            },
            flavor: {
                id:'LayerCakeFlavor',
                name: 'layer-cake-flavor',
                textContent:'flavor',
                options: CAKE_FLAVOR_OPTIONS
            },
            frosting: {
                id:'LayerCakeFrosting',
                name: 'layer-cake-frosting',
                textContent:'frosting',
                options: CAKE_FROSTING_OPTIONS
            },
            extended: true
        },
        invoiceFields: ['size', 'flavor', '/', 'frosting',],
        retrievalRestrictions: ['shipping'],
        image: `img/icon/product/bbb_icon_layercake_128x128.png`
    },
    sheetCake: {
        id: 'SheetCake',
        title: 'Sheet Cake',
        name: 'sheet-cake',
        themed: true,
        prices: [
            { value: '30', title: 'quarter' },
            { value: '45', title: 'half' }
        ],
        fields: {
            quantity: {
                id:'SheetCakeQuantity',
                name: 'sheet-cake-quantity',
                textContent: 'quantity',
                options: [
                    { textContent:'1', value:'1' },
                    { textContent:'2', value:'2' },
                ],
            },
            size: {
                id:'SheetCakeSize',
                name: 'sheet-cake-size',
                textContent:'size',
                options: [
                    { textContent:'quarter', value:'quarter' },
                    { textContent: 'half', value:'half' },
                ]
            },
            flavor: {
                id:'SheetCakeFlavor',
                name: 'sheet-cake-flavor',
                textContent:'flavor',
                options: CAKE_FLAVOR_OPTIONS
            },
            frosting: {
                id:'SheetCakeFrosting',
                name: 'sheet-cake-frosting',
                textContent:'frosting',
                options: CAKE_FROSTING_OPTIONS
            },
            extended: true
        },
        invoiceFields: ['size', 'flavor', '/', 'frosting'],
        retrievalRestrictions: ['shipping'],
        image: `img/icon/product/bbb_icon_sheetcake_128x128.png`
    },
    cupCakes: {
        id: 'CupCakes',
        title: 'Cup Cakes',
        name: 'cup-cakes',
        themed: true,
        prices: [
            { value: '25', title:'mini', units:'/dozen' },
            { value: '30', title:'standard', units:'/dozen' }
        ],
        fields: {
            quantity: {
                id:'CupCakesQuantity',
                name: 'cup-cakes-quantity',
                textContent:'quantity',
                options: DOZEN_QUANTITY_OPTIONS
            },
            size: {
                id:'CupCakesSize',
                name:'cup-cakes-size',
                textContent:'size',
                options: [
                    { textContent:'mini', value:'mini' },
                    { textContent:'standard', value: 'standard' }
                ]
            },
            flavor: {
                id:'CupCakesFlavor',
                name:'cup-cakes-flavor',
                textContent:'flavor',
                options: CAKE_FLAVOR_OPTIONS
            },
            frosting: {
                id:'CupCakesFrosting',
                name:'cup-cakes-frosting',
                textContent:'frosting',
                options: CAKE_FROSTING_OPTIONS
            },
            extended: true
        },
        invoiceFields: ['size','flavor', '/', 'frosting'],
        retrievalRestrictions: ['shipping'],
        image: `img/icon/product/bbb_icon_cakepops_128x128.png`
    },
    cakePops:{
        id: 'CakePops',
        title: 'Cake Pops',
        name: 'cake-pops',
        themed: false,
        prices: [
            { value: 18, units: '/dozen' }
        ],
        fields: {
            quantity: {
                id:'CakePopsQuantity',
                name: 'cake-pops-quantity',
                textContent:'quantity',
                options: DOZEN_QUANTITY_OPTIONS
            },
            flavor: {
                id:'CakePopsFlavor',
                name:'cake-pops-flavor',
                textContent:'flavor',
                options: CAKE_FLAVOR_OPTIONS
            },
            frosting: {
                id:'CakePopsFrosting',
                name:'cake-pops-frosting',
                textContent:'frosting',
                options: CAKE_FROSTING_OPTIONS
            },
            extended: true
        },
        invoiceFields: ['flavor', '/', 'frosting'],
        retrievalRestrictions: ['shipping'],
        image: `img/icon/product/bbb_icon_cakepops_128x128.png`
    }
};