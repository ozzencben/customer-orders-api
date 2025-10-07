require("dotenv").config();

const express = require("express");

const customerRoutes = require("./routes/customers");
const orderRoutes = require("./routes/orders");
const productRoutes = require("./routes/product");

const app = express();

app.use(express.json());

app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});