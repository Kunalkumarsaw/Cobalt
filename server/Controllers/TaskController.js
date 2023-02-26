import TaskModel from "../Models/taskModel.js";

import mongoose from "mongoose";
import UserModel from "../Models/userModel.js";

// Creat new Task
export const createTask = async (req, res) => {
  const newTask = new TaskModel(req.body);

  try {
    await newTask.save();
    res.status(200).json("Task created!");
  } catch (error) {
    res.status(500).json(error);
  }
};


// Get a Task
export const getTask = async (req, res) => {
  const id = req.params.id;

  try {
    const Task = await TaskModel.findById(id);
    res.status(200).json(Task);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Update a Task / Edit by Manager
export const updateTask = async (req, res) => {
  const TaskId = req.params.id;
  const { managerId } = req.body;

  try {
    const Task = await TaskModel.findById(TaskId);
    if (Task.managerId === managerId) {
      await Task.updateOne({ $set: req.body });
      res.status(200).json("Task Updated");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Delete a Task
export const deleteTask = async (req, res) => {
  const id = req.params.id;
  const { managerId } = req.body;

  try {
    const Task = await TaskModel.findById(id);
    if (Task.managerId === managerId) {
      await Task.deleteOne();
      res.status(200).json("Task deleted successfully");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// add or Remove Worker to a Task
export const addUser = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const Task = await TaskModel.findById(id);
    if (!Task.userIds.includes(userId)) {
      await Task.updateOne({ $push: { userIds: userId } });
      res.status(200).json("User add to Task " + id);
    } else {
      await Task.updateOne({ $pull: { userIds: userId } });
      res.status(200).json("User not added to Task " + id);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Progress added by User
export const addProgress = async (req, res) => {
  const id = req.params.id;
  const { userId, image } = req.body;

  try {
    const Task = await TaskModel.findById(id);
    const userIds = Task.userIds;
    console.log(userIds)
    if (userIds.find((user)=> user === userId)) {
      await Task.updateOne({
        $push: {
          updates: {
            userId: userId,
            image: image,
          },
        },
      });
      res.status(200).json("Progress added to Task " + id);
    } else {
      res
        .status(400)
        .json("User can add progress as he/she is not worker of " + id);
    }
  } catch (error) {
    console.log("Error in catch")
    res.status(500).json(error);
  }
};

// Change Task to completed / add points to user
export const markTaskDone = async (req, res) => {
  const TaskId = req.params.id;
  const { managerId } = req.body;

  try {
    const Task = await TaskModel.findById(TaskId);
    if (Task.managerId === managerId) {
      await Task.updateOne({ progress: "done" });

      // Rewards for this Task
      const taskRewards = Task.point;
      const allUsers = Task.userIds;
      // console.log(taskRewards);
      // console.log(allUsers);

      // Update each user score with new score
      for(let i = 0 ; i < allUsers.length ; i++) {
        const User = await UserModel.findById(allUsers[i]);
        const prevScore = User.score;
        await User.updateOne({ score: prevScore + taskRewards });
        // console.log(User)
      };
      // await User.save();

      res.status(200).json("Task DONE " + Task);
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get Task with Manager Ids with date sorting

export const getTaskByManager = async (req, res) => {
  const managerId = req.params.id;

  const { filter } = req.body;

  try {
    let Tasks;
    if (filter === "all") {
      console.log("Inside all filter")
      Tasks = await TaskModel.find({ managerId: managerId });
    } else {
      console.log("Inside specific filter");
      Tasks = await TaskModel.find({ managerId: managerId, progress: filter });
    }

    res.status(200).json(
      Tasks.sort((a, b) => {
        return b.createdAt - a.createdAt;
      })
    );
  } catch (error) {
    res.status(500).json(error);
  }
};




// Get Task by User Ids with date sorting
export const getTaskByUser = async (req, res) => {
  const userId = req.params.id;

  const { filter } = req.body;

  try {
    let Tasks;
    if (filter === "all") {
      console.log("Inside all filter")
      Tasks = await TaskModel.find({
        userIds: {
          $exists: true,
          $elemMatch: { $eq: userId },
        },
      });
    } else {
      console.log("Inside specific filter")
      Tasks = await TaskModel.find({
        userIds: {
          $exists: true,
          $elemMatch: { $eq: userId },
        },
        progress: filter,
      });
    }

    res.status(200).json(
      Tasks.sort((a, b) => {
        return b.createdAt - a.createdAt;
      })
    );
  } catch (error) {
    res.status(500).json(error);
  }
};