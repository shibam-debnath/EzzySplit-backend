const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  emailId: {
    type: String,
    required: true,
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  groupid:[{
    type: mongoose.Types.ObjectId ,
    ref:"Group",
    required: false,
  }],
  prevGroups:[{
    type: mongoose.Types.ObjectId ,
    ref:"Group",
    required: false,
  }],
  totalAmountToPay: {
    type: Number,
    default: 0,
  },
  totalAmountpaid: {
    type: Number,
    default: 0,
  },
  totalAmountRecieved: {
    type: Number,
    default: 0,
  },
  totalAmountPaidToOthers: {
    type: Number,
    default: 0,
  },
  // array of all Payment Details of Paid
  allPaymentDetailsofPaid: [
    {
      paidBy: {
        type: String,
      },
      users: [String],
      expensetitle: String,
      amount: Number,
      date: {
        type: Date,
        default: Date.now(),
      },
      returnedMoney: [String],
    },
  ],

  paymentRecievedDetails: [
    {
      recievedFrom: String,
      amountRecieved: Number,
      recievedFor: String,
      paidDate: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  myPaymentsToOthers: [
    {
      amount: Number,
      paidTo: String,
      paidFor: String,
      date: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
