// Model
const Expense = require("../models/expense");
const Group = require("../models/group");

// Function 1 : AddExpense handler
const addExpense = async (req, res) => {
  try {
    const groupId = req.body.groupId;
    console.log(`GrpID: ${groupId}`);
    const ourGroup = await Group.findById({ _id: groupId });
    console.log(`ourGroup: ${ourGroup}`);
    // console.log(ourGroup);
    if (!ourGroup) {
      return res.status(500).send("Group not found");
    }

    // * if everything ok then create new expense
    const newExpense = await Expense.create({
      amount: req.body.amount,
      description: req.body.description,
      groupId: req.body.groupId,
      paidBy: req.body.paidBy,
      split_method: req.body.split_method,
      split_between: req.body.split_between,
      notes: req.body.notes,
      expDate:req.body.expDate,
      category:req.body.category
    });
    // save new expense to db
    await newExpense.save();
    // console.log(`newExp: ${newExpense}`);
    ourGroup.expenseId.push(newExpense._id);
    ourGroup.total = Number(ourGroup.total) + Number(req.body.amount);
    await ourGroup.save();
    // console.log(`ourGrp lst:: ${ourGroup}`);
    // console.log(newExpense);
    // // ! Update the expense in Group
    // ourGroup.expenses.push(newExpense._id);
    // const done = await ourGroup.save();
    // console.log(done);
    res.status(200).json(ourGroup);
  } catch (err) {
    console.log(err);
    res.status(404).json(err);
  }
};

// Function 2 : UpdateExpense handler
const updateExpense = async (req, res) => {
  // access requirements from req
  try {
    const { userid,groupid,expenseid } = req.params;

  const ourGroup = await Group.findById({ _id: groupid });
  if(!ourGroup){
    return res.status(422).json({error:"Group doesn't exist"});
  }
  else{
    const expense = await Expense.findById({ _id: expenseid });
    if(!expense){
      return res.status(422).json({error:"Expense doesn't exist"});
    }
    const upExpense = await Expense.findByIdAndUpdate({_id:expenseid},{
      amount: req.body.amount ,
      description: req.body.description,
      groupId: req.body.groupId,
      paidBy: req.body.paidBy,
      split_method: req.body.split_method,
      split_between: req.body.split_between,
      notes: req.body.notes,
      expDate:req.body.expDate}
      );
    if(!upExpense){
      return res.status(422).json({error:"Error in updating expenses"});
    }

    ourGroup.total = Number(ourGroup.total) - Number(req.body.prevAmount) + Number(req.body.amount);
    await ourGroup.save();
    return res.status(200).send({upExpense});
  }
  } catch (error) {
    return res.status(422).json({error:"Error occured in editing expense"});
  }
};

// Function 3 : deleteExpense handler
const deleteExpense = async (req, res) => {
  // const userId = req.user;
  const expenseId = req.params.expenseId;
  console.log(expenseId);
  const expense = await Expense.findOne({ _id: expenseId });
  
  if (!expense) {
    return res.status(404).send({ error: "Expense not found!" });
  } else {
    
    const groupId = expense.groupId;
    const ourGroup = await Group.findById({ _id: groupId });
    const amount = expense.amount;

    // delete expense
    const ExpenseDeleted = await Expense.findByIdAndDelete({
      _id: expenseId,
    });


    if (!ExpenseDeleted) {
      res.status(404).json("Deletion failed");
      return;
    }

    // ! also delete in the group schema
    await ourGroup.expenseId.pull(expenseId);
    ourGroup.total=Number(ourGroup.total)-Number(amount);
    await ourGroup.save();
    return res.status(200).send("Expense Deleted Succesfully!");
  }
};


// Fetch Expenses details
const expenseDetails = async (req, res) => {
  try {
    const expenseId = req.params.expenseid;
    const ExpDet = await Expense.findById({ _id: expenseId }).populate('paidBy.userId');
    if (!ExpDet) {
      res.status(422).json({ error: "Error in fetching Expense details" });
    }
    res.status(200).json({ expenseDetails: ExpDet });

  } catch (error) {
    res.status(422).json({ error });
  }

}

module.exports = { addExpense, updateExpense, deleteExpense, expenseDetails };
