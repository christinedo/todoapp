let todoItems = [];
let count = 0;

let todoInput = document.getElementById("todoInput");
todoInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && (todoInput.value != "")) {
    todoItems.push(todoInput.value);
    console.log(todoItems);

    addNewListItem();
    displayCount();

    todoInput.value = "";
    document.getElementById("main").style.display = "block";
    document.getElementById("toggleArrow").checked = false;
  }
});

function displayCount() {
  if (todoItems.length == 0) {
    document.getElementById("main").style.display = "none";
  }

  if (count == 1) {
    document.getElementById("todoCount").textContent = "1 item left";
  } else {
    document.getElementById("todoCount").textContent = count + " items left";
  }
}

function addNewListItem() {
  let newLi = document.createElement("li");
  let newCheckbox = document.createElement("input");
  let newLabel = document.createElement("label");
  let newRemove = document.createElement("button");
  let todoInputText = document.getElementById("todoInput").value;
  let list = document.getElementById("list");

  newCheckbox.setAttribute("type", "checkbox");
  newCheckbox.setAttribute("class", "toggleBox");

  newRemove.setAttribute("class", "remove");

  newLabel.setAttribute("class", "todoContent");

  list.appendChild(newLi);
  newLi.appendChild(newCheckbox);
  newLi.appendChild(newLabel);
  newLi.appendChild(newRemove);

  newLabel.insertAdjacentText("afterbegin", todoInputText);

  if (document.getElementById("completedFilter").classList.contains("on")) {
    newLi.classList.add("hide");
  }
  count++;
}

function toggleCompletedBtn() {
  let checkboxes = Array.from(document.querySelectorAll("input[type=checkbox]"));
  checkboxes.some(function(item) {
    if (item.checked) {
      document.getElementById("clearCompleted").setAttribute("style", "display: block");
      return true;
    }
    document.getElementById("clearCompleted").style.display = "none";
  })
}

document.addEventListener("click", (e) => {
  let completedFilterBtn = document.getElementById("completedFilter");
  let activeFilterBtn = document.getElementById("activeFilter");
  let allFilterBtn = document.getElementById("allFilter");
  let checkboxes = document.querySelectorAll("input[type=checkbox]");
  if (e.target.id == "completedFilter") {
    e.target.classList.add("on");
    activeFilterBtn.classList.remove("on");
    allFilterBtn.classList.remove("on");

    for (let item of checkboxes) {
      item.parentNode.classList.toggle("hide", !item.parentNode.classList.contains("completed"));
    }
  }

  if (e.target.id == "activeFilter") {
    e.target.classList.add("on");
    completedFilterBtn.classList.remove("on");
    allFilterBtn.classList.remove("on");

    for (let item of checkboxes) {
      item.parentNode.classList.toggle("hide", item.parentNode.classList.contains("completed"));
    }
  }

  if (e.target.id == "allFilter") {
    e.target.classList.add("on");
    completedFilterBtn.classList.remove("on");
    activeFilterBtn.classList.remove("on");

    for (let item of checkboxes) {
      item.parentNode.classList.remove("hide");
    }
  }

  if (e.target.id == "clearCompleted") {
    for (let item of checkboxes) {
      if (item.parentNode.classList.contains("completed")) {
        let lookupItem = item.nextSibling.textContent;
        let position = todoItems.indexOf(lookupItem);

        todoItems.splice(position, 1);
        item.parentNode.remove();
        document.getElementById("clearCompleted").style.display = "none";
      }
    }
    console.log(todoItems);
    displayCount();
  }

  if (e.target.classList.contains("remove")) {
    let lookupItem = e.target.previousSibling.textContent;
    let position = todoItems.indexOf(lookupItem);

    todoItems.splice(position, 1);
    e.target.parentNode.remove();

    if (!e.target.parentNode.classList.contains("completed")) {
      count--;
    }

    console.log(todoItems);
    toggleCompletedBtn();
    displayCount();
  }
})

document.addEventListener("change", (e) => {
  let completedFilterBtn = document.getElementById("completedFilter");
  let activeFilterBtn = document.getElementById("activeFilter");
  if (e.target.classList.contains("toggleBox")) {
    e.target.parentNode.classList.toggle("completed", e.target.checked);
    e.target.checked ? count-- : count++;

    if ((!e.target.checked && completedFilterBtn.classList.contains("on")) ||
      (e.target.checked && activeFilterBtn.classList.contains("on"))) {
      e.target.parentNode.classList.add("hide");
    }

    if (count == 0) {
      document.getElementById("toggleArrow").checked = true;
    } else {
      document.getElementById("toggleArrow").checked = false;
    }

    toggleCompletedBtn();
    displayCount();
  }

  if (e.target.id == "toggleArrow") {
    let checkboxes = document.querySelectorAll("input[type=checkbox]");
    if (e.target.checked) {
      checkboxes.forEach(function(currentValue, currentIndex) {
        currentValue.checked = true;
        if (currentIndex > 0) {
          currentValue.parentNode.setAttribute("class", "completed");
          count = 0;
        }
      })
    } else {
      checkboxes.forEach(function(currentValue, currentIndex) {
        currentValue.checked = false;
        if (currentIndex > 0) {
          currentValue.parentNode.classList.remove("completed");
          count++;
        }
      })
    }

    if (completedFilterBtn.classList.contains("on")) {
      checkboxes.forEach(function(currentValue, currentIndex) {
        if (currentIndex > 0) {
          currentValue.parentNode.classList.toggle("hide", !e.target.checked);
        }
      })
    }

    if (activeFilterBtn.classList.contains("on")) {
      checkboxes.forEach(function(currentValue, currentIndex) {
        if (currentIndex > 0) {
          currentValue.parentNode.classList.toggle("hide", e.target.checked);
        }
      })
    }
    displayCount();
    toggleCompletedBtn();
  }
})

document.addEventListener("dblclick", (e) => {
  if (e.target.classList.contains("todoContent")) {
    let editInput = document.createElement("input");
    editInput.setAttribute("class", "edit");
    e.target.parentNode.classList.add("editing");
    e.target.parentNode.appendChild(editInput);
    editInput.value = e.target.textContent;
    editInput.focus();

    let lookupItem = editInput.value;
    let position = todoItems.indexOf(lookupItem);

    let onEdit = (e) => {
      if (e.target.value == "") {
        e.target.parentNode.remove();
        todoItems.splice(position, 1);
        count--;
        displayCount();
      } else {
        let newContent = editInput.value;
        e.target.previousSibling.previousSibling.textContent = newContent;
        todoItems.splice(position, 1, newContent);
        e.target.parentNode.classList.remove("editing");
        editInput.remove();
      }
      console.log(todoItems);
    }

    let blurHandler = (e) => {
      onEdit(e);
    }

    editInput.addEventListener("keydown", (e) => {
      if (e.key == "Enter") {
        editInput.removeEventListener("blur", blurHandler);
        onEdit(e);
      }
    })

    editInput.addEventListener("blur", blurHandler);
  }
})
