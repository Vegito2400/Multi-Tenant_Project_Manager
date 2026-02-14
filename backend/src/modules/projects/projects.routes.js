const {Router}= require("express");
const authenticate= require("../../middlewares/auth.middleware.js");
const requireOrg= require("../../middlewares/org.middleware.js");
const requireRole= require("../../middlewares/role.middleware.js");
const validate = require("../../middlewares/validate.middleware.js");
const {
    createProjSchema,
    updateProjSchema
}=require('./projects.schema.js');
const {addProject,getProjects,deleteProject} = require("./projects.controllers.js");

const router= Router();

router.post("/",authenticate,requireOrg,requireRole("ADMIN","OWNER"),validate(createProjSchema), addProject);
router.get("/",authenticate, requireOrg, getProjects);
router.delete("/:id",authenticate,requireOrg,requireRole("OWNER","ADMIN"),deleteProject);
// router.patch("/:id",)

module.exports=router;