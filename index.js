// Selecting elements
const addTask = document.getElementById("add-task")
const taskIcon = document.getElementById("task-icon")
const emptyTask = document.getElementById("empty-tasks")
const taskInput = document.getElementById('task-input')
const taskList = document.getElementById('task-list')
const addButton = document.getElementById('add-btn')
const form = document.getElementById('form')
const completedTasksBox = document.getElementById('completed-tasks')

// Event listener for input focus
taskInput.addEventListener('focus', (e) => {
    console.log("Input focused")
    if (taskInput.placeholder === "Add a task" && taskIcon.classList.contains('fa-plus')) {
        addTask.style.outline = "2px solid rgba(108, 124, 189, 0.41)"
        taskInput.placeholder = "Try typing 'Pay utility bills by 6pm Friday'"
        taskIcon.className = 'far fa-circle'
        addButton.style.visibility = "visible"
    }
})

// Event listener for input blur
taskInput.addEventListener('blur', (e) => {
    console.log("Input blurred")
    addTask.style.outline = "none"
    taskInput.placeholder = "Add a task"
    taskIcon.className = 'fa-solid fa-plus'
    addButton.style.visibility = "hidden"
})

let tasks = []

// Handling form data
form.addEventListener('submit', addNewTask)
addButton.addEventListener('click', addNewTask)

function addNewTask(event) {
    event.preventDefault()
    console.log("Form submitted")

    let taskText = taskInput.value.trim()
    console.log("Task input value:", taskText)

    if (taskText.length === 0) {
        alert("Enter a task")
    } else {
        const task = {
            text: taskText,
            date: new Date().toLocaleString(),
            completed: false
        };
        tasks.push(task)
        console.log("Task added:", task)
    }
    localStorage.setItem("addedTasks", JSON.stringify(tasks))
    form.reset()
    fetchItems()
}

// Fetching data from local storage
function fetchItems() {
    if (localStorage.getItem("addedTasks")) {
        tasks = JSON.parse(localStorage.getItem("addedTasks"))
    }
    printItemsOnUI()
}
fetchItems()

// Print data from local storage to UI
function printItemsOnUI() {
    if (tasks.length === 0) {
        taskList.style.display = "none"
        emptyTask.style.display = "flex"
    } else {
        taskList.style.display = "flex"
        emptyTask.style.display = "none"
    }
    taskList.innerHTML = ''
    tasks.forEach((taskItem, index) => {
        let taskElement = document.createElement('div')
        taskElement.classList.add('task')
        taskElement.setAttribute(`id`, `${index}`)

        let taskContent = document.createElement('div')
        taskContent.classList.add('task-content')
        
        let taskState = document.createElement(`div`)
        taskState.classList.add('task-state')

        let textGroup = document.createElement(`div`)
        textGroup.classList.add(`text-group`)

        let unCheckedIcon = document.createElement("i")
        unCheckedIcon.classList.add("fa-regular", "fa-circle")
        unCheckedIcon.setAttribute("data-action", "check")

        let checkedIcon = document.createElement("i")
        checkedIcon.classList.add("fa-solid", "fa-circle-check")
        checkedIcon.setAttribute("data-action", "check")

        let tasksTitle = document.createElement(`h3`)
        tasksTitle.innerText = `${taskItem.text}`
        tasksTitle.setAttribute("data-action", "title")

        let tasksDate = document.createElement(`p`)
        tasksDate.innerText = `${taskItem.date}`
        tasksDate.setAttribute("data-action", "date")

        const actions = document.createElement('div')
        actions.classList.add('actions')

        const editIcon = document.createElement(`i`)
        editIcon.classList.add(`fas`, `fa-pen-to-square`)
        editIcon.setAttribute("data-action", "edit")
        

        const deleteIcon = document.createElement('i')
        deleteIcon.classList.add('fas', 'fa-trash-can')
        deleteIcon.setAttribute("data-action", "delete")
        

        // Append
        if(!taskItem.completed){
            taskState.append(unCheckedIcon)
            textGroup.append(tasksTitle)
            textGroup.append(tasksDate)
            taskContent.append(taskState)
            taskContent.append(textGroup)
            actions.append(editIcon)
            actions.append(deleteIcon)
            taskElement.append(taskContent)
            taskElement.append(actions)
            taskList.append(taskElement)
        }else {
            taskState.append(checkedIcon)
            textGroup.append(tasksTitle)
            textGroup.append(tasksDate)
            taskContent.append(taskState)
            taskContent.append(textGroup)
            actions.append(editIcon)
            actions.append(deleteIcon)
            taskElement.append(taskContent)
            taskElement.append(actions)
            taskList.append(taskElement)
            tasksTitle.style.textDecoration = "line-through"
        }        
    })
}

taskList.addEventListener(`click`, targetTaskItem)
function targetTaskItem(e){
    let userTarget = e.target
    let greatGrandParentElement = userTarget.closest(".task") //<div class="task">(The closest() method of the Element interface traverses the element and its parents (heading toward the document root) until it finds a node that matches the specified CSS selector.)
    if(!greatGrandParentElement)return

    let taskID = Number(greatGrandParentElement.id)
    let clickedAction = userTarget.dataset.action

    if(clickedAction === "check"){
        checkTaskItem(taskID)
    }

    if(clickedAction === "delete"){
        // Show confirmation dialog before deleting task
        if (confirm("Are you sure you want to delete this task?")) {
            deleteTaskItem(taskID);
        }
    }
}

function  checkTaskItem(ID){
    tasks = tasks.map(function(taskObject, index){
        if(index === ID){
            return{
                text : taskObject.text,
                date : taskObject.date,
                completed : !taskObject.completed
            }
        }else{
            return{
                text : taskObject.text,
                date : taskObject.date,
                completed : taskObject.completed
            }
        }
    })

    printItemsOnUI()

}

function deleteTaskItem(ID) {
    // Create a new array that excludes the task with the matching taskID
    tasks = tasks.filter(function(task, index) {
        return index !== ID;
    });

    // Update local storage with the new array of tasks
    localStorage.setItem("addedTasks", JSON.stringify(tasks));

    // Refresh the task list by calling printItemsOnUI
    printItemsOnUI();
}

// Delete tasks from array and update UI and local storage

