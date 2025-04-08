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

// Example usage of the Task class
// Create an instance of the Task class
let task1 = new Task("Buy groceries", "Purchase milk, eggs, and bread.");
console.log(task1.toString()); // Display the task details

// Mark the task as completed
task1.markAsCompleted();
console.log(task1.toString()); // Display the updated task details

// Update the task details
task1.updateTaskDetails("Buy groceries and snacks", "Purchase milk, eggs, bread, and chips.");
console.log(task1.toString()); // Display the updated task details

// Export the Task class for use in other files
export default Task;