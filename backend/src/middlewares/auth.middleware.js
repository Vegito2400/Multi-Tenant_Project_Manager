// const generateToken=require("../utils/jwt.js");
const jwt= require("jsonwebtoken");

function authenticate(req,res,next){
    const authHeaders= req.headers.authorization;

    if(!authHeaders){
        return res.status(401).json({message:"no token provided"});
    }

    const token= authHeaders.split(" ")[1];

    try{
        const decoded= jwt.verify(token,process.env.JWT_SECRET);
        req.user={id:decoded.userId};
        next();
    }
    catch(err){
        return res.status(401).json({message:"Invalid Token"});
    }
}

module.exports=authenticate;