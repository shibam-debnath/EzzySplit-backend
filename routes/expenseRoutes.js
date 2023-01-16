const express = require("express");
const router = express.Router();

// expenseController handles all the methods
const expenseController = require("../controllers/expense");

// Different Routes

// Add new expense (Login required)
router.post("/addExpense", expenseController.addExpense);

// Update already stored expense (Login required)
router.post("/:expenseId", expenseController.updateExpense);

// Delete Expense: Using Delete (Login required)
router.delete("/:expenseId", expenseController.deleteExpense);

module.exports = router;
