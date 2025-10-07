# Customer Orders API

Customer Orders API is a **Node.js** and **PostgreSQL-based** backend
project that manages customers, products, and orders.\
It includes full CRUD operations, relational database design, and
transactional order creation.

Developed as a practice project to strengthen backend development and
SQL skills.

------------------------------------------------------------------------

## ✨ Features

-   Customer, Product, and Order management (CRUD)
-   Relational database structure with PostgreSQL
-   Transaction support for order creation
-   Error handling and RESTful API design

------------------------------------------------------------------------

## ⚙️ Installation & Setup

1.  Clone this repository:

    ``` bash
    git clone https://github.com/<your-username>/customer-orders-api.git
    ```

2.  Navigate into the project folder:

    ``` bash
    cd customer-orders-api
    ```

3.  Install dependencies:

    ``` bash
    npm install
    ```

4.  Configure your database connection inside `config/db.js`

5.  Run the development server:

    ``` bash
    node server.js
    ```

    or

    ``` bash
    npm run dev
    ```

------------------------------------------------------------------------

## 🧩 Example API Endpoints

  Method   Endpoint           Description
  -------- ------------------ -------------------------------
  GET      `/api/customers`   Get all customers
  POST     `/api/customers`   Create new customer
  GET      `/api/products`    Get all products
  POST     `/api/orders`      Create a new order with items

------------------------------------------------------------------------

## 📫 Contact

Developed by **Özenç Dönmezer**\
📧 Email: <ozzencben@gmail.com>\
🔗 LinkedIn: [Özenç
Dönmezer](https://www.linkedin.com/in/%C3%B6zen%C3%A7-d%C3%B6nmezer-769125357/)
