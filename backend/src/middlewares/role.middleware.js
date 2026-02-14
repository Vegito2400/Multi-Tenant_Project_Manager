const requireRole= (...allowedRoles)=>{
    return (req,res,next)=>{
        if(!req.org || !req.org.role){
            return res.status(401).json({message:"Organization context not found!"});
        }
        if(!allowedRoles.includes(req.org.role)){
            return res.status(402).json({message:"Role not allowed"});
        }
        next();
    };
};

module.exports= requireRole;