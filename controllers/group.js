// const User = require("../models/users");
const Group = require("../models/group");
const User = require("../models/users");
const send = require("./sendmail");
const { getUser } = require("../controllers/user");
const { findByIdAndUpdate } = require("../models/group");

exports.createGroup = async (req, res) => {
  try {
    const groupName = req.body.groupName;
    let groupIcon = req.body.groupIcon;
    //    userId from frontend
    const userId = req.body.userId;

    if (req.file) {
      groupIcon = req.file.path;
      console.log("Image added");
    }

    // console.log(`userId: ${userId}`);
    const result = await Group.create({
      groupName,
      groupIcon,
    });
    if (!result) {
      res.status(422).json({ error: "error in ceating group" });
    }
    // console.log(`Result: ${result}`);
    // Adding current user in Current group created
    result.userId.push(userId);
    await result.save();

    // Adding grouId in user schema
    const rguser = await User.findById({ _id: userId });
    if (!rguser) {
      res.status(422).json({ error: "User doesn't exist" });
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
    res.status(422).json({ error: "error in creating group" });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const groupId = req.params.groupid;
    const groupDetails = await Group.findById({ _id: groupId }).populate(
      "userId"
    );
    if (!groupDetails) {
      res.status(422).json({ error: "Group doesn't exist" });
    } else {
      groupDetails.userId.map(async (val) => {
        // console.log(val);
        const userDet = await User.findById({ _id: val._id });
        userDet.groupid.pull(groupId);
        await userDet.save();
        userDet.prevGroups.push(groupId);
        await userDet.save();
        console.log(userDet);
      });
      res.status(200).send(groupDetails);
    }
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: "error in creating group" });
  }
};

// Here we have to add AUTHENTICATION >> so that only group admin can edit
exports.editGroupName = async (req, res) => {
  try {
    const groupId = req.params.groupid;
    const groupName = req.body.groupName;

    if (!groupName) {
      res.status(422).send({ error: "Error in updating group" });
    } else {
      const currGroup = await Group.findByIdAndUpdate(
        { _id: groupId },
        {
          groupName: groupName,
        }
      );
      if (!currGroup) {
        res.status(422).send({ error: "Error in updating group" });
      }

      res.status(200).json({ message: "Group edited successfully" });
    }
  } catch (error) {
    console.log(`Error in editing Group : ${error}`);
    res.status(422).json({ error: "Error in creating group" });
  }
};

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
};

exports.addusers = async (req, res) => {
  try {
    const groupID = req.params.groupid;
    const userId = req.body.userId;

    const userGroup = await Group.findOne({ _id: groupID });
    const rgUser = await User.findById({ _id: userId });

    if (!userGroup) {
      res.status(422).json({ error: "Group doesn't exist" });
    } else if (!rgUser) {
      res.status(422).json({ error: "User doesn't exist" });
    } else {
      console.log(`userGroup: ${userGroup}`);
      console.log(`UserGroup.UserId: ${userGroup.userId}`);
      // Finding in array of userId in group that user already exist or not
      const isUserExist = await userGroup.userId.find(function (element) {
        return element == userId;
      });
      console.log(`isUserExist: ${isUserExist}`);
      if (isUserExist) {
        res.status(422).json({ error: "User alredy exist" });
      } else {
        // adding user id to group
        userGroup.userId.push(userId);
        await userGroup.save();

        // adding group id to user
        rgUser.groupid.push(groupID);
        await rgUser.save();

        res.status(200).json({ message: "User added in group" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: error });
  }
};

// Here we have to add AUTHENTICATION >> so that only admin can delete
exports.deleteUserFromGroup = async (req, res) => {
  try {
    const userId = req.params.userid;
    const groupId = req.params.groupid;

    const grp = await Group.findById({ _id: groupId });
    const userToDel = await User.findById({ _id: userId });

    if (!grp || !userToDel) {
      res.status(422).json({ error: "Error in deleting user" });
    } else {
      await grp.userId.pull(userId);
      await grp.save();

      await userToDel.groupid.pull(groupId);
      await userToDel.save();

      res.status(200).json({ message: "User removed from group" });
    }
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: "Error in deleting user" });
  }
};

exports.getAllGroups = async (req, res) => {
  try {
    const userId = req.params.userid;
    const currUser = await User.findById({ _id: userId }).populate("groupid");
    if (!currUser) {
      res.status(422).json({ error: "User doesn't exist" });
    } else {
      res.status(200).send(currUser);
    }
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: "Error in fetching groups" });
  }
};

exports.getAllUserOfCurrentGroup = async (req, res) => {
  try {
    const groupId = req.params.groupid;
    const groupDetails = await Group.findById({ _id: groupId }).populate(
      "userId"
    );
    if (!groupDetails) {
      res.status(422).json({ error: "Group doesn't exist" });
    } else {
      res.status(200).send(groupDetails);
    }
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: "Error in fetching groups" });
  }
};

exports.getPreviousGroups = async (req, res) => {
  try {
    const userId = req.params.userid;
    const currUser = await User.findById({ _id: userId }).populate(
      "prevGroups"
    );
    if (!currUser) {
      res.status(422).json({ error: "Group doesn't exist" });
    } else {
      res.status(200).send(currUser);
    }
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: "Error in fetching groups" });
  }
};

exports.deletePreviouGroup = async (req, res) => {
  try {
    const userId = req.params.userid;
    const groupId = req.params.groupid;
    const currUser = await User.findById({ _id: userId });
    if (!currUser) {
      res.status(422).json({ error: "User doesn't exist" });
    } else {
      currUser.prevGroups.pull(groupId);
      await currUser.save();

      res.status(200).json({ message: "Group deleted successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: "Error in deleting groups" });
  }
};
