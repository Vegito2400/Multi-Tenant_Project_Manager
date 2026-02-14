const prisma = require("../../prisma/client.js");
const { Role } = require("@prisma/client");

const createOrg = async ({ name, userId }) => {
  const organization = await prisma.organization.create({
    data: {
      name,
      createdBy: userId,
    },
  });

  await prisma.membership.create({
    data: {
      userId,
      organizationId: organization.id,
      role: Role.OWNER,
    },
  });

  return organization;
};

const getOrgs = async (userId) => {
  const org = await prisma.membership.findMany({
    where: { userId },
    include: {
      organization: true,
    },
  });
  return org.map((o) => ({
    id: o.organization.id,
    name: o.organization.name,
    role: o.role,
  }));
};

const changeUserRole = async ({ userId, newRole, orgId, reqRole }) => {
  const org = await prisma.membership.findFirst({
    where: {
      userId: userId,
      organizationId: orgId,
    },
  });
  if (!org) throw new Error("membership not found");
  if (reqRole == "ADMIN" && newRole != "MEMBER")
    throw new Error("Admin can only modify Member roles");
  return prisma.membership.update({
    where: {
      userId_organizationId: {
        userId: userId,
        organizationId: orgId,
      },
    },
    data: {
      role: newRole,
    },
  });
};

const addNewUser = async({email,role,userRole,orgId})=>{
    const user= await prisma.user.findFirst
({
    where:{
        email
    }
});
    if(!user)throw new Error("User doesnt exists");
    const membership = await prisma.membership.findUnique({
        where:{
            userId_organizationId:{
                userId:user.id,
                organizationId:orgId
            }
        }
    });
    if(membership)throw new Error("User already exists in the organization");
    await prisma.membership.create({
        data:{
            userId:user.id,
            organizationId:orgId,
            role,
        }
    });
};

module.exports = { createOrg, getOrgs, changeUserRole,addNewUser };
