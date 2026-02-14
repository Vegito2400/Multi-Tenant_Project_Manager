const authService= require("./auth.services.js");

const register = async (req,res)=>{
  try{
    await authService.register(req.body);
    return res.status(201).json({message:"User registered successfully!"});
  }catch(err){
    res.status(400).json({message: err.message});
  }
}

const login = async (req, res) => {
  try {
    const token = await authService.login(req.body);
    return res.json({token});
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

module.exports={
  login,
  register
};