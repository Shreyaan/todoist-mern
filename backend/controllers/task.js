import Task from "../models/Task.js";
import createError from "../utils/createError.js";

export const createTask = async (req, res, next) => {
  try {
    const newTask = new Task({
      title: req.body.title,
      user: req.user.id,
      completed: req.user.completed,
    });

    const savedTask = await newTask.save();
    return res.status(201).json(savedTask);
  } catch (err) {
    return next(err);
  }
};

export const getAllTasks = async (req, res, next) => {
  try {
    const allTasks = await Task.find({ user: req.user.id }).select();
    return res.status(200).json(allTasks);
  } catch (err) {
    return next(err);
  }
};
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId).exec();
    if (!task) return next(createError(404, "no task given"));
    if (task.user.toString() !== req.user.id)
      return next(createError(401, "not your task"));
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      {
        title: req.body.title,
        completed: req.body.completed,
      },
      { new: true }
    );
    return res.status(200).json(updatedTask);
  } catch (err) {
    return next(err);
  }
};
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId).exec();
    if (!task) return next(createError(404, "no task given"));
    if (task.user.toString() !== req.user.id)
      return next(createError(401, "not your task"));
    const updatedTask = await Task.findByIdAndDelete(req.params.taskId);
    return res.status(200).json("task deleted");
  } catch (err) {
    return next(err);
  }
};
