<?php
$filename = 'tasks.json';

// Read tasks from file
function readTasks() {
    global $filename;
    if (file_exists($filename)) {
        return json_decode(file_get_contents($filename), true);
    } else {
        return [];
    }
}

// Save tasks to file
function saveTasks($tasks) {
    global $filename;
    file_put_contents($filename, json_encode($tasks));
}

// Handle different actions
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'read':
        $tasks = readTasks();
        echo json_encode($tasks);
        break;

    case 'create':
        $text = $_POST['text'] ?? '';
        if ($text !== '') {
            $tasks = readTasks();
            $newTask = [
                'id' => time(),
                'text' => $text,
                'completed' => false
            ];
            $tasks[] = $newTask;
            saveTasks($tasks);
            echo json_encode($newTask);
        }
        break;

    case 'toggle':
        $id = $_GET['id'] ?? '';
        $tasks = readTasks();
        foreach ($tasks as &$task) {
            if ($task['id'] == $id) {
                $task['completed'] = !$task['completed'];
                break;
            }
        }
        saveTasks($tasks);
        break;

    case 'delete':
        $id = $_GET['id'] ?? '';
        $tasks = readTasks();
        $tasks = array_filter($tasks, function($task) use ($id) {
            return $task['id'] != $id;
        });
        saveTasks($tasks);
        break;

    default:
        echo json_encode(['error' => 'Invalid action']);
        break;
}
?>
