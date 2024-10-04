
export function isPageNavigationDisplayed(){
    const pageNavigationElement = document.querySelector('.page-navigation-primary');
    if(!pageNavigationElement) throw new Error('missing element - page navigation primary element')
    const displayValue = getComputedStyle(pageNavigationElement).getPropertyValue('display');
    return (displayValue !== 'none');
};
    
export function pageNavigation(){
    document.querySelector('.page-navigation-primary-open-btn').addEventListener('click', (event)=>{
        const pageNavigationElement = document.querySelector('.page-navigation-primary');
        if(pageNavigationElement.classList.contains('open')){
            event.currentTarget.classList.remove('active');
            pageNavigationElement.classList.remove('show');
            setTimeout( ()=> {
                pageNavigationElement.classList.remove('open');
                // document.body.style.overflow = 'auto';
            },200);
        }else{
            setTimeout( ()=> {
                pageNavigationElement.classList.add('show');
            },100);
            event.currentTarget.classList.add('active');
            pageNavigationElement.classList.add('open');
            // document.body.style.overflow = 'hidden';
        }
    });

};