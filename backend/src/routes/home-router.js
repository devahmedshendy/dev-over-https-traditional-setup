/**
 * Module dependencies.
 */
import { Router } from "express";
import { ensureLoggedIn } from "../middlewares";

// Create express router
const router = Router();

/**
 * GET /home
 */
router.get('/', function(req, res, next) {
  res.json({ success: true })
});

export default router;
