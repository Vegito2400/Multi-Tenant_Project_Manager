const orgServices = require("./organizations.services.js");
// const orgServices = require("./organizations.services.js");

const createOrganization = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) res.status(401).json({ message: "Name Not Found!" });

    const organization = await orgServices.createOrg({
      name,
      userId: req.user.id,
    });
    // if(!organization)
    res.status(201).json(organization);
    // res.json({organization});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getUserOrganizations = async (req, res) => {
  try {
    const orgs = await orgServices.getOrgs(req.user.id);
    // if(!orgs){
    //     res.status(401).json({message:"No orgs found"})
    // }
    res.json(orgs);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const changeRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;
    const update = await orgServices.changeUserRole({
      userId,
      newRole,
      orgId: req.params.orgId,
      reqRole: req.org.role,
    });
    return res.json(update);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const addUser = async (req, res) => {
  try {
    const { email, role, userId } = req.body;
    const result = await orgServices.addNewUser({
      email,
      role,
      userRole: req.org.role,
      orgId: req.params.orgId,
    });
    return res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createOrganization,
  getUserOrganizations,
  changeRole,
  addUser,
};
