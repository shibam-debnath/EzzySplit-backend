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

  isSettled: {
    type: Boolean,
    default: false,
  },

  creator: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },

  createdOn: {
    type: Date,
    default: Date.now(),
  },
});

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
