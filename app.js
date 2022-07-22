// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert");
const form = document.querySelector(".todo-form");
const todo = document.getElementById("todo");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".todo-container");
const list = document.querySelector(".todo-list");
const clearBtn = document.querySelector(".clear-btn");

// edit option
let editElement;
let editFlag = false;
let editID = "";

// ****** FUNCTIONS **********

//ADD ITEM
const addItem = function (e) {
  e.preventDefault();
  const value = todo.value;
  //cheat unique id with date miliseconds
  const id = new Date().getTime().toString();

  if (!editFlag && value) {
    createListItem(id, value);
    alertMessage("added item!", "success");
    container.classList.add("show-container");
    addToLocalStorage(id, value);
    setBackToDefault();
  } else if (editFlag && value) {
    editElement.innerHTML = value;

    alertMessage("item edited!", "success");
    editLocalStorage(editID, value);
    editLocalStorageDone(editID, value);
    setBackToDefault();
  } else {
    alertMessage("input recquired", "danger");
  }
};

//ALERT
const alertMessage = function (text, value) {
  alert.classList.add(`alert-${value}`);
  alert.textContent = `${text}`;
  setTimeout(function () {
    alert.classList.remove(`alert-${value}`);
    alert.textContent = "";
  }, 800);
};

//DEFAULT
const setBackToDefault = function () {
  todo.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
};

//CLEAR ITEMS
const clearItems = function () {
  const items = document.querySelectorAll(".todo-item");
  if (items.length > 0) {
    items.forEach((item) => list.removeChild(item));
  }
  container.classList.remove("show-container");
  //alert
  alertMessage("list is cleared!", "danger");
  //save
  localStorage.removeItem("list");
  localStorage.removeItem("done");
};

//DELETE
const deleteItem = function (e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  //alert
  alertMessage("item deleted", "danger");
  //save
  removeFromLocalStorage(id);
  removeFromLocalStorageDone(id);
  //refresh
  setBackToDefault();
};

//EDIT
const editItem = function (e) {
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  todo.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "edit";
};

//DONE
const doneItem = function (e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  const valueDone = editElement.textContent;
  if (editElement.classList.contains("title-done")) {
    removeFromLocalStorageDone(id);
    editElement.classList.remove("title-done");
    addToLocalStorage(id, valueDone);
  } else {
    removeFromLocalStorage(id);
    editElement.classList.add("title-done");
    addToLocalStorageDone(id, valueDone);
    alertMessage("done!", "success");
  }
};
// ********** LOCAL STORAGE **********
const addToLocalStorage = function (id, value) {
  const todo = { id, value };
  const items = getLocalStorage();
  items.push(todo);
  setLocalStorage(items);
};

const removeFromLocalStorage = function (id) {
  let items = getLocalStorage();
  items = items.filter((item) => {
    if (item.id !== id) {
      return item;
    }
  });
  setLocalStorage(items);
};

const editLocalStorage = function (id, value) {
  let items = getLocalStorage();
  items = items.map((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  setLocalStorage(items);
};

const getLocalStorage = function () {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
};

const setLocalStorage = function (items) {
  localStorage.setItem("list", JSON.stringify(items));
};

// ********** LOCAL STORAGE DONE**********

const addToLocalStorageDone = function (id, value) {
  const todo = { id, value };
  const items = getLocalStorageDone();
  items.push(todo);
  setLocalStorageDone(items);
};

const removeFromLocalStorageDone = function (id) {
  let items = getLocalStorageDone();
  items = items.filter((item) => {
    if (item.id !== id) {
      return item;
    }
  });
  setLocalStorageDone(items);
};

const editLocalStorageDone = function (id, value) {
  let items = getLocalStorageDone();
  items = items.map((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  setLocalStorageDone(items);
};

const getLocalStorageDone = function () {
  return localStorage.getItem("done")
    ? JSON.parse(localStorage.getItem("done"))
    : [];
};
function setLocalStorageDone(items) {
  localStorage.setItem("done", JSON.stringify(items));
}

// ********** SETUP ITEMS **********

const setupItems = function () {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
  let itemsDone = getLocalStorageDone();
  if (itemsDone.length > 0) {
    itemsDone.forEach((item) => {
      createListItem(item.id, item.value);
      list.lastChild.firstChild.classList.add("title-done");
    });
    container.classList.add("show-container");
  }
};

const createListItem = function (id, value) {
  //generate HTML
  element = document.createElement("article");
  const attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add("todo-item");
  element.innerHTML = `<p class="title">${value}</p>
      <div class="btn-container">
      <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
      <button type="button" class="done-btn">
        <i class="fa fa-check-square"></i>
      </button>
      </div>`;
  //DYNAMICLY ADDED BUTTONS
  //data for DELETE function
  const btnDelete = element.querySelector(".delete-btn");
  btnDelete.addEventListener("click", deleteItem);
  //data for EDIT function
  const btnEdit = element.querySelector(".edit-btn");
  btnEdit.addEventListener("click", editItem);
  //data for DONE function
  const btnDone = element.querySelector(".done-btn");
  btnDone.addEventListener("click", doneItem);

  list.appendChild(element);
};

// ********** EVENT LISTENERS **********

form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);
