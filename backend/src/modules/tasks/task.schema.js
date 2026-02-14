const {z} =require("zod");

const createTaskSchema = z.object({
    body:z.object({
        title:z.string().min(1),
        description:z.string().optional(),
        priority:z.enum(["LOW","MEDIUM","HIGH"]).optional(),
        dueDate:z.string().optional(),
        projectId:z.string().uuid(),
        assigneeId:z.string().uuid().optional(),
    }),
});

module.exports=createTaskSchema;