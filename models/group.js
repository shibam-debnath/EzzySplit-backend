const { Schema, default: mongoose } = require("mongoose");

const groupSchema = new Schema({
  groupID: {
    type: Number,
  },
  groupName: {
    type: String,
    require: true,
  },
  groupIcon:{
    type:String,
    require:false,
  },
  userId: [
    {
        type: mongoose.Types.ObjectId,
        ref:"User"
    }
  ],
  expenses: [
    {
      // array of expensesId's using which the expense can be accessed
      id: {
        type: String,
        require: true,
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
    },
  ],
  total: {
    type: Number,
    default: 0,
  },
});


const Group = mongoose.model("groups", groupSchema);
module.exports = Group;
