const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// GET all customers
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM customers ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// GET single customer by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM customers WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// POST create new customer
router.post("/create", async (req, res) => {
  const { first_name, last_name, email, phone } = req.body;
  if (!first_name || !last_name || !email || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO customers (first_name, last_name, email, phone) VALUES ($1, $2, $3, $4) RETURNING *",
      [first_name, last_name, email, phone]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// PUT update existing customer
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone } = req.body;
  try {
    const result = await pool.query(
      "UPDATE customers SET first_name = $1, last_name = $2, email = $3, phone = $4 WHERE id = $5 RETURNING *",
      [first_name, last_name, email, phone, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// DELETE customer
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM customers WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
