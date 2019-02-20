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

function localItems() {
  var items = storageOperations.getStorageItem("items");
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

function addNewTask() {
  var text = document.getElementById("new-task__text").value;
  if (text != "") {
    document.getElementById("new-task__text").value = "";
    var items = storageOperations.getStorageItem("items");
    items.push({'id': items.length, 'task': text,'check': false});
    storageOperations.setStorageItem('items', items);
    renderItem(items.length-1, text, false);
  } 
}

function renderItem(key, task, checkFlag) {
  var div = document.createElement('div');
  div.className = "item item-" + String(key);
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
  (document.getElementsByClassName("todo-list_items"))[0].innerHTML = " ";
}

function сompleteAll() {
  var checkboxes = document.querySelectorAll('input[type="checkbox"]');
  var icon = (document.getElementsByClassName("checked-items"))[0];
  var items = storageOperations.getStorageItem("items");
  var flag = storageOperations.getStorageItem('flag');
  if (!flag) {
    icon.className += ' checked-items_complete';
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
}

function showAll() {
  var checkboxes = document.querySelectorAll('input[type="checkbox"]');
  for (var i=0; i < checkboxes.length; i++) {
    var element = ((document.getElementsByClassName("item-" + String(checkboxes[i].id)))[0]);
    element.style.display = "flex";
  }
}

function showActive() {
  var checkboxes = document.querySelectorAll('input[type="checkbox"]');
  for (var i=0; i < checkboxes.length; i++) {
    var element = ((document.getElementsByClassName("item-" + String(checkboxes[i].id)))[0]);
    if (checkboxes[i].checked) {
      element.style.display = "none";
    }
    else {
      element.style.display = "flex";
    }
  }
}

function showComplited() {
  var checkboxes = document.querySelectorAll('input[type="checkbox"]');
  for (var i=0; i < checkboxes.length; i++) {
    var element = ((document.getElementsByClassName("item-" + String(checkboxes[i].id)))[0]);
    if (checkboxes[i].checked) {
      element.style.display = "flex";
    }
    else {
      element.style.display = "none";
    }
  }
}

function checkboxChange(elemId, state) {
  var items = storageOperations.getStorageItem("items");
  for (var i=0; i < items.length; i++) {
    if (items[i].id == elemId) {
      items[i].check = state;
    }
  }
  storageOperations.setStorageItem("items", items);
}