document.addEventListener("DOMContentLoaded", function() {
    const todoForm = document.getElementById("todoForm");
    const newTaskInput = document.getElementById("newTask");
    const taskList = document.getElementById("taskList");

    // Load tasks on page load
    loadTasks();

    // Add new task
    todoForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const taskText = newTaskInput.value.trim();
        if (taskText !== "") {
            addTask(taskText);
            newTaskInput.value = "";
        }
    });

    // Load tasks from the server
    function loadTasks() {
        fetch("todo.php?action=read")
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = "";
                tasks.forEach(task => {
                    appendTask(task.id, task.text, task.completed);
                });
            });
    }

    // Append a task to the list
    function appendTask(id, text, completed) {
        const li = document.createElement("li");
        li.dataset.id = id;
        li.classList.toggle("complete", completed);

        li.innerHTML = `
            <span>${text}</span>
            <div>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        
        taskList.appendChild(li);

        // Delete task
        li.querySelector(".delete-btn").addEventListener("click", function() {
            deleteTask(id);
        });

        // Mark as completed
        li.addEventListener("click", function() {
            toggleTaskComplete(id);
        });
    }

    // Add task to the server
    function addTask(text) {
        fetch("todo.php?action=create", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `text=${encodeURIComponent(text)}`
        })
        .then(response => response.json())
        .then(task => {
            appendTask(task.id, task.text, task.completed);
        });
    }

    // Toggle task complete status
    function toggleTaskComplete(id) {
        fetch(`todo.php?action=toggle&id=${id}`)
            .then(() => loadTasks());
    }

    // Delete task
    function deleteTask(id) {
        fetch(`todo.php?action=delete&id=${id}`)
            .then(() => loadTasks());
    }
});
