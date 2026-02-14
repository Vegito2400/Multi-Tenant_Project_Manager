const {z}=require("zod");

const createOrgSchema = z.object({
    body:z.object({
        name:z.string().min(2),
    })
});

const roleChangeSchema = z.object({
    body:z.object({
        newRole:z.enum(["OWNER","ADMIN","MEMBER"]),
        userId:z.string().uuid(),
    })
});

const addUserSchema = z.object({
    body: z.object({
        email:z.email(),
        role:z.enum(["ADMIN","OWNER","MEMBER"])
    }),
    params: z.object({
        orgId:z.string().uuid(),
    })
});

module.exports={
    createOrgSchema,
    roleChangeSchema,
    addUserSchema
};