const User=require('../models/users');

exports.getUser = async(req,res)=>{
    let users;
    try{
        users=await User.find();
    }
    catch(err){
        console.log(err);
    }
    if(!users)
    {
        res.status(404).json("No user found!");
    }
    return res.status(200).json({users});
};


