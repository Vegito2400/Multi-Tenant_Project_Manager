const prisma = require("../../prisma/client.js");

const createProject = async ({ name, desc, userId, organizationId }) => {
  return prisma.project.create({
    data: {
      name,
      description: desc,
      createdBy: userId,
      organizationId: organizationId,
    },
  });
};

const getProj = async ({ orgId, page, limit, search }) => {
  const skip = (page - 1) * limit;
  const where = {
    organizationId: orgId,
    isDeleted: false,
    name: {
      contains: search,
      mode: "insensitive",
    },
  };
  const [project, total] = await Promise.all([
    prisma.project.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.project.count({ where }),
  ]);

  return{
    data:project,
    meta:{
        total,
        page,
        limit,
        totalPages:Math.ceil(total/limit),
    }
  }
};

const softDeleteProject= async ({projectId, orgId})=>{
    const project = await prisma.project.findFirst({
        where:{
            id:projectId,
            organizationId:orgId,
            isDeleted:false,
        }
    });
    if(!project)return res.status(402).json({message:"Project Not Found!"});

    await prisma.project.update({
        where:{id:projectId},
        data:{isDeleted:true},
    });
}

module.exports = { createProject, getProj,softDeleteProject };
