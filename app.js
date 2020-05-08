/* STORAGE CONTROLLER
-----------------------*/
const StorageCtrl = (function(){
  // Public methods
  return {
    storeItem: function(item){
      let items;
      // Check if any items in local storage
      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      items.push(item);
      // Set local storage
      localStorage.setItem('items', JSON.stringify(items));
    },
    getItemsFromStorage: function(){
      let items = [];
      if(localStorage.getItem('items') === null){
        items =[];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach(function(item, index){
        if (updatedItem.id === item.id){
          items.splice(index, 1, updatedItem); // 3rd parameter of splice is what we want to update the spliced content with
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function(id) {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach(function(item, index){
        if (id === item.id){
          items.splice(index, 1); // 3rd parameter of splice is what we want to update the spliced content with
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearAllFromStorage: function(){
      localStorage.removeItem('items');
    }
  }
})();



/* ITEM CONTROLLER
-----------------------*/
const ItemCtrl = (function(){
  
  // Item constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure / State
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  };

  // Public methods
  return {
    getItems: function(){
      return data.items;
    },
    addItem: function(name, calories){

      let ID;
      // Create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id +1
      } else {
        ID = 0;
      }

      calories = parseInt(calories); // Calories as number
        const newItem = new Item(ID, name, calories); // Create new item
      
      data.items.push(newItem); // Add to data.items array

      return newItem;
    },
    getItemById: function(id) {
      let found = null;
      // Loop through items
      data.items.forEach(function(item){
        if (item.id === id){
          found = item;
        }
      });
      return found;
    },
    updateItem: function(name, calories){
      
      calories = parseInt(calories); // Calories to number

      let found = null;
      data.items.forEach(function(item){
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function(id){
      // Gets ids (using map method)
      ids = data.items.map(function(item){
        return item.id;
      });

      
      const index = ids.indexOf(id); // Get index

      
      data.items.splice(index, 1); // Remove item
    },
    clearAllItems: function(){
      data.items = [];
    },
    setCurrentItem: function(item){
      data.currentItem = item;
    },
    getCurrentItem: function(){
      return data.currentItem;
    },
    getTotalCalories: function(){
      let total = 0;

      // Loop through items and add calories
      data.items.forEach(function(item) {
        total += item.calories;
      });

      
      data.totalCalories = total; // Set total in data structure

      return data.totalCalories;
    },
    logData: function(){
      return data;
    }
  }
})();




/* UI CONTROLLER
-----------------------*/
const UICtrl = (function(){

  // Object to hold all of the UI selectors
  const UISelectors = {
    itemList: document.querySelector('#item-list'),
    listItems: '#item-list li', // These items change in the DOM, so must be called new each time
    addBtn: document.querySelector('.add-btn'),
    updateBtn: document.querySelector('.update-btn'),
    deleteBtn: document.querySelector('.delete-btn'),
    backBtn: document.querySelector('.back-btn'),
    clearBtn: document.querySelector('.clear-btn'),
    itemNameInput: document.querySelector('#item-name'),
    itemCaloriesInput: document.querySelector('#item-calories'),
    totalCalories: document.querySelector('.total-calories')
  }
  
  // Public methods
  return {
    populateItemList: function(items) {
      let html = '';
      items.forEach(function(item){
        html += `<li class="collection-item" id="item-${item.id}">
            <strong>${item.name}: </strong><em>${item.calories}</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          </li>
        `;
      });
      
      
      UISelectors.itemList.innerHTML = html; // Insert list items

    },
    getItemInput: function(){
      return {
        name: UISelectors.itemNameInput.value,
        calories: UISelectors.itemCaloriesInput.value
      }
    },
    addListItem: function(item){
      UISelectors.itemList.style.display = 'block';  // Show list
      const li = document.createElement('li'); // Create li elemt
      li.className = 'collection-item';
      li.id = `item-${item.id}`;
      // Add html
      li.innerHTML = `
        <strong>${item.name}: </strong><em>${item.calories}</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`;
    
      UISelectors.itemList.insertAdjacentElement('beforeend', li);   // Insert item into DOM
    },
    updateListItem: function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // convert node list into array
      listItems = Array.from(listItems);
      // console.log(listItems);
      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id');
        if (itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `
            <strong>${item.name}: </strong><em>${item.calories}</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`;
        }
      });
    },
    deleteListItem: function(id){
      const itemId = `#item-${id}`;
      const item = document.querySelector(itemId);
      item.remove();
    },
    clearInput: function(){
      UISelectors.itemNameInput.value = '';
      UISelectors.itemCaloriesInput.value = '';
    },
    addItemToForm: function(){
      UISelectors.itemNameInput.value = ItemCtrl.getCurrentItem().name;
      UISelectors.itemCaloriesInput.value = ItemCtrl.getCurrentItem().calories;
      // Get Edit state
      UICtrl.showEditState();
    },
    removeListItems: function(){
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // convert node list to array
      listItems = Array.from(listItems);
      listItems.forEach(function(item){
        item.remove();
      });
    },
    hideList: function(){
      UISelectors.itemList.style.display = 'none';
    },
    showTotalCalories: function(totalCalories){
      UISelectors.totalCalories.textContent = totalCalories;
    },
    clearEditState: function(){
      UICtrl.clearInput();
      UISelectors.updateBtn.style.display = 'none';
      UISelectors.deleteBtn.style.display = 'none';
      UISelectors.backBtn.style.display = 'none';
      UISelectors.addBtn.style.display = 'inline';
    },
    showEditState: function(){
      UISelectors.updateBtn.style.display = 'inline';
      UISelectors.deleteBtn.style.display = 'inline';
      UISelectors.backBtn.style.display = 'inline';
      UISelectors.addBtn.style.display = 'none';
    },
    getSelectors: function(){
      return UISelectors;
    }
  }
})();




/* APP CONTROLLER
-----------------------*/
const App = (function(ItemCtrl, UICtrl, StorageCtrl){

  // Load Event Listeners
  const loadEventListeners = function() {
    const UISelectors = UICtrl.getSelectors();

    UISelectors.addBtn.addEventListener('click', itemAddSubmit); // Add item event
    UISelectors.itemList.addEventListener('click', itemEditClick); // Edit icon click event
    UISelectors.updateBtn.addEventListener('click', itemUpdateSubmit); // Update item event
    UISelectors.deleteBtn.addEventListener('click', itemDeleteSubmit); // Delete item event
    UISelectors.backBtn.addEventListener('click', itemEditCancel); // Back Button event
    UISelectors.clearBtn.addEventListener('click', clearAllItemsClick); // Clear All event

    // Disable submit on enter
    document.addEventListener('keypress', function(e){
      if(e.keyCode === 13 || e.which === 13){ // If 'enter' was pressed on keyboard
        e.preventDefault();
        return false;
      }
    })
  };
  
  // Add item submit
  const itemAddSubmit = function(e){
    
    
    const input = UICtrl.getItemInput(); // Get form input from UI Controller
    
    // Check that fields are filled
    if (input.name !== '' && input.calories !== '') {
      
      
      const newItem = ItemCtrl.addItem(input.name, input.calories); // Add item
      
      
      UICtrl.addListItem(newItem); // Add item to UI list
      const totalCalories = ItemCtrl.getTotalCalories(); // Get total calories
      UICtrl.showTotalCalories(totalCalories); // Add total to UI
      StorageCtrl.storeItem(newItem);  // Add to storage  
      UICtrl.clearInput(); // Clear fields
    }
    e.preventDefault();
  };

  // Edit item click
  const itemEditClick = function(e){
    e.preventDefault();
    //  Check that the edit icon is what was clicked
    if (e.target.classList.contains('edit-item')){
      
      
      const listId = e.target.parentNode.parentNode.id; // Get list item ID
      
      const listIdArray = listId.split('-'); // Break into an array
      const id = parseInt(listIdArray[1]); // Get actual id
      const itemToEdit = ItemCtrl.getItemById(id); // Get item 
      ItemCtrl.setCurrentItem(itemToEdit); // Set current item
      UICtrl.addItemToForm(); // Add item to form
    }
  }

  // Update edit submit
  const itemUpdateSubmit = function(e) {
    e.preventDefault();
    
    const input = UICtrl.getItemInput(); // Get item input
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories); // Update item 
    UICtrl.updateListItem(updatedItem); // Update UI
    const totalCalories = ItemCtrl.getTotalCalories(); // Get total calories
    UICtrl.showTotalCalories(totalCalories); // Add total to UI
    StorageCtrl.updateItemStorage(updatedItem);  // Update local storage
    UICtrl.clearEditState();

  };


  // Delete button event
  const itemDeleteSubmit = function(e) {
    e.preventDefault();
    
    const currentItem = ItemCtrl.getCurrentItem(); // Get current item
    
    ItemCtrl.deleteItem(currentItem.id); // Delete from data structure
    
    UICtrl.deleteListItem(currentItem.id); // Remove from UI
    const totalCalories = ItemCtrl.getTotalCalories(); // Get total calories
    UICtrl.showTotalCalories(totalCalories); // Add total to UI
    StorageCtrl.deleteItemFromStorage(currentItem.id); // Delete from local storage

    UICtrl.clearEditState();
  };
  
  // Cancel editing item (Back button)
  const itemEditCancel = function(e){
    e.preventDefault();
    UICtrl.clearEditState();
  };

  
  // Clear All items event
  const clearAllItemsClick = function(e){
    e.preventDefault()
    
    ItemCtrl.clearAllItems(); // Delete all items from data structure 
    const totalCalories = ItemCtrl.getTotalCalories(); // Get total calories
    UICtrl.showTotalCalories(totalCalories);  // Add total to UI
    UICtrl.removeListItems(); // Remove from UI
    StorageCtrl.clearAllFromStorage(); // Clear from local storage
    // Hide List ul
    UICtrl.hideList();
    UICtrl.clearEditState();
  }; 



  // Public methods
  return {
    //  This function will setup the application when it starts.
    init: function() {
      UICtrl.clearEditState(); // Clear edit state / Set Inital State
      const items = ItemCtrl.getItems(); // Fetch items from data structure

      // Check if any items exist
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        UICtrl.populateItemList(items); // Populate list with items - using UICtrl
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, UICtrl, StorageCtrl);

// Initialize App
App.init();