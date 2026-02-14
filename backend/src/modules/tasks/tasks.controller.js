const { task } = require("../../prisma/client.js");
const taskServices = require("./tasks.services.js");

const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assigneeId, projectId } =
      req.body;
    if (!title || !projectId)
      throw new Error("Title and project Id are mandatory");

    const task = await taskServices.createNewTask({
      title,
      description,
      dueDate,
      priority,
      assigneeId,
      projectId,
      orgId: req.org.id,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const { projectId, page = 1, limit = 10, status, priority } = req.query;
    if (!projectId) throw new Error("Project ID is required!");
    const tasks = await taskServices.getAllTasks({
      projectId,
      orgId: req.org.id,
      page: Number(page),
      limit: Number(limit),
      status,
      priority,
    });
    console.log(tasks);
    return res.json(tasks);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await taskServices.updateTasks({
      taskId: req.params.id,
      updates: req.body,
      orgId: req.org.id,
      role: req.org.role,
    });
    res.json(task);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const deleteTask = async(req,res)=>{
    try{
        const taskId= req.params.id;
        const orgId=  req.org.id;
        const task = await taskServices.softDeleteTask({
            taskId,
            orgId
        });
        res.json(task);
    }catch(err){
        return res.status(400).json({message:err.message});
    }
}

module.exports = { createTask, getTasks, updateTask, deleteTask };