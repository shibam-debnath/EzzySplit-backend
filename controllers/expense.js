// Model
const Expense = require("../models/expense");

// Function 1 : AddExpense handler
const addExpense = async (req, res) => {
  try {
    // create new expense
    const newExpense = await Expense.create({
      amount: req.body.amount,
      notes: req.body.notes,
      groupId: req.body.groupId,
      split_method: req.body.split_method,
      split_between: req.body.split_between,
    });

    // save new expense to db
    const exp = await newExpense.save();
    res.status(200).json("expense added successfully");
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

  if (!expense) {
    return res.status(404).send({ error: "Expense not found!" });
  } else {
    // access new requests
    // const new_amount = req.body.amount;
    // const new_notes = req.body.notes;
    // const new_split_method = req.body.split_method;
    // const new_groupId = req.body.groupId;

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
        }
      }
    );

    // update current expense
    // expense.amount = new_amount;
    // expense.notes = new_notes;
    // expense.date = Date.now();
    // expense.groupId = new_groupId;
    // expense.split_method = new_split_method;

    // // previous split between
    // const splitData = expense.split_between;
    // const new_splitData = req.body.split_between;

    // for (let i = 0; i < splitData.length; i++) {
    //   // access details of last transaction
    //   splitData[i].user = new_splitData[i].user;
    //   splitData[i].paid = new_splitData[i].paid;
    //   splitData[i].toPay = new_splitData[i].toPay;
    // }
  }
};

// Function 3 : deleteExpense handler
const deleteExpense = async (req, res) => {
  const userId = req.user;
  const { expenseId } = req.params;
  const expense = await Expense.findOne({ _id: expenseId });

  if (!expense) {
    return res.status(404).send({ error: "Expense not found!" });
  } else {
    // delete expense
    const ExpenseDeleted = await Expense.findByIdAndDelete({
      _id: expenseId,
    });

    if (!ExpenseDeleted) {
      res.status(404).json("Deletion failed");
    }
    return res.status(200).send("Expense Deleted Succesfully!");
  }
};

module.exports = { addExpense, updateExpense, deleteExpense };
