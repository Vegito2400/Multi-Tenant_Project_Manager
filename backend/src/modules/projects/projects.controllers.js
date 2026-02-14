const projServices = require("./projects.services.js");

const addProject = async (req, res) => {
  try {
    const { name, desc } = req.body;
    if (!name) return res.status(402).json({ message: "Name is required!" });
    const project = await projServices.createProject({
      name,
      desc,
      userId: req.user.id,
      organizationId: req.org.id,
    });
    return res.json(project);
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const data = await projServices.getProj({
      orgId: req.org.id,
      page: Number(page),
      limit: Number(limit),
      search,
    });
    return res.json(data);
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    await projServices.softDeleteProject({
      projectId: req.params.id,
      orgId: req.org.id,
    });
    res.json({ message: "Project Deleted!" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = { addProject, getProjects,deleteProject };
