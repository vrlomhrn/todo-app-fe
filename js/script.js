const todos = [];
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';

const generateId = () => {
    return +new Date();
};

const generateTodoObject = (id, task, timeStamp, isCompleted) => {
    return {
        id,
        task,
        timeStamp,
        isCompleted,
    };
};

const findTodo = (todoId) => {
    for (const todoItem of todos) {
        if (todoItem.id == todoId) {
        return todoItem;
        }
    }
    return null;
};

const findTodoIndex = (todoId) => {
for (const index in todos) {
    if (todos[index].id === todoId) {
    return index;
    }
}
return -1;
};

const isStorageExist = () => {
    if(typeof (Storage) === 'undefined'){
    alert('browser anda tidak mendukung local storage');
    return false;
    }
    return true;
}

const saveData = () => {
    if(isStorageExist()){
        const parsed = JSON.stringify(todos);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const loadDataFromStorage = () => {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if(data !== null){
    for(const todo of data){
        todos.push(todo);
    }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

const makeTodo = (todoObject) => {
    const textTitle = document.createElement('h2');
    textTitle.innerHTML = todoObject.task;

    const textTimeStamp = document.createElement('p');
    textTimeStamp.innerHTML = todoObject.timeStamp;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textTimeStamp);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `todo-${todoObject.id}`);

    if (todoObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', () => {
        undoTaskFromCompleted(todoObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', () => {
        removeTaskFromCompleted(todoObject.id);
        });

        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', () => {
        addTaskToCompleted(todoObject.id);
        });

        container.append(checkButton);
    }
    return container;
};

const addTodo = () => {
    const textTodo = document.getElementById('title').value;
    const timeStamp = document.getElementById('date').value;
    const generateID = generateId();
    const todoObject = generateTodoObject(generateID, textTodo, timeStamp, false);
    todos.push(todoObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

const addTaskToCompleted = (todoId) => {
    const todoTarget = findTodo(todoId);
    if (todoTarget == null) return;
    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

const removeTaskFromCompleted = (todoId) => {
    const todoTarget = findTodoIndex(todoId);
    if (todoTarget === -1) return;
    todos.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

const undoTaskFromCompleted = (todoId) => {
    const todoTarget = findTodo(todoId);
    if (todoTarget == null) return;
    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

document.addEventListener('DOMContentLoaded', () => {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTodo();
    });
    if(isStorageExist()){
        loadDataFromStorage();
    }
});

document.addEventListener(SAVED_EVENT, () => {
    console.log(localStorage.getItem(STORAGE_KEY));
    alert('data berhasil disimpan.');
})

document.addEventListener(RENDER_EVENT, () => {
    console.log(todos);
    const uncompletedTODOList = document.getElementById('todos');
    uncompletedTODOList.innerHTML = '';

    const completedTODOList = document.getElementById('completed-todos');
    completedTODOList.innerHTML = '';

    for (const todoItem of todos) {
        const todoElement = makeTodo(todoItem);
        if (!todoItem.isCompleted) {
        uncompletedTODOList.append(todoElement);
        } else {
        completedTODOList.append(todoElement);
        }
    }
});
