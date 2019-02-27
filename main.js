var createElement = {
  ElementP: function(text) {
    var text_p = document.createElement('p');
    text_p.className = "task";
    text_p.innerText = text;
    return text_p;
  },
  
  ElementInput: function(elId, check) {
    var inp = document.createElement('input');
    inp.type = "checkbox";
    inp.checked = check;
    inp.id = elId;
    inp.setAttribute("onchange", "checkboxChange(this.id, this.checked)");
    return inp;
  },
  
  ElementLabel: function(elId) {
    var lab = document.createElement('label');
    lab.htmlFor = elId;
    return lab;
  },

  ElementDeleteButton: function(elId) {
    var buttonEl = document.createElement('button');
    buttonEl.className = "item_menu__delete";
    buttonEl.id = elId;
    buttonEl.setAttribute("onclick", "deleteItem(this.id)");
    buttonEl.innerHTML = '<div class="item_menu__delete__logo"></div>';
    return buttonEl;
  }
};

var storageOperations = {
  setStorageItem: function(key, element) {
    localStorage.setItem(key, JSON.stringify(element));
  },
  getStorageItem: function(key, element) {
    return JSON.parse(localStorage.getItem(key));
  }
};

window.addEventListener('load', localItems);
if (localStorage["items"] == undefined) {
  storageOperations.setStorageItem("items", []);
}
if (localStorage["flag"] == undefined) {
  storageOperations.setStorageItem("flag", false);
}
if(localStorage["currentId"] == undefined) {
  storageOperations.setStorageItem("currentId", -1);
}

function localItems() {
  var items = storageOperations.getStorageItem("items");
  if (items.length == 0) {
    (document.getElementsByClassName("todo-list_type"))[0].className += " todo-list_type-hidden";
  }
  else {
    for (var i = 0; i < items.length; i++) {
      var element = items[i];
      renderItem(element.id, element.task, element.check);
    }
    var icon = (document.getElementsByClassName("checked-items"))[0];
    var flag = storageOperations.getStorageItem('flag');
    if (flag) {
      icon.className += ' checked-items_complete';
    }
    else {
      icon.className = 'checked-items';
    }
  }
}

function addNewTask() {
  var text = document.getElementById("new-task__text").value;
  if (text.trim() != "") {
    if ((document.getElementsByClassName("todo-list_type-hidden"))[0]) {
      (document.getElementsByClassName("todo-list_type"))[0].className = "todo-list_type";
    }
    document.getElementById("new-task__text").value = "";
    var items = storageOperations.getStorageItem("items");
    items.push({'id': items.length, 'task': text,'check': false});
    storageOperations.setStorageItem('items', items);
    var id = storageOperations.getStorageItem("currentId");
    id += 1;
    storageOperations.setStorageItem('currentId', id);
    renderItem(id, text, false);
  } 

  event.preventDefault();
}

function renderItem(key, task, checkFlag) {
  var div = document.createElement('div');
  div.className = checkFlag ? "item item-" + String(key) + " item-complete" : "item item-" + String(key) + " item-active";
  var parent = (document.getElementsByClassName("todo-list_items"))[0];
  parent.appendChild(div);
  div.appendChild(createElement.ElementInput(key, checkFlag));
  div.appendChild(createElement.ElementLabel(key));
  div.appendChild(createElement.ElementP(task));
  div.appendChild(createElement.ElementDeleteButton(key));
}

function сlearAll() {
  localStorage.clear();
  storageOperations.setStorageItem("items", []);
  storageOperations.setStorageItem("currentId", 0);
  storageOperations.setStorageItem('flag', false);
  (document.getElementsByClassName("checked-items"))[0].className = "checked-items";
  (document.getElementsByClassName("todo-list_items"))[0].innerHTML = " ";
  (document.getElementsByClassName("todo-list_type"))[0].className += " todo-list_type-hidden";
}

function сompleteAll() {
  var checkboxes = document.querySelectorAll('input[type="checkbox"]');
  var icon = (document.getElementsByClassName("checked-items"))[0];
  var items = storageOperations.getStorageItem("items");
  var flag = storageOperations.getStorageItem('flag');
  if (checkboxes.length == 0) {
    return;
  }
  if (!flag) {
    icon.className += ' checked-items_complete';
    (Array.from(document.getElementsByClassName("item"))).forEach(function(item) {
      item.className = 'item item-' + String(item.querySelector('input').id) + ' item-complete';
    });
    checkboxes.forEach(function(item) {
      item.checked = true;
    });
    for (var i = 0; i < items.length; i++) {
      items[i].check = true;
    }
    storageOperations.setStorageItem('items', items);
    flag = true;
    storageOperations.setStorageItem('flag', flag);
  }
  else {
    icon.className = 'checked-items';
    checkboxes.forEach(function(item) {
      item.checked = false;
    });
    (Array.from(document.getElementsByClassName("item"))).forEach(function(item) {
      item.className = 'item item-' + String(item.querySelector('input').id) + ' item-active';
    });
    for (var i = 0; i < items.length; i++) {
      items[i].check = false;
    }
    storageOperations.setStorageItem('items', items);
    flag = false;
    storageOperations.setStorageItem('flag', flag);
  }
}

function deleteItem(elem) {
  var items = storageOperations.getStorageItem("items");
  for (var i=0; i < items.length; i++) {
    if (items[i].id == elem) {
      items.splice(i, 1);
    }
  }
  storageOperations.setStorageItem("items", items);
  var parent = (document.getElementsByClassName("todo-list_items"))[0];
  var element = (document.getElementsByClassName("item-" + String(elem)))[0];
  parent.removeChild(element);
  if (!(document.getElementsByClassName("item"))[0]) {
    (document.getElementsByClassName("todo-list_type"))[0].className += " todo-list_type-hidden";
    (document.getElementsByClassName("checked-items"))[0].className = "checked-items";
  }
}

function showAll() {
  (document.getElementsByClassName('todo-list_items'))[0].className = "todo-list_items";
  (document.getElementsByClassName('new-task__type-completed'))[0].className = "new-task__type new-task__type-completed";
  (document.getElementsByClassName('new-task__type-active'))[0].className = "new-task__type new-task__type-active";
  (document.getElementsByClassName('new-task__type-all'))[0].className = "new-task__type new-task__type-all new-task__type-chosen";
}

function showActive() {
  (document.getElementsByClassName('todo-list_items'))[0].className = "todo-list_items todo-list_items-active";
  (document.getElementsByClassName('new-task__type-completed'))[0].className = "new-task__type new-task__type-completed";
  (document.getElementsByClassName('new-task__type-active'))[0].className = "new-task__type new-task__type-active new-task__type-chosen";
  (document.getElementsByClassName('new-task__type-all'))[0].className = "new-task__type new-task__type-all";
}

function showCompleted() {
  (document.getElementsByClassName('todo-list_items'))[0].className = "todo-list_items todo-list_items-completed";
  (document.getElementsByClassName('new-task__type-completed'))[0].className = "new-task__type new-task__type-completed new-task__type-chosen";
  (document.getElementsByClassName('new-task__type-active'))[0].className = "new-task__type new-task__type-active";
  (document.getElementsByClassName('new-task__type-all'))[0].className = "new-task__type new-task__type-all";
}

function checkboxChange(elemId, state) {
  ((document.getElementsByClassName("item-" + String(elemId)))[0]).className = state ?
     "item item-" + String(elemId) + " item-complete" : "item item-" + String(elemId) + " item-active";
  var items = storageOperations.getStorageItem("items");
  for (var i=0; i < items.length; i++) {
    if (items[i].id == elemId) {
      items[i].check = state;
    }
  }
  storageOperations.setStorageItem("items", items);
}

function isEnter(key) {
  if (key == 13) {
    addNewTask();
  }
}