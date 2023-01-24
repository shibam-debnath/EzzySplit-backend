// const User = require("../models/users");
const Group = require("../models/group");

exports.createGroup = async(req,res)=>{
    try {
        const groupName = req.body.groupName;
    //    userId from frontend
        const userId = "63cad572fc525e91b9544d1b";
        const result = await Group.create(
            {
                groupName
            }
        );
        const addeduser = await result.addUserInGroup(userId);
        console.log(addeduser);

        console.log(result);
        res.status(201).json({message:"group created"});
        
    } catch (error) {
        console.log(error);
        res.status(404).json({error:"error in creating group"});
    }
}

exports.addusers = async(req,res)=>{
    try {
        const groupID = req.params.groupid;
        const userId = req.body.userId;
        const userGroup = await Group.findOne({_id:groupID});
        console.log(userGroup);
        const addeduser = await userGroup.addUserInGroup(userId);
        console.log(addeduser);
        res.status(202).json({message:"User added in group"});

    } catch (error) {
        console.log(error);
        res.status(404).json({error:"error in adding users"});
    }
}

