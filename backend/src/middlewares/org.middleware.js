const prisma = require("../prisma/client.js");

const requireOrg = async (req, res, next) => {
  try {
    const orgId = req.headers["x-org-id"];
    if(!orgId)res.status(401).json({message:"Organization not found!"});

    const membership = await prisma.membership.findUnique({
        where:{
            userId_organizationId:{
                userId: req.user.id,
                organizationId: orgId,
            }
        }
    });
    if(!membership)res.status(403).json({message:"Access denied to org!"});

    req.org={
        id:orgId,
        role: membership.role,
    };
    next();
  } catch (err) {
    return res.status(400).json({message:err.message});
  }
};

module.exports=requireOrg;