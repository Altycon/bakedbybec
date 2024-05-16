

export function createIntersectionObserver(className,threshold = 0){

    const intersections = document.querySelectorAll(className);

    const homeObserver = new IntersectionObserver(entries=>{

       entries.forEach( entry => {

            if(entry.isIntersecting){

                entry.target.classList.add('show');

            }else if(entry.target.classList.contains('intersection-end')){

                entry.target.classList.remove('show');
            }
       })
       
    }, {
        root: null,
        threshold: threshold,
    });

    intersections.forEach( intersection => {
        homeObserver.observe(intersection);
    })
};