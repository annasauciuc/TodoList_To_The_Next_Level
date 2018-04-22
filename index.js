//ACTIVE DOM ELEMENTS
const form = getID("todoform");
(todolist = getID("todolist")),
  (todolistchecked = getID("todolistchecked")),
  (actionHistorial = document.querySelector("div.actionHistorial")),
  (dropdownTasks = document.querySelector("div.dropdownTasks a ")),
  (addInput = document.querySelector("form#todoform input.addInput")),
  (errorAlert = document.querySelector("div.alert")),
  (error = document.querySelector("p.error")),
  (dismissButton = document.querySelector("div.alert span.dismiss-alert"));

//AUDIOS
const deleteAudio = new Audio("sounds/deleteSound.mp3"),
  errorAudio = new Audio("sounds/errorSound.mp3"),
  successAudio = new Audio("sounds/successSound.mp3"),
  pingAudio = new Audio("sounds/pingSound.mp3");

dropdownTasks.addEventListener("click", toggleTasksDropdown);

form.addEventListener("submit", e => {
  e.preventDefault();
  let formInput = document.querySelector(`form#${e.target.id} .addInput`),
    addButton = document.querySelector(`form#${e.target.id} button`),
    inputData = formInput.value;

  if (validateInput(inputData, addButton)) {
    buttonLoading(addButton);
    //FAKE LOAD EFFECT DELAY TO IMPROVE THE UX
    setTimeout(() => {
      createTodoItem(inputData);
      createHistorialAction(inputData, "added");
      addInput.value = "";
      buttonLoading(addButton, false);
    }, 900);
  }
});

function toggleTasksDropdown(e) {
  e.preventDefault();
  //Esto es para elegir el elemento i dependiendo de si se clicka
  //en el elemento "a" o el propio icono "i"

  let selectedIcon = e.target.tagName === "A" ? e.target.children[0] : e.target;
  (classToRemove = ""), (classToAdd = "");

  if (selectedIcon.classList.contains("fa-arrow-down")) {
    classToRemove = "fa-arrow-down";
    classToAdd = "fa-arrow-up";
    actionHistorial.classList.add("expanded");
  } else {
    classToRemove = "fa-arrow-up";
    classToAdd = "fa-arrow-down";
    actionHistorial.classList.remove("expanded");
  }
  console.log(actionHistorial.classList);
  selectedIcon.classList.remove(classToRemove);
  selectedIcon.classList.add(classToAdd);
}

function createHistorialAction(inputData, type) {
  const spanFragment = document.createDocumentFragment();
  h4 = document.createElement("h4");
  let actionType = "",
    backgroundColor = "",
    icon = "";

  switch (type) {
    case "added":
      actionType = "añadida";
      backgroundColor = "rgb(189, 189, 11)";
      icon = "fa-exclamation";
      break;
    case "checked":
      actionType = "terminada";
      backgroundColor = " #0c990c";
      icon = "fa-check";
      break;
    case "deleted":
      actionType = "borrada";
      backgroundColor = "#a11e12";
      icon = "fa-times";
      break;
  }

  h4.innerHTML = `<i class="fas ${icon}"></i> ${inputData.trim()} ha sido ${actionType} con éxito el ${new Date().toLocaleDateString()}  `;
  h4.style.backgroundColor = backgroundColor;
  actionHistorial.appendChild(h4);
  h4.scrollIntoView({ block: "end", behavior: "smooth" });
}
todolist.addEventListener("click", e => {
  if (e.target.className === "delete") {
    if (confirm("¿Estas seguro de querer borrarlo?")) {
      deleteAudio.currentTime = 1.5;
      deleteAudio.play();
      let todoItem = e.target.parentNode.parentNode;
      deleteItem(todoItem);
    }
  } else if (e.target.className === "check") {
    if (confirm("¿Estas seguro de dar la tarea por finalizada?")) {
      const item = e.target.parentNode.parentNode;
      checkItem(item);
    }
  }
});

function deleteItem(todoItem) {
  let todoItemValue = todoItem.firstElementChild.innerText;
  todoItem.classList.add("fadeOutDeleted");
  setTimeout(() => {
    todolist.removeChild(todoItem);
    createHistorialAction(todoItemValue, "deleted");
  }, 2000);
}

function checkItem(item) {
  item.classList.add("fadeOutChecked");
  successAudio.play();
  setTimeout(() => {
    item.removeChild(item.children[1]); //Remove div that have buttons

    const itemCopy = item.cloneNode(true);
    const itemTaskData = itemCopy.children[0].innerText;
    itemCopy.classList.add("checked");

    const spanForDate = document.createElement("span");
    spanForDate.classList.add("finishedDate");
    spanForDate.innerText = `${new Date().toLocaleDateString()} ~ ${new Date().toLocaleTimeString()} `;

    itemCopy.appendChild(spanForDate);
    todolistchecked.appendChild(itemCopy);
    item.remove();
    console.log(itemCopy);
    setTimeout(() => {
      itemCopy.classList.remove("fadeOutChecked");
      createHistorialAction(itemTaskData, "checked");
    }, 500);
  }, 500);
}

dismissButton.addEventListener(
  "click",
  e => {
    e.target.parentNode.style.display = "none";
  },
  false
);

function createTodoItem(inputData) {
  const fragment = document.createDocumentFragment();
  let li = document.createElement("li");
  let sanitized = html_sanitize(
    inputData.trim(),
    urlTransformer,
    classIdTransformer
  );
  li.innerHTML = `<p>${sanitized}</p>`;
  li.classList.add("todoitem");
  let wrapperDivButtons = document.createElement("div");

  let checkButton = createTodoButton({
    text: "Hecho",
    className: "check",
    attribute: "Finalizar la tarea"
  });

  let deleteButton = createTodoButton({
    text: "Borrar",
    className: "delete",
    attribute: "Borrar la tarea"
  });

  wrapperDivButtons.appendChild(checkButton);
  wrapperDivButtons.appendChild(deleteButton);
  li.appendChild(wrapperDivButtons);
  fragment.appendChild(li);
  todolist.appendChild(fragment);
  pingAudio.play(); //Confirm the added item
}

function validateInput(inputData, addButon) {
  if (inputData.trim() === "" || typeof inputData === null) {
    addButon.setAttribute("disabled", true);
    setTimeout(() => {
      addButon.removeAttribute("disabled");
    }, 1000);
    setTimeout(() => {
      errorAlert.style.display = "none";
    }, 3000);

    errorAudio.play();
    errorAlert.style.display = "block";
    error.innerText = "No se puede añadir una tarea vacia";
    return false;
  }
  return true;
}

function createTodoButton(data) {
  let button = document.createElement("button");
  button.innerText = data.text;
  button.classList.add(data.className);
  button.setAttribute("title", data.attribute);
  return button;
}
function getID(id) {
  return document.getElementById(id);
}

function buttonLoading(button, load = true) {
  if (load) {
    button.innerText = "";
    let count = 0,
      spanFragment = document.createDocumentFragment();
    while (count < 3) {
      let span = document.createElement("span");
      span.innerText = ".";
      spanFragment.appendChild(span);
      count++;
    }
    button.appendChild(spanFragment);
    button.classList.add("saving");
  } else {
    button.innerHTML = "Nueva tarea";
    button.classList.remove("saving");
  }
}

function urlTransformer(url) {
  console.log("Transforming URL: %s", url);
  return "https://conniejjasperson.files.wordpress.com/2015/08/keep-calm-and-say-you-fool-you-damn-fool.png";
}

// Takes in an element ID or class name and either modifies it or strips it by returning null
function classIdTransformer(name) {
  console.log("Transforming Class/Id: %s", name);

  if (name !== "myImage") {
    return name;
  }
}
