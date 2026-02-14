const {z}=require("zod");

const createProjSchema = z.object({
    body:z.object({
        name:z.string(),
        description:z.string().optional(),
    })
});

const updateProjSchema= z.object({
    body:z.object({
        id: z.string().uuid(),
    })
});

module.exports={
    createProjSchema,
    updateProjSchema
}