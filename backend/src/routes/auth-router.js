/**
 * Module dependencies.
 */
import { Router } from "express";

import { authenticate, unauthenticate, ensureLoggedIn } from "../middlewares";

// Create express router
const router = Router()

/**
 * GET /auth/verify
 * 
 * It helps frontend to test if its authenticated or not
 * (Since cookies are set as httpOnly).
 */
router.get('/verify', ensureLoggedIn, (req, res) => {
  res.json({ success: true })
})

/**
 * POST /auth/authenticate
 * 
 * Create JWT token and set it as cookie.
 */
router.post('/authenticate', authenticate)

/**
 * POST /auth/unauthenticate
 * 
 * Clear JWT token cookie.
 */
router.post('/unauthenticate', unauthenticate)

export default router
