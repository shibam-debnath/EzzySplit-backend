// Model
const Expense = require("../models/expense");

// Function 1 : AddExpense handler
const addExpense = async (req, res) => {
  const userId = req.user;
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
