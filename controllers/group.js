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
      groupIcon = req.file.path;
    }

    const result = await Group.create({
      groupName,
      groupIcon,
    });
    const addeduser = await result.addUserInGroup(userId);

    if (req.file) {
      res.status(201).json({ message: "group created with groupIcon" });
      return;
    }

    res.status(201).json({ message: "group created without icon" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "error in creating group" });
  }
};

exports.inviteUserInGroup = async (req, res) => {
  const groupID = req.params.groupid;
  const userId = req.body.userId;
  const userGroup = await Group.findOne({ _id: groupID });

  var users;
  try {
    users = await User.find({ _id: userId });
    if (!users) {
      res.status(201).json("No user found!");
      return;
    }

    var text = `Hey ${users[0].name}! You are invited to join the ${userGroup.groupName}`;
    await send.sendmail(users[0].emailId, text);
    res.status(201).json("Invitation sent to the user");
  } catch (err) {
    console.log(err);
    res.status(404).json("Something went wrong");
  }
};

exports.addusers = async (req, res) => {
  try {
    const groupID = req.params.groupid;
    const userId = req.body.userId;

    const userGroup = await Group.findOne({ _id: groupID });
    const addeduser = await userGroup.addUserInGroup(userId);
    res.status(202).json({ message: "User added in group" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "error in adding users" });
  }
};
