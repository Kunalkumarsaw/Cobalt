import express from "express";
import { addProgress, addUser, createTask, deleteTask, getTask, getTaskByManager, getTaskByUser , markTaskDone, updateTask } from "../Controllers/TaskController.js";

const router  = express.Router();


router.post("/", createTask);
router.get("/:id", getTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.put("/:id/addUser", addUser);
router.put("/:id/addProgress", addProgress);
router.put("/:id/markTaskDone" , markTaskDone);

router.get("/:id/managerTasks", getTaskByManager);
router.get("/:id/userTasks", getTaskByUser);


export default router;