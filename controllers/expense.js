// Model
const Expense = require("../models/expense");
const Group = require("../models/group");

// Settle function
const settleExpense = async (req, res) => {
  const groupId = req.params.groupId;
  const ourGroup = await Group.findById({ _id: groupId });

  if (!ourGroup) {
    res.status(500).send({ error: "group not found" });
  } else {
    const expense = ourGroup.expenses;
    res.status(200).send(groupId);
  }
};

// Function 1 : AddExpense handler
const addExpense = async (req, res) => {
  try {
    const groupId = req.body.groupId;
    const ourGroup = await Group.findById({ _id: groupId });
    if (!ourGroup) {
      res.ststus(500).send("Group not found");
    }

    // * if everything ok then create new expense
    const newExpense = await Expense.create({
      amount: req.body.amount,
      notes: req.body.notes,
      groupId: req.body.groupId,
      split_method: req.body.split_method,
      split_between: req.body.split_between,
    });
    // save new expense to db
    await newExpense.save();

    // ! Update the expense in Group
    ourGroup.expenses.push(newExpense);
    const done = await ourGroup.save();
    // console.log(done);
    res.status(200).json("expense added successfully");
  } catch (err) {
    // console.log(err);
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
  const userId = req.user;
  const { expenseId } = req.params;
  const expense = await Expense.findOne({ _id: expenseId });
  const groupId = req.body.groupId;
  const ourGroup = await Group.findById({ _id: groupId });

  if (!expense) {
    return res.status(404).send({ error: "Expense not found!" });
  } else {
    // delete expense
    const ExpenseDeleted = await Expense.findByIdAndDelete({
      _id: expenseId,
    });

    // ! also delete in the group schema
    await Group.findByIdAndDelete({
      _id: expenseId,
    });

    if (!ExpenseDeleted) {
      res.status(404).json("Deletion failed");
      return;
    }
    return res.status(200).send("Expense Deleted Succesfully!");
  }
};

module.exports = { addExpense, updateExpense, deleteExpense, settleExpense };
