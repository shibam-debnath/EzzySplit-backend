const User = require("../models/users");
const send = require("./sendmail");

exports.getUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const users = await User.find({ _id: userId });
    return res.status(200).json({ users });
  } catch (err) {
    console.log(err);
    res.status(404).json("No user found!");
  }
};

exports.adduser = async (req, res) => {
  try {
    const text=`Hey ${req.body.name}! Nice to see you here`;
    await send.sendmail(req.body.emailId,text);

    const result = await User.create({
      emailId: req.body.emailId,
      password: req.body.password,
      name: req.body.name,
      groupid:[]
    });

    res.status(201).json({ result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
};
