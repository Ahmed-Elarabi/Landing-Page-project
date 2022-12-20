/**
 * 
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 * 
 * Dependencies: None
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
*/

/**
 *                                      DYNAMICALLY BUILD THE NAVIGATION BAR
*make <li> elements equal to the number of sections present by iterating over the node list returned from selecting all 'section' elements:
*adjust the inner HTML of the newly created <li> elements so that it will have an anchor child element
*/

const sectionsList = document.querySelectorAll('section');
const ulNav = document.getElementById('navbar__list');
const fragment = document.createDocumentFragment();        //create a document fragment to store the new elements in before appending them to the DOM.(to enhance performance)
for(let i=0;i<sectionsList.length;i++){
    const listItem = document.createElement('li');
    // the <a> element will have 'href'='#section.id so that when we click on it it will navigate us to the mentioned section location on the page
    listItem.innerHTML =`<a href="#${sectionsList[i].id}" id="${sectionsList[i].id}-link" class="menu__link">${sectionsList[i].dataset.nav}</a>`;
    fragment.appendChild(listItem);
}
ulNav.appendChild(fragment); // append the resulted documentFragment as child to the <ul>


/**
 *                                        HIGHLIGHT THE SECTION BEING VIEWED
 * using Intersection Observer API to observe sections to see which section is currently is in the view port,
 * by looping the observer over the sectionList,
 * assign a 'your-active-class'class to the section in the view port (with a 0.85 intersection threshold),
 * and assign a 'active' to the related <a> element corresponding to the previously mentioned section,
 * when the mentioned section is not in the view port anymore it will loose the mentioned class along with its corresponding <a> element.
 */
const options = { // the root is defined by default if not specified to null(the full view port)
    threshold:0.85,
};
const observer = new IntersectionObserver (function (arguments){
 arguments.forEach(function(arg){
    let correspondingLink = document.querySelector(`[id= "${arg.target.id}-link"]`);
    if(arg.isIntersecting === true){
        arg.target.classList.add('your-active-class');
        correspondingLink.classList.add('active');
    }
    else{
        arg.target.classList.remove('your-active-class');
        correspondingLink.classList.remove('active');
    }
 })
 },options);
 sectionsList.forEach(function(section){
    observer.observe(section);
 })


 /**
  *            SCROLLING SMOOTHELY TO ANCHOR
  * use an event listener to prevent the default event when we click the anchor,
  * use window.scrollTo to set the behavior of scrolling to 'smooth'
  * to get the location of the desired section to go to we can use the vlaue of the href attribute of the anchor clicked,
  * since it is equal to the id of the section desired plus a '#' in the start,
  * we can pass the whole value into a querySelector which will get the desired section "by id" in return.
  */
 ulNav.addEventListener('click',function(event){ // apply the event listener on the parent element to avoid too many listeners on the page 
    event.preventDefault();
    const sectionId = event.target.getAttribute("href"); // need the event.target since we are running the event on the parent element<ul>
    
    window.scrollTo({
        top: document.querySelector(`${sectionId}`).offsetTop,      // no need for a left(x-axis) coordinate since the sections already fill all the page horizontally
        behavior : "smooth" 
    });
})

/**                  THE SCROLL TO TOP BUTTON
 * define the element by its id and store it in variable
 * add an event listener so that when we click the button we navigate all the way up to the very top of the page,
 * set a 'smooth' behavior for the navigation.
 */
 const topButton = document.getElementById('top-button');
 topButton.addEventListener('click',function(){
     window.scrollTo({
         top : 0,
         behavior : 'smooth'
     })
 });


 /**
 * HIDE (THE NAVIGATION BAR WHEN NOT SCROLLING , and THE SCROLL TO TOP BUTTON before mid-page )
 * use a function to change the style of the nanigation bar.
 * use a set interval so that the function would be invoked every 9 seconds(9000 millisecnds),
 */
const hideBar = function(){
    document.querySelector("header").style.display = "none";
}
setInterval(hideBar,9000);
/**
 * find the medieum point of the y-axis of the page, to begin showing the scroll to top button after,
 * tried different set values (document.body.scrollHeight, document.body.offsetHeight, HTML scrollHeight, and HTML clientHeight ) the HTML clientHeight was the most accurate.
 * 
 */
const pageHeight = document.documentElement.clientHeight;
const halfway = pageHeight/2;
/**
 * use the on scroll event on the whole DOM,so that each time we scroll a function would run.
 * the function will show the navigation bar,
 * hide the scroll to top button if we are in the first vertical half of the page,
 * show the scroll to top button if we bypass the first vertical half of the page.
 * use scrollY property of window to know where are we scrolled to vertically.
 */

document.onscroll = function(){
    document.querySelector("header").style.display = "block";

    if(window.scrollY<=halfway)
    {
        topButton.style.display = "none";
    }
    else
    {
        topButton.style.display = "block";
    }
    
};


/**      CREATE COLLAPSIBLE BUTTONS
 * loop over the sections list and create a new 'button' element for each section,
 * place the created button as a previous sibling to the section,
 * loop over all the created buttons and add an event listener for each one,
 * the event listner will fire when we click on the  button,
 * and will 'toggle' the class of "active-button" to the clicked button.
 * stor the corresponding section to the button in a buttonContent variable.
 * change the display of the buttonContent with the click event.
 */

for(let j=0;j<sectionsList.length;j++) // this loop is slightly illogical since its the same loop at line (25) and the two loops can be merged into one to increase the performance,
                                       // but i think its better this way to make the code more readable and to seperate what is needed for each feature we add.
{
    const buttonContainer = document.createElement('button');
   buttonContainer.textContent =`${sectionsList[j].dataset.nav}`;
    sectionsList[j].insertAdjacentElement('beforebegin',buttonContainer);
};

const collapsButtons = document.getElementsByTagName('button');

for (let r=0;r<collapsButtons.length;r++)
{
    collapsButtons[r].addEventListener('click',function(event){
        event.target.classList.toggle('active-button');
        const buttonContent = event.target.nextElementSibling;
        buttonContent.style.display ==='block'? buttonContent.style.display = 'none' : buttonContent.style.display = 'block'; //  used a ternary operator here for a change instead of if
    });
};
