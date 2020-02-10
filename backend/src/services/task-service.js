/**
 * Module dependencies.
 */
import shortid from 'shortid'

import db from "../db";

/**
 * TaskService class is repsonsible for database operations
 * about to Task model.
 */
class TaskService {
  /**
   * Find all tasks
   */
  findAll() {
    return db.get('tasks').value()
  }

  /**
   * Add new task.
   * Task id is auto-generated.
   * 
   * @param {String} title - Taks title
   */
  createTask(title) {
    const createdTask = {
      id: shortid.generate(),
      title,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    db.get('tasks')
      .push(createdTask)
      .write()
    
    return createdTask
  }

  /**
   * Delete task by id.
   * 
   * @param {String} id 
   */
  deleteTaskById(id) {
    const deletedTasks = db.get('tasks')
      .remove({ id })
      .write()

    return deletedTasks[0]
  }

  /**
   * Updat task by id.
   * 
   * @param {String} id - Task id
   * @param {Object} update - key-value pairs of updated fields
   */
  updateTaskById(id, update) {
    update['updatedAt'] = new Date()
    
    const updatedTask = db.get('tasks')
      .find({ id })
      .assign(update)
      .write()

    return updatedTask
  }
}

export default new TaskService()