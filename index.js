const form = getID("todoform");
const todolist = getID("todolist");
const todolistchecked = getID("todolistchecked");
const infotask = getID("infoTask");
const infoAction = getID("infoAction");
const addInput = document.querySelector("form#todoform input.addInput");
const errorAlert = document.querySelector("div.alert");
const error = document.querySelector("p.error");
const dismissButton = document.querySelector("div.alert span.dismiss-alert");

form.addEventListener("submit", e => {
  e.preventDefault();
  let formInput = document.querySelector(`form#${e.target.id} .addInput`);
  let addButton = document.querySelector(`form#${e.target.id} button`);
  let inputData = formInput.value;
  if (validateInput(inputData, addButton)) {
    buttonLoading(addButton);
    createTodoItem(inputData);
    infotask.innerText = inputData.trim();
    infoAction.innerText = "añadida";
    infoAction.style.color = "green";
    addInput.value = "";
    buttonLoading(addButton, false);
  }
});

todolist.addEventListener("click", e => {
  if (e.target.className === "delete") {
    if (confirm("¿Estas seguro de querer borrarlo?")) {
      const audio = new Audio("sounds/deleteSound.mp3");
      audio.currentTime = 1.5;
      audio.play();
      let todoItem = e.target.parentNode.parentNode;
      let todoItemValue = todoItem.firstElementChild.innerText;
      todoItem.classList.add("fadeOutDeleted");
      setTimeout(() => {
        todolist.removeChild(todoItem);
        infoTask.innerText = todoItemValue.trim();
        infoAction.innerText = "borrada";
        infoAction.style.color = "red";
      }, 2000);
    }
  } else if (e.target.className === "check") {
    if (confirm("¿Estas seguro de dar la tarea por finalizada?")) {
      const item = e.target.parentNode.parentNode;
      item.classList.add("fadeOutChecked");
      const audio = new Audio("sounds/successSound.mp3");
      audio.play();
      setTimeout(() => {
        item.removeChild(item.children[1]); //Remove div that have buttons
        const itemCopy = item.cloneNode(true);
        itemCopy.classList.add("checked");
        const spanForDate = document.createElement("span");
        spanForDate.classList.add("finishedDate");
        spanForDate.innerText = `${new Date().toLocaleDateString()} ~ ${new Date().toLocaleTimeString()} `;
        itemCopy.appendChild(spanForDate);
        todolistchecked.appendChild(itemCopy);
        item.remove();
        setTimeout(() => {
          itemCopy.classList.remove("fadeOutChecked");
        }, 500);
      }, 500);
    }
  }
});

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

    const audio = new Audio("sounds/errorSound.mp3");
    audio.play();
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
    let count = 0;
    while (count < 3) {
      let span = document.createElement("span");
      span.innerText = ".";
      button.appendChild(span);
      count++;
    }
    button.classList.add("saving");
  } else {
    button.innerHTML = "Nueva tarea";
    button.classList.remove("saving");
  }
}

function urlTransformer(url) {
  console.log("Transforming URL: %s", url);
  return "http://goodsite.com/goodimage.jpg";
}

// Takes in an element ID or class name and either modifies it or strips it by returning null
function classIdTransformer(name) {
  console.log("Transforming Class/Id: %s", name);

  if (name !== "myImage") {
    return name;
  }
}
