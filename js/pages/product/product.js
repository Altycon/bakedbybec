
function initializeProductPage(){

    if(innerWidth < 1100){

        document.querySelector('.navigation-secondary-open-btn').addEventListener('click', (event)=>{
            document.querySelector('.navigation-secondary').classList.toggle('show');
        });
    }
    
};

initializeProductPage();