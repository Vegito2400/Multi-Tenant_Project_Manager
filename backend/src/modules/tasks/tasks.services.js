const prisma = require("../../prisma/client.js");

const createNewTask = async ({
  title,
  description,
  dueDate,
  priority,
  assigneeId,
  projectId,
  orgId,
}) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId: orgId,
      isDeleted: false,
    },
  });
  if (!project) throw new Error("Project not found in the organization");
  if (assigneeId) {
    const membership = prisma.membership.findFirst({
      where: {
        userId: assigneeId,
        organizationId: orgId,
      },
    });
    if (!membership)
      throw new Error("Assignee doesnt belong to the organization");
  }
  return prisma.task.create({
    data: {
      title,
      description,
      projectId,
      assigneeId,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority,
    },
  });
};

const getAllTasks = async ({
  projectId,
  orgId,
  page,
  limit,
  status,
  priority,
}) => {
  const project = await prisma.project.findFirst({
    where: {
      id:projectId,
      organizationId: orgId,
      isDeleted: false,
    },
  });
  if (!project) throw new Error("Project doesnt belong to the org");

  const skip = (page - 1) * limit;
  const where = {
    projectId,
    isDeleted: false,
    ...(status && { status }),
    ...(priority && { priority }),
  };

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy:{createdAt:"desc"},
    }),
    prisma.task.count({where}),
  ]);

  return {
    data:tasks,
    meta:{
        total,
        page,
        limit,
        totalPages : Math.ceil(total/limit),
    }
  }
};

const updateTasks= async ({taskId,updates,orgId,role})=>{
    const task= await prisma.task.findFirst({
        where:{
            id:taskId,
            isDeleted:false,
        },
        include:{
            project:true
        },
    });
    if(!task || task.project.organizationId !== orgId)throw new Error("Task doesnt belong to a project");

    if(updates.assigneeId && !("ADMIN","OWNER").includes(role)){
        throw new Error("Only Admin and Owner can assign tasks");
    }

    if(updates.assigneeId){
        const membership= await prisma.membership.findFirst({
            where:{
                organizationId:orgId,
                userId:updates.assigneeId,
            },
        });
        if(!membership)throw new Error("Assignee doesnt belong to the organization!");
    }

    return prisma.task.update({
        where:{
            id:taskId
        },
        data: updates,
    });
}

const softDeleteTask = async({taskId, orgId})=>{
    const task = await prisma.task.findFirst({
        where:{
            id:taskId,
            isDeleted:false,
        },
        include:{
            project:true,
        }
    });
    if(!task || task.project.organizationId !== orgId){
        throw new Error("Task doesnt belong to the organization");
    }
    return prisma.task.update({
        where:{
            id:taskId,
        },
        data:{
            isDeleted:true,
        }
    });
}

module.exports = { createNewTask, getAllTasks, updateTasks,softDeleteTask };