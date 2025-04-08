// Task class definition in objects.js
// This class is used to manage tasks in a simple task management application.

class Task {
    /**
     * Constructor to initialize a task object.
     * @param {string} title - The title of the task.
     * @param {string} description - A brief description of the task.
     * @param {boolean} [completed=false] - The completion status of the task (default is false).
     */
    constructor(title, description, completed = false) {
        this.title = title; // Title of the task
        this.description = description; // Description of the task
        this.completed = completed; // Completion status of the task
    }

    /**
     * Marks the task as completed.
     */
    markAsCompleted() {
        this.completed = true;
    }

    /**
     * Updates the task details.
     * @param {string} newTitle - The new title of the task.
     * @param {string} newDescription - The new description of the task.
     */
    updateTaskDetails(newTitle, newDescription) {
        this.title = newTitle;
        this.description = newDescription;
    }

    /**
     * Returns a string representation of the task.
     * @returns {string} - A string describing the task.
     */
    toString() {
        return `Task: ${this.title}\nDescription: ${this.description}\nCompleted: ${this.completed}`;
    }
}

/**
 * TaskManager function to manage a list of tasks.
 * @returns {object} - An object with methods to manage tasks.
 */
function TaskManager() {
    const tasks = []; // Array to store tasks

    return {
        /**
         * Adds a new task to the task manager.
         * @param {Task} task - The task to add.
         */
        addTask(task) {
            tasks.push(task);
        },

        /**
         * Removes a task from the task manager by title.
         * @param {string} title - The title of the task to remove.
         */
        removeTask(title) {
            const index = tasks.findIndex(task => task.title === title);
            if (index !== -1) {
                tasks.splice(index, 1);
            }
        },

        /**
         * Returns all tasks in the task manager.
         * @returns {Task[]} - Array of tasks.
         */
        getTasks() {
            return tasks;
        }
    };
}

// Export the Task class and TaskManager function for use in other files
export { Task, TaskManager };