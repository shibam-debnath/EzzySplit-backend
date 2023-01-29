// const User = require("../models/users");
const Group = require("../models/group");
const User = require("../models/users");
const send = require("./sendmail");
const { getUser } = require("../controllers/user");

exports.createGroup = async (req, res) => {
    try {
        const groupName = req.body.groupName;
        let groupIcon = req.body.groupIcon;
        //    userId from frontend
        const userId = "63cad5a6fc525e91b9544d25";

        if (req.file) {
            groupIcon = req.file.path
            console.log("Image added")
        }

        // console.log(`userId: ${userId}`);
        const result = await Group.create(
            {
                groupName,
                groupIcon
            }
        );
        if(!result){
            res.status(422).json({error:"error in ceating group"});
        }
        // console.log(`Result: ${result}`);
        // Adding current user in Current group created
        result.userId.push(userId);
        await result.save();

        // Adding grouId in user schema
        const rguser = await User.findById({_id:userId});
        if(!rguser){
            res.status(422).json({error:"User doesn't exist"});
        }
        rguser.groupid.push(result._id);
        await rguser.save();

        // const addeduser = await result.addUserInGroup(userId);
        // console.log(addeduser);

        if (req.file) {
            res.status(201).json({ message: "group created with groupIcon" });
            return;
        }

        res.status(201).json({ message: "group created without icon" });

    } catch (error) {
        console.log(error);
        res.status(404).json({ error: "error in creating group" });
    }
}

exports.inviteUserInGroup = async (req, res) => {
    try {

        // console.log(emailId);
        const groupID = req.params.groupid;
        const userId = req.body.userId;
        // console.log(groupID);
        const userGroup = await Group.findOne({ _id: groupID });
        // console.log(userGroup);

        var users;
        try {
            users = await User.find({ _id: userId });
        } catch (err) {
            console.log(err);
            res.status(404).json("Something went wrong");
        }

        if (!users) {
            res.status(201).json("No user found!");
            return;
        }

        console.log(users[0].emailId);

        var text = `Hey ${users[0].name}! You are invited to join the ${userGroup.groupName}`;
        await send.sendmail(users[0].emailId, text);

        res.status(201).json("Invitation sent to the user");

    } catch (error) {
        console.log(error);
        res.status(404).json("Something went wrong");
    }
}

exports.addusers = async (req, res) => {
    try {
        const groupID = req.params.groupid;
        const userId = req.body.userId;

        // adding user id to group
        const userGroup = await Group.findOne({ _id: groupID });
        if(!userGroup){
            res.status(404).json({ error:"Group doesn't exist" });
        }
        userGroup.userId.push(userId);
        await userGroup.save();
        
        // adding group id to user
        const rgUser = await User.findById({_id:userId});
        if(!rgUser){
            res.status(404).json({ error:"User doesn't exist" });
        }
        rgUser.groupid.push(groupID);
        await rgUser.save();

        res.status(202).json({ message: "User added in group" });

    } catch (error) {
        console.log(error);
        res.status(404).json({ error: error });
    }
}
