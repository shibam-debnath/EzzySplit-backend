const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  id: {
    type: String,
    // require: true,
  },
  amount: {
    type: String,
    require: true,
  },
  notes: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  groupId: {
    type: String,
    require: true,
  },
  split_method: {
    type: String,
    enum: ["equally", "amounts"],
    require: true,
  },
  split_between: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      paid: {
        type: Number,
      },
    },
  ],
});

module.exports = mongoose.model("expenses", expenseSchema);
