const express = require("express");
const router = express.Router();

// expenseController handles all the methods
const expenseController = require("../controllers/expense");
const { route } = require("./userRoutes");

// Different Routes

// Add new expense (Login required)
router.post("/addExpense", expenseController.addExpense);

// Update already stored expense (Login required)
router.post("/:expenseId", expenseController.updateExpense);

// Delete Expense: Using Delete (Login required)
router.delete("/:expenseId", expenseController.deleteExpense);

// Settle expense
router.post("/settle/:groupId", expenseController.settleExpense);

// Fetch expenses details
router.get("/:expenseid",expenseController.expenseDetails);

module.exports = router;
