// Model
const Expense = require("../models/expense");

// Function 1 : AddExpense handler
const addExpense = async (req, res) => {
  try {
    // create new expense
    // const newExpense = await new Expense({
    //   amount: req.body.amount,
    //   notes: req.body.notes,

    //   split_method: req.body.split_method,
    // });

    const newExpense = await new Expense({
      amount: "201",
      notes: "hostel 5 canteen",
      split_method: "equally",
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
  const { expenseId } = req.params;
  const userId = req.user;
  const expense = await Expense.findOne({ _id: expenseId });

  if (!expense) {
    return res.status(404).send({ error: "Expense not found!" });
  } else {
    // update expense
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
  }
};

module.exports = { addExpense, updateExpense, deleteExpense };
