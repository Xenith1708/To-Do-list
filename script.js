// Keep every task in this array while the page is open.
let todos = [];
// Remember which filter button is currently selected.
let currentFilter = "all";

// Load saved tasks when the page first opens.
function loadTodos() {
  const savedTodos = localStorage.getItem("todos");

  if (savedTodos !== null) {
    todos = JSON.parse(savedTodos).map(function (todo) {
      return { text: todo.text, completed: todo.completed };
    });
  }
}

// Save the current task array so it survives a page refresh.
function saveToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Add the text from the input as a new task.
function addTodo(event) {
  event.preventDefault();

  const todoInput = document.getElementById("todo-input");
  const todoText = todoInput.value.trim();

  if (todoText !== "") {
    todos.push({ text: todoText, completed: false });
    todoInput.value = "";
    saveToLocalStorage();
    showTodos();
  }
}

// Choose a filter and mark its button as selected.
function setFilter(filterName, clickedButton) {
  currentFilter = filterName;

  const filterButtons = document.getElementsByClassName("filter-button");
  for (let i = 0; i < filterButtons.length; i++) {
    filterButtons[i].classList.remove("selected");
  }

  clickedButton.classList.add("selected");
  showTodos();
}

// Decide if a task belongs in the currently selected filter.
function shouldShowTodo(todo) {
  if (currentFilter === "active") {
    return todo.completed === false;
  } else if (currentFilter === "completed") {
    return todo.completed === true;
  }

  return true;
}

// Draw the visible tasks.
function showTodos() {
  const todoList = document.getElementById("todo-list");
  todoList.textContent = "";

  // Create a visible list row for each task that matches the selected filter.
  todos.forEach(function (todo) {
    if (!shouldShowTodo(todo)) {
      return;
    }

    const listItem = document.createElement("li");
    listItem.className = "todo-item";

    if (todo.completed) {
      listItem.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", function () {
      todo.completed = checkbox.checked;
      saveToLocalStorage();
      showTodos();
    });

    const todoText = document.createElement("span");
    todoText.className = "todo-text";
    todoText.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function () {
      todos = todos.filter(function (item) {
        return item !== todo;
      });
      saveToLocalStorage();
      showTodos();
    });

    listItem.appendChild(checkbox);
    listItem.appendChild(todoText);
    listItem.appendChild(deleteButton);
    todoList.appendChild(listItem);
  });
}

// Connect form and button events to the functions above.
document.getElementById("todo-form").addEventListener("submit", addTodo);

const filterButtons = document.getElementsByClassName("filter-button");
for (let i = 0; i < filterButtons.length; i++) {
  // Use the button's data-filter value when it is clicked.
  // Pass the clicked button and its filter name to setFilter.
  filterButtons[i].addEventListener("click", function () {
    setFilter(filterButtons[i].dataset.filter, filterButtons[i]);
  });
}

// Restore saved tasks and show the initial list.
loadTodos();
showTodos();
