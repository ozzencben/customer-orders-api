require("dotenv").config();
const pkg = require("pg");
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

module.exports = pool;