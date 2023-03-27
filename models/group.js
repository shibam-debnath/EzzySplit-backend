const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  groupID: {
    type: Number,
  },
  groupName: {
    type: String,
    require: true,
  },
  groupIcon: {
    type: String,
    require: false,
  },
  userId: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  expenseId: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Expense",
    }
  ],

  total: {
    type: Number,
    default: 0,
  },
});

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
