// controllers/taskController.js
const Task = require("../models/Task");

const createTask = async (req, res) => {
  try {
    const task = new Task({ ...req.body, owner: req.user._id });
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send({ error: "Error creating task" });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id });
    res.send(tasks);
  } catch (error) {
    res.status(500).send({ error: "Error fetching tasks" });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }
    res.send(task);
  } catch (error) {
    res.status(400).send({ error: "Error updating task" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }
    res.send({ message: "Task deleted" });
  } catch (error) {
    res.status(500).send({ error: "Error deleting task" });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
