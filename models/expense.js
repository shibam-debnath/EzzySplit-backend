const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  amount: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  notes: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  groupId: {
    type: String,
    require: true,
  },
  paidBy: [
    {
    userId:{
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    amount:{
      type: String,
      default:"0"
    },
    name:{
      type: String,
      require:false
    }
  }
  ],
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
      toPay: {
        type: Number,
        default: 0,
      },
      paid: {
        type: Number,
        default: 0,
      },
    },
  ],
});

// module.exports = mongoose.model("Expense", expenseSchema);
const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;
