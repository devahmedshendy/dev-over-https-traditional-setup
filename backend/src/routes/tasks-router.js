/**
 * Module dependencies.
 */
import { Router } from "express";

import { taskService } from "../services";
import { ensureLoggedIn } from "../middlewares";

// Create express router
const router = Router()

/**
 * GET /tasks
 */
router.get('/', (req, res) => {
  const tasks = taskService.findAll()

  res.json({success: true, data: tasks})
})

/**
 * POST /tasks
 */
router.post('/', ensureLoggedIn, (req, res) => {
  const { title } = req.body

  if (!title) {
    return res.status(400).json({
      success: false,
      errors: [
        "Task's title is missing"
      ]
    })
  }

  const newTask = taskService.createTask(title)
  
  res.json({ success: true, data: newTask })
})

/**
 * PUT /tasks/:id
 */
router.put('/:id', ensureLoggedIn, (req, res) => {
  const { id } = req.params
  const update = req.body

  const updatedTask = taskService.updateTaskById(id, update)
  
  res.json({ success: true, data: updatedTask })
})

/**
 * DELETE /tasks/:id
 */
router.delete('/:id', ensureLoggedIn, (req, res) => {
  const { id } = req.params

  const deletedTask = taskService.deleteTaskById(id)
  
  res.json({ success: true, data: deletedTask })
})

export default router