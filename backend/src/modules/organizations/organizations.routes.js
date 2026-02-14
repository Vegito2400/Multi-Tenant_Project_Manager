const {Router}=require("express");
const authenticate=require("../../middlewares/auth.middleware.js");
const validate = require("../../middlewares/validate.middleware.js");
const {createOrgSchema,roleChangeSchema,addUserSchema}= require("./organizations.schema.js");
const {createOrganization,getUserOrganizations,changeRole,addUser}=require("./organizations.controller.js");
const requireOrg=require("../../middlewares/org.middleware.js");
const requireRole=require("../../middlewares/role.middleware.js");

const router= Router();

router.post("/",authenticate,validate(createOrgSchema),createOrganization);
router.get("/",authenticate,getUserOrganizations);
router.patch("/:orgId",authenticate,requireOrg,requireRole("OWNER","ADMIN"),validate(roleChangeSchema),changeRole);
router.post("/:orgId/members",authenticate,requireOrg,requireRole("ADMIN","OWNER"),validate(addUserSchema),addUser);

module.exports=router;