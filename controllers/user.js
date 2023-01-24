const User = require("../models/users");
const send = require("./sendmail");

exports.getUser = async (req, res) => {
  try {
    const userId = req.params.emailId;
    const users = await User.find({ emailId: userId });
    return res.status(200).json({ users });
  } catch (err) {
    console.log(err);
    res.status(404).json("No user found!");
  }
};

exports.adduser = async (req, res) => {
  try {
    await send.welcome(req.body.emailId, req.body.name);

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
