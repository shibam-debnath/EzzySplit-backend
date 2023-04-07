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
      split_between: req.body.split_between
    });
    // save new expense to db
    await newExpense.save();
    console.log(`newExp: ${newExpense}`);
    ourGroup.expenseId.push(newExpense._id);
    ourGroup.total = Number(ourGroup.total) + Number(req.body.amount);
    await ourGroup.save();
    console.log(`ourGrp lst:: ${ourGroup}`);
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
  const { expenseId } = req.params;
  const userId = req.user;
  const expense = await Expense.findOne({ _id: expenseId });
  const groupId = req.body.groupId;
  const ourGroup = await Group.findById({ _id: groupId });

  if (!expense) {
    return res.status(404).send({ error: "Expense not found !" });
  } else if (!ourGroup) {
    return res.status(404).send({ error: "Group doesn't exist !" });
  } else {
    Expense.findByIdAndUpdate(
      expenseId,
      {
        $set: req.body,
      },
      { new: true },
      function (err, result) {
        if (err) {
          res.status(404).json("Update failed");
        } else {
          res.status(200).json("Successfully updated");
          res.send(200).json(result);
        }
      }
    );

    // ! also update in the group schema
    Group.findByIdAndUpdate(
      groupId,
      {
        expenses: req.body,
      },
      { new: true },
      function (err, result) {
        if (err) {
          res.status(404).json("Updation failed in the group");
        } else {
          res.status(200).json("Successfully updated in the group also");
          res.send(200).json(result);
        }
      }
    );
  }

  // update current expense
  // expense.amount = new_amount;
  // expense.notes = new_notes;
  // expense.date = Date.now();
  // expense.groupId = new_groupId;
  // expense.split_method = new_split_method;

  // previous split between
  // const splitData = expense.split_between;
  // const new_splitData = req.body.split_between;

  // for (let i = 0; i < splitData.length; i++) {
  // access details of last transaction
  //   splitData[i].user = new_splitData[i].user;
  //   splitData[i].paid = new_splitData[i].paid;
  //   splitData[i].toPay = new_splitData[i].toPay;
  // }
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
