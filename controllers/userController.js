const User = require("../models/users");

exports.getUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId);
    const users = await User.find({ _id: userId });
    if(!users){
      res.status(404).json("No user found!");
    }
    return res.status(200).json({ users });
  } catch (err) {
    console.log(err);
    res.status(404).json("No user found!");
  }
};

exports.adduser = async (req, res) => {
  try {
    const result = await User.create({
      emailId: req.body.emailId,
      password: req.body.password,
      name: req.body.name,
    });
    res.status(201).json({ result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
};
