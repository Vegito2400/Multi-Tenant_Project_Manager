const {Router}= require("express");
const authenticate= require("../../middlewares/auth.middleware.js");
const validate= require("../../middlewares/validate.middleware.js");
const requireOrg= require("../../middlewares/org.middleware.js");
// const requireRole= require("../../middlewares/role.middleware.js");
const {createTask,getTasks,updateTask,deleteTask} = require("./tasks.controller.js");
const createTaskSchema = require("./task.schema.js");
const router=Router();

router.post("/",authenticate,requireOrg,validate(createTaskSchema),createTask);
router.get("/",authenticate, requireOrg, getTasks);
router.patch("/:id",authenticate, requireOrg, updateTask);
router.delete("/:id",authenticate,requireOrg, deleteTask);

module.exports=router;