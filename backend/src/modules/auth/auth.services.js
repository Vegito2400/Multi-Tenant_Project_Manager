const bcrypt= require("bcrypt");
const prisma = require("../../prisma/client.js");
const generateToken=require("../../utils/jwt.js");

const login= async ({email,password})=>{
    const loginUser = await prisma.user.findUnique({where:{email}});
    if(!loginUser)throw new Error("User not found!");
    const isValid= await bcrypt.compare(password,loginUser.passwordHash);
    if(!isValid){
        throw new Error("Invalid Password");
    }
    // else{
    //     // return console.error("Invalid Password!");   
    //     throw new Error("Invalid Password");
    // }
    const token= generateToken({userId:loginUser.id});
    console.log(token);
    return token;
};

const register=async ({name,email,password})=>{
    const existingUser= await prisma.user.findUnique({where:{email}});
    if(existingUser)throw new Error("User already exists");

    const hashedPassword= await bcrypt.hash(password,10);
    await prisma.user.create({
data:{        name,
        email,
        passwordHash:hashedPassword}
    });

    return;
}

module.exports={
    login,
    register,
};