const express= require("express");
const validate = require("../../middlewares/validate.middleware.js");
const {registerSchema, loginSchema}= require("./auth.schema.js");
const router= express();
const {login,register}=require("./auth.controllers.js");

router.post("/register",validate(registerSchema),register);

router.post("/login",validate(loginSchema),login);

module.exports= router;