// const User = require("../models/users");
const Group = require("../models/group");
const User = require("../models/users");
const send = require("./sendmail");
const { getUser } = require("../controllers/user");
const { findByIdAndUpdate } = require("../models/group");


exports.getGroup = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        // console.log(userId);
        const group = await Group.findById({ _id: groupId }).populate("expenseId").populate('userId');
        console.log(group);
        return res.status(200).json({ group });
    } catch (err) {
        console.log(err);
        res.status(404).json("No such group found!");
    }
};


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

exports.settleExpenses = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const group = await Group.findById({ _id: groupId }).populate("expenseId");

        if (!group) {
            res.status(201).json("Group doesn't exist");
        }
        else {
            
            var eachTotal = group.total;
            const number = group.userId.length;
            eachTotal = eachTotal / number;
            // console.log(number);
            // console.log(eachTotal);

            const eachExpended = {};
            for (var i = 0; i < number; i++)eachExpended[group.userId[i]] = 0;
            console.log(eachExpended);
            // console.log("khatam");

            const individual = {};
            for (var i = 0; i < number; i++)individual[group.userId[i]] = 0;

            for (var i = 0; i < group.expenseId.length; i++) {
                for (var j = 0; j < group.expenseId[i].paidBy.length; j++) {
                    const value = Number(eachExpended[group.expenseId[i].paidBy[j].userId]);
                    eachExpended[group.expenseId[i].paidBy[j].userId] = value + Number(group.expenseId[i].paidBy[j].amount);

                }
                if (group.expenseId[i].split_method && group.expenseId[i].split_method == "amount") {
                    for (var k = 0; k < group.expenseId[i].split_between.length; k++) {
                        const temp = group.expenseId[i].split_between[k];
                        // console.log(temp.userId);
                        var value = Number(individual[temp.userId]);
                        value = value + Number(temp.amount);
                        // console.log(temp.amount);
                        // console.log(value);
                        individual[temp.userId] = value;
                    }
                }
                else {
                    const equal = group.expenseId[i].amount / number;
                    for (var k = 0; k < number; k++) {
                        var value = individual[group.userId[k]];
                        value = Number(value) + Number(equal);
                        console.log(group.userId[k]);
                        console.log(value);
                        individual[group.userId[k]] = value;
                    }
                }
            }
            console.log("individual");
            console.log(individual);

            // console.log(eachExpended);

            for (let [key, value] of Object.entries(eachExpended)) {
                eachExpended[key] = Number(value) - Number(individual[key]);
            }
            // console.log(eachExpended);

            const pos = [];
            const neg = [];
            const payment = [];//payer,receiver,amount

            for (let [key, value] of Object.entries(eachExpended)) {
                if (value >= 0) pos.push([value, key]);
                else neg.push([value, key]);
            }

            while (pos.length > 0 && neg.length > 0) {
                pos.sort((a, b) => a[0] - b[0]);
                neg.sort((a, b) => a[0] - b[0]);
                // console.log(pos);
                // console.log(neg);

                const n = pos.length - 1;
                const posValue = pos[n][0];
                const negValue = neg[0][0];

                const change = Math.min(posValue, Math.abs(negValue));
                pos[pos.length - 1][0] -= change;
                neg[0][0] += change;

                payment.push({'payer':neg[0][1], 'receiver': pos[n][1], 'amount':change});

                if (pos[n][0] == 0) pos.pop();
                if (neg[0][0] == 0) neg.shift();


            }

            // console.log("payment");
            // console.log(payment);
            
            res.status(201).json(payment);
        }

    } catch (error) {
        console.log(error);
        res.status(422).json("Something went wrong");
    }
}
