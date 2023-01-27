// const User = require("../models/users");
const Group = require("../models/group");
const User = require("../models/users");
const send = require("./sendmail");
const { getUser } = require("../controllers/user");

exports.createGroup = async (req, res) => {
    try {
        const groupName = req.body.groupName;
        //    userId from frontend
        const userId = "63cad572fc525e91b9544d1b";
        if (req.file) {
            groupIcon = req.file.path
            console.log("Image added")
        }

        const result = await Group.create(
            {
                groupName,
                groupIcon
            }
        );
        const addeduser = await result.addUserInGroup(userId);
        console.log(addeduser);

        console.log(result);
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
        console.log(groupID);
        const userGroup = await Group.findOne({ _id: groupID });
        console.log(userGroup);

        const addeduser = await userGroup.addUserInGroup(userId);
        // console.log(addeduser);
        res.status(202).json({ message: "User added in group" });

    } catch (error) {
        console.log(error);
        res.status(404).json({ error: "error in adding users" });
    }
}
