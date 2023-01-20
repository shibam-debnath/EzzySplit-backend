const { Schema, default: mongoose } = require("mongoose");

const groupSchema = new Schema({
  groupID: {
    type: Number,
  },
  groupName: {
    type: String,
    require: true,
  },
  userId: [
    {user:{
      type:String
    }}
  ],
  // tokens:[
  //     {token:{

  //     }}
  // ],

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


groupSchema.methods.addUserInGroup = async function(userId){
  try {
    this.userId = this.userId.concat({user:userId});
    await this.save();
    return userId;
    
  } catch (error) {
    console.log(`Error in adding user in group : ${error}`);
  }
 
}

const Group = mongoose.model("groups", groupSchema);
module.exports = Group;
