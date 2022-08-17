import express from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
} from "../controllers/task.js";

const router = express.Router();

router.post("/", createTask);
router.get("/all", getAllTasks);
router.put("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);

export default router;
