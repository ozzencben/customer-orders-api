const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/", async (req, res) => {
  const { customer_id, items } = req.body;
  // items = [{ product_id: 1, quantity: 2, price: 100 }]

  if (!customer_id || !items || !items.length) {
    return res
      .status(400)
      .json({ message: "Customer ID and items are required" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ total_amount hesapla
    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    // 2️⃣ Insert order
    const orderResult = await client.query(
      "INSERT INTO orders (customer_id, total_amount) VALUES ($1, $2) RETURNING *",
      [customer_id, totalAmount]
    );
    const orderId = orderResult.rows[0].id;

    // 3️⃣ Insert order_items
    for (let item of items) {
      await client.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({ order_id: orderId, total_amount: totalAmount });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err.message);
    res.status(500).send("Server Error");
  } finally {
    client.release();
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { customer_id, items } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Update customer_id
    const orderResult = await client.query(
      "UPDATE orders SET customer_id = $1 WHERE id = $2 RETURNING *",
      [customer_id, id]
    );

    if (orderResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Order not found" });
    }

    // 2️⃣ Eğer items varsa, önce sil sonra ekle
    if (items && items.length) {
      await client.query("DELETE FROM order_items WHERE order_id = $1", [id]);

      for (let item of items) {
        await client.query(
          "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
          [id, item.product_id, item.quantity, item.price]
        );
      }

      // 3️⃣ total_amount güncelle
      const totalAmount = items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );
      await client.query("UPDATE orders SET total_amount = $1 WHERE id = $2", [
        totalAmount,
        id,
      ]);
    }

    await client.query("COMMIT");
    res.json({ message: "Order updated successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err.message);
    res.status(500).send("Server Error");
  } finally {
    client.release();
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM orders WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
