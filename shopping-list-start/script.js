/*
 ██    ██   ██████ 
 ██    ██     ██   
 ██    ██     ██   
 ██    ██     ██
 ╚██████╝   ██████
*/

//  Bring all the stuuf

const itemForm = document.querySelector("#item-form")
const itemInput = document.querySelector("#item-input")
const itemList = document.querySelector("#item-list") // the ul 
const itemFilter= document.querySelector("#filter") // the ul 
const clearBtn = document.querySelector("#clear") // Clear ALl button
const formButton = itemForm.querySelector('button')

let isEditMode = false ; 


// Inintalize App 
function init() {
    // event Listners
    itemForm.addEventListener('submit' , onAddItemSubmit)
    itemList.addEventListener('click' , onClickItem)
    itemFilter.addEventListener('input' , filterItems)
    clearBtn.addEventListener('click' , clearAll)
    document.addEventListener("DOMContentLoaded" , displayItemsList)
    
    checkUI() ;
        
}

// upadate UI with the items form storage
function  displayItemsList(){
    getItemsFromStorage().forEach(element => addItemToDom(element) );
    
    // dont forget to update the ui  
    checkUI() ; 
}

function checkUI() {
    // clear Item Input when updating
    itemInput.value=''
    
    let items = itemList.querySelectorAll('li')
    
    // load item from LocalStorage 
    
    
    //get all of the list item 
    console.log("checkUI Called")
    console.log(items.length)
    if (items.length===0) {
        
        // not show the clear all and the filter 
        itemFilter.style.display = 'none' ; 
        clearBtn.style.display = 'none' ; 
    } else  {
        itemFilter.style.display = 'block' ; 
        clearBtn.style.display = 'block' ; 
    }
    
    isEditMode = false 
    formButton.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item'
    formButton.backgroundColor = '#333';
}





/*
    =======================
            LOGIC 
    =======================
*/
// add item to the ul (li ite,)
function onAddItemSubmit(e) {
    e.preventDefault() ;
    let newItem =  itemInput.value
    // validate Input
    if (newItem  === '') {
        alert("please add an item")
        return ; 
    }
    
    //check for editmode 
    if (isEditMode) {
        const itemToEditNode = itemList.querySelector('.edit-mode') ; 
        
        //remove item form storage 
        removeItemFromStorage(itemToEditNode.textContent) ; 
        // remove class edit-mode
        itemToEditNode.classList.remove('edit-mode');
        // remove the ui Node 
        itemToEditNode.remove() 
        //update Ui mode 
        isEditMode= false
        
        
    }
    
    
    // create item dom elment 
    addItemToDom(newItem);
    
    // Add item tol LocalStorage
    addItemToStorage(newItem) 
    checkUI()
    itemInput.value = "" ;
}

function addItemToDom(item){
    // create List item
    const li = document.createElement("li"); 
    // li.innerText = `${newItem}` ; 
    li.appendChild(document.createTextNode(item)) ; 
    
    //add Abutton and an icon 
    const button =document.createElement("button")
    
    button.classList= 'remove-item btn-link text-red' ; 
    const icon = document.createElement("i")
    icon.classList = 'fa-solid fa-xmark' ; 
    button.appendChild(icon)
    li.appendChild(button)
    

    // add to the dom 
    itemList.appendChild(li) ; 
}

function onClickItem(e) {
    
    
    // the remove 
    if (e.target.parentElement.classList.contains('remove-item')){
        // remove the list item not the button 
        const m_listItem = e.target.parentElement.parentElement; 
        removeItem( e.target.parentElement.parentElement )
    }else {
        // edit item 
        console.log(e.target)
        setItemToEdit(e.target)
    }
    
    // the update 
}

function setItemToEdit(e){
    isEditMode = true ; 
    
    itemList.querySelectorAll('li').forEach(i=> i.classList.remove('edit-mode'));
    e.classList.add('edit-mode')
    
    formButton.innerHTML = '<i class="fa-solid fa-pen"><i/> Update Item'
    formButton.style.backgroundColor = '#228b22'
    itemInput.value = e.textContent
}

// STORAGE 
function addItemToStorage(item){
    //Obtain storage Items 
    const itemsFormStorage = getItemsFromStorage() ; 

    // puh to the array of items
    itemsFormStorage.push(item) ; 

    // put it back in the storage 
    localStorage.setItem('items' ,  JSON.stringify(itemsFormStorage)) ; 
    
}

function removeItemFromStorage(item) {
    let itemsFormStorage = getItemsFromStorage() ; 
    
    // filter out item to be removed
    /*
    The filter() method of Array instances creates a shallow copy of a portion of a
    given array, filtered down to just the elements from the given array that pass the
    test implemented by the provided function.*/ 
    itemsFormStorage = itemsFormStorage.filter((i)=>i!==item )
    
    // Re-set to local storage 
    localStorage.setItem('items', JSON.stringify(itemsFormStorage));
}
function getItemsFromStorage(){
    let itemsFormStorage ;
    
    if (localStorage.getItem('items')==null){
        itemsFormStorage = [] /// no items in storage 
    }
    else {
        itemsFormStorage = JSON.parse(localStorage.getItem('items'))
    }
    
    // puh to the array of items
    return itemsFormStorage 
}



// we will do event delegation 
function removeItem(item) {
    // REMOVE ITEM FROM DOM 
    item.remove() ; 

    // REMOVE ITEM FROM Storage
    removeItemFromStorage(item.textContent); 
    checkUI()
}

// clear all the data form the ul 
function clearAll(e) {
    // e.preventDefault(); 
    
    // method 1 not that good 
    // itemList.innerHtml = ''    
    
    // this is better way to clear all the items 
    while(itemList.firstChild ){
        itemList.removeChild(itemList.firstChild)
        
    }
    
    //remove from Storage
    localStorage.clear();
    
    // remove the filter Input 
    checkUI() 
    
}

function filterItems(e) {
    const text = e.target.value.toLowerCase() ; // the input text value
    
    // get the list items
    let items = itemList.querySelectorAll('li')
    items.forEach(element => {
        // text constent of each item
        
        // we dont want the button 
        // console.log(element.firstElementChild) 
        
        // console.log(element.firstChild) 
        
        // the inner Text 
        const itemName = element.firstChild.textContent.toLowerCase()
        
        // now do the comparation
        // if  such a text in that item 
        if (itemName.indexOf(text)!=-1) {
            // Keep the ones that mathes  
            element.style.display = 'flex'
        } else {
            // if no  such a text in that item 
            // now we remove the one that dont match 
            element.style.display = 'none'
        }
        
        
    });
}

init(); 