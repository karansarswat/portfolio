function addTask() {
    const taskInput = document.getElementById('new-task');
    const taskList = document.getElementById('task-list');

    if (taskInput.value.trim() !== '') {
        const li = document.createElement('li');
        li.textContent = taskInput.value;

        const removeButton = document.createElement('span');
        removeButton.textContent = '✖';
        removeButton.className = 'remove-task';
        removeButton.onclick = function() {
            taskList.removeChild(li);
        };

        li.appendChild(removeButton);
        taskList.appendChild(li);

        taskInput.value = '';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const taskList = document.getElementById('task-list');
    taskList.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-task')) {
            const li = event.target.parentElement;
            taskList.removeChild(li);
        }
    });
});
