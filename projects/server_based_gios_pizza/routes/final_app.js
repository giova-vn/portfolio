const express = require("express");
const fs = require("fs");
const handlebars = require("handlebars");
const sqlite = require("sqlite3");
const bcrypt = require("bcrypt");
const http = require("http"); 
const router = express.Router();

const DB = "././external_files/final_app.db";

    //get pages
//get index
router.get("/", async(req, res) => {
    let result = "";
    let source = fs.readFileSync("./static/index.html");
    let template = handlebars.compile(source.toString());
    let data = {
        table: result,
        loginError: req.session.loginError
    }
    result = template(data);
    req.session.loginError = null;
    res.send(result);
});

//log ig as customer
router.post("/order", async(req, res) => {
    let result = "";
    const customer_username = req.body.mainCustomerUsername;
    const customer_password = req.body.mainCustomerPassword;

    try {        
        db.get("SELECT * FROM customer_account WHERE username = ?", [customer_username], async (err, row) => {         
            if (!row) { //empty row
                const hashedPassword = await generateHash(customer_password);

                db.run(
                    "INSERT INTO customer_account (username, password) VALUES (?, ?)",
                    [customer_username, hashedPassword],

                    function() {
                        req.session.customer_id = this.lastID; 
                        req.session.loginError = null; 

                        let source = fs.readFileSync("./templates/order.html");
                        let template = handlebars.compile(source.toString());
                        let data = {
                            table: result,
                            customer_id: req.session.customer_id
                        };
                        result = template(data);
                        res.send(result);
                    }
                );
            }
            
            else {
                const isValid = bcrypt.compareSync(customer_password, row.password);
                if(isValid) {    //true
                    req.session.customer_id = row.customer_id;
                    req.session.loginError = null;
    
                    let source = fs.readFileSync("./templates/order.html");
                    let template = handlebars.compile(source.toString());
                    let data = {
                        table: result,
                        customer_id: row.customer_id
                    }
                    result = template(data);
                    res.send(result);
                    return;
                }
                else {       //wrong password
                    req.session.loginError = "Username or password invalid.";
                    return res.redirect("/final_app");
                }
            }
        });
    }
    catch(error) {
        console.log("error in customer login. " + error)
        return res.redirect("/final_app");
    }
});

//get - log in as employee
router.get("/employee", async (req, res) => {
    try {
        const employee_id = req.session.employee_id;

        if (!employee_id) {
            req.session.loginError = "Please log in to access the employee page.";
            return res.redirect("/final_app");
        }

        db.get("SELECT username, status FROM employees WHERE employee_id = ?", [employee_id], async (err, row) => {
            if (err || !row) {
                req.session.loginError = "Employee not found.";
                return res.redirect("/final_app");
            }

            const employee_username = row.username;
            const employee_status = row.status;

            //if employee
            if (employee_status === "employee") {
                const ordersTable = await displayOrdersEmployee();

                const source = fs.readFileSync("./templates/employee.html");
                const template = handlebars.compile(source.toString());
                const data = {
                    employee_name: employee_username,
                    orders: ordersTable,
                    new_employee: "",
                    tax_summary: "",
                    employees: ""
                };

                const result = template(data);
                res.send(result);

            } 
            //if manager
            else if (employee_status === "manager") {
                const ordersTable = await displayOrdersEmployee();
                const taxSummaryTable = await displayTaxSummary();
                const employeesTable = await managementEmployee();
                const new_employee_table = await addNewEmployee();

                const source = fs.readFileSync("./templates/employee.html");
                const template = handlebars.compile(source.toString());
                const data = {
                    employee_name: employee_username,
                    orders: ordersTable,
                    new_employee: new_employee_table,
                    tax_summary: taxSummaryTable,
                    employees: employeesTable
                };
                const result = template(data);
                res.send(result);
            } 
            else {
                req.session.loginError = "User is not in records.";
                return res.redirect("/final_app");
            }
        });
    } 
    catch (error) {
        res.status(500).send("An error occurred while loading the employee page.");
    }
});

//post - log in as employee
router.post("/employee", async (req, res) => {
    try {
        const employee_username = req.body.mainEmployeeUsername;
        const employee_password = req.body.mainEmployeePassword;

        db.get("SELECT * FROM employees WHERE username = ?", [employee_username], (err, row) => {
            if (!row) {
                addLogginAttempt(employee_username, 0, req.ip);
                req.session.loginError = "Not found";
                return res.redirect("/final_app");
            }

            const isValid = bcrypt.compareSync(employee_password, row.password);
            if (isValid) {
                req.session.employee_id = row.employee_id;
                addLogginAttempt(employee_username, 1, req.ip);

                db.get("SELECT status FROM employees WHERE username = ?", [employee_username], async (err, row) => {
                    if (row.status === "employee") {
                        const ordersTable = await displayOrdersEmployee();

                        const source = fs.readFileSync("./templates/employee.html");
                        const template = handlebars.compile(source.toString());
                        const data = {
                            employee_name: employee_username,
                            orders: ordersTable,
                            new_employee: "",
                            tax_summary: "",
                            employees: ""
                        };
                        const result = template(data);
                        res.send(result);
                    } 
                    else if (row.status === "manager") {
                        const ordersTable = await displayOrdersEmployee();
                        const taxSummaryTable = await displayTaxSummary();
                        const employeesTable = await managementEmployee();
                        const new_employee_table = await addNewEmployee();

                        const source = fs.readFileSync("./templates/employee.html");
                        const template = handlebars.compile(source.toString());
                        const data = {
                            employee_name: employee_username,
                            orders: ordersTable,
                            new_employee: new_employee_table,
                            tax_summary: taxSummaryTable,
                            employees: employeesTable
                        };
                        const result = template(data);
                        res.send(result);
                    } else {
                        req.session.loginError = "User is not in records";
                        return res.redirect("/final_app");
                    }
                });
            } else {
                addLogginAttempt(employee_username, 0, req.ip);
                req.session.loginError = "Username or password invalid.";
                return res.redirect("/final_app");
            }
        });
    } 
    catch (error) {
        return res.redirect("/final_app");
    }
});

//get - place order - go to  receipt 
router.get("/receipt", async (req, res) => {
    let result = "Your order has been processed.";

    let source = fs.readFileSync("./templates/receipt.html");
    let template = handlebars.compile(source.toString());
    let data = {
        table: result,
    };
    result = template(data);
    res.send(result);
});

//get - place order
router.post("/receipt", async (req, res) => {
    let result = "Your order has been processed.";

    let source = fs.readFileSync("./templates/receipt.html");
    let template = handlebars.compile(source.toString());
    let data = {
        table: result,
    };
    result = template(data);
    res.send(result);
});

    //functions retrieving data
//save contact information in the session
router.post("/storeCustomerData", (req, res) => {
    const { fName, lName, phone, email } = req.body;

    req.session.customerData = {
        fName,
        lName,
        phone,
        email,
    };

    req.session.save((err) => {
        if (err) {
            return res.status(500).send("Failed to save customer data.");
        }
        res.status(200).send("Customer data saved successfully.");
    });
});

//save delivery choice/addres in the session
router.post("/storeDeliveryData", (req, res) => {
    const { deliveryAddress, deliveryAddressTwo, deliveryCity, deliveryState, deliveryZip } = req.body;

    //merge with existing customerData
    req.session.customerData = {
        ...req.session.customerData,
        deliveryAddress,
        deliveryAddressTwo,
        deliveryCity,
        deliveryState,
        deliveryZip
    };

    req.session.save((err) => {
        if (err) {
            return res.status(500).send("Failed to save delivery data.");
        }
        res.status(200).send("Delivery data saved successfully.");
    });
});

//pizza count from body
router.post("/updatePizzaCount", (req, res) => {
    const { pizzaCount } = req.body;

    if (typeof pizzaCount !== "number") {
        return res.status(400).send("Invalid pizza count.");
    }

    req.session.pizzaCount = pizzaCount;

    req.session.save((err) => {
        if (err) {
            return res.status(500).send("Failed to save pizza count.");
        }

        res.status(200).send("Pizza count updated successfully.");
    });
});

//save pizza details in the session
router.post("/updatePizzaDetails", (req, res) => {
    const { pizzaCount, pizzaSize, toppings } = req.body;

    if (typeof pizzaCount !== "number" || !pizzaSize || !Array.isArray(toppings)) {
        return res.status(400).send("Invalid pizza details.");
    }

    req.session.pizzaDetails = req.session.pizzaDetails || [];
    req.session.pizzaDetails.push({
        pizzaSize,
        toppings,
    });

    req.session.pizzaCount = pizzaCount;

    req.session.save(err => {
        if (err) {
            return res.status(500).send("Failed to save pizza details.");
        }
        res.status(200).send("Pizza details updated successfully.");
    });
});

//place the order
router.post("/submitOrder", async (req, res) => {
    //function for SQLite
    const runQuery = (sql, params) => {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) {
                    console.error(`SQL Error (${sql}):`, err.message);
                    reject(err);
                } else {
                    resolve(this);
                }
            });
        });
    };

    if (!req.session.customerData || !req.session.customer_id || !req.session.pizzaDetails) {
        return res.status(400).send("Session data is missing. Please start a new order.");
    }

    try {
        const customerData = req.session.customerData;
        const { fName, lName, phone, email, deliveryAddress, deliveryCity, deliveryState, deliveryZip } = customerData;
        const customer_id = req.session.customer_id;

        const fullName = `${fName} ${lName}`;
        const orderDate = new Date().toISOString();
        let address = "";
        let zip = "";;

        //if user select pickup, the delivery Zip will be undefined
        if (deliveryZip != undefined) {
            address = `${deliveryAddress}, ${deliveryCity}, ${deliveryState}`;
            zip = deliveryZip;
        } 
        else {
            address = "Pickup at store";
            zip = "60067"; //default zip code from Palatine
        }

        const taxRate = await getTaxRate(zip); 
        const pizzaDetails = req.session.pizzaDetails;
        const pizzaNumber = pizzaDetails.length;

        let totalPrice = 0;

        //database management
        await runQuery("BEGIN TRANSACTION;");
        await runQuery(
            "INSERT OR REPLACE INTO customer_info (customer_id, name, email, phone, address, zip) VALUES (?, ?, ?, ?, ?, ?)",
            [customer_id, fullName, email, phone, address, zip]
        );

        const orderResult = await runQuery(
            "INSERT INTO orders (customer_id, date, quantity, total_price, TaxRate, TaxAmount) VALUES (?, ?, ?, ?, ?, ?)",
            [customer_id, orderDate, pizzaNumber, 0, taxRate, 0]
        );

        const order_id = orderResult.lastID;

        for (const pizza of pizzaDetails) {
            const { pizzaSize, toppings } = pizza;

            let basePrice = 0;
            switch (pizzaSize) {
                case "Small":
                    basePrice = 13;
                    break;
                case "Medium":
                    basePrice = 17;
                    break;
                case "Large":
                    basePrice = 21;
                    break;
                default:
                    basePrice = 13;
            }

            const toppingPrice = toppings.length * 0.99;
            const pizzaPrice = basePrice + toppingPrice;
            totalPrice += pizzaPrice;

            await runQuery(
                "INSERT INTO pizza_details (order_id, size, price, toppings) VALUES (?, ?, ?, ?)",
                [order_id, pizzaSize, pizzaPrice, toppings.length]
            );
        }

        const taxAmount = parseFloat((totalPrice * taxRate).toFixed(2));
        totalPrice = parseFloat((totalPrice + taxAmount).toFixed(2));

        await runQuery(
            "UPDATE orders SET total_price = ?, TaxAmount = ? WHERE order_id = ?",
            [totalPrice, taxAmount, order_id]
        );

        await runQuery("COMMIT;");

        req.session.lastOrderId = order_id;
        req.session.orderDetails = {
            name: fullName,
            address: address,
            pizzaDetails: pizzaDetails,
            totalPrice: totalPrice,
            taxAmount: taxAmount,
            taxRate: taxRate,
        };

        //finish, go to receipt
        res.redirect("/final_app/receipt");
    } 
    catch (error) {
        try {
            await runQuery("ROLLBACK;");
        } 
        catch (rollbackError) {
            console.error("Error rolling back - ", rollbackError);
        }
        res.status(500).send("Error in submitOrder");
    }
});

//order status by employee
router.post("/updateOrderStatus", (req, res) => {
    const { pizza_detail_id, done } = req.body;

    db.run(
        "UPDATE pizza_details SET Done = ? WHERE pizza_detail_id = ?",
        [done, pizza_detail_id],
        (err) => {
            if (err) {
                console.error("Error updating order status:", err);
                return res.status(500).send("Failed to update order status.");
            }
            res.redirect("/final_app/employee");
        }
    );
});

//update employee by a manager
router.post("/updateEmployeeStatus", (req, res) => {
    const { employee_id, status } = req.body;

    db.run(
        "UPDATE employees SET status = ? WHERE employee_id = ?",
        [status, employee_id],
        (err) => {
            if (err) {
                console.error("Error updating employee status:", err);
                return res.status(500).send("Failed to update employee status.");
            }
            res.redirect("/final_app/employee");
        }
    );
});

//display orders by customer
router.post("/displayOrders", async (req, res) => {
    const customer_id = req.session.customer_id;

    try {
        db.all(
            "SELECT date, quantity, total_price FROM orders WHERE customer_id = ? ORDER BY date DESC",
            [customer_id],
            (err, rows) => {
                if (err) {
                    console.error("Error fetching orders:", err);
                    return res.status(500).send("Failed to fetch orders.");
                }

                //rows
                const orders = rows.length
                    ? rows.map((row) => {
                          const orderDate = new Date(row.date);
                          const formattedDate = orderDate.toLocaleDateString("en-US", {
                              month: "2-digit",
                              day: "2-digit",
                              year: "numeric",
                          });

                          return `<tr><td>${formattedDate}</td><td>${row.quantity}</td><td>$${row.total_price.toFixed(
                              2
                          )}</td></tr>`;
                      }).join("")
                    : "<tr><td colspan='3'>No orders to display</td></tr>";

                //table
                const tableHTML = `
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orders}
                        </tbody>
                    </table>
                `;

                //render
                const source = fs.readFileSync("./templates/order.html");
                const template = handlebars.compile(source.toString());
                const data = {
                    orders: tableHTML,
                };

                const result = template(data);
                res.send(result);
            }
        );
    } 
    catch (error) {
        res.status(500).send("Error displaying customer data");
    }
});

    //employee page
//display orders
async function displayOrdersEmployee() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM pizza_details", (err, rows) => {
            if (err) {
                reject(err);
            } 
            else {
                const orders = rows.map(row => {
                    const rowClass = row.order_id % 2 === 0 ? "even-row" : "odd-row";
                    
                    //rows
                    return `
                        <tr class="${rowClass}">
                            <td>${row.order_id}</td>
                            <td>${row.size}</td>
                            <td>${row.price}</td>
                            <td>${row.toppings}</td>
                            <td>
                                <form method="POST" action="/final_app/updateOrderStatus">
                                    <input type="hidden" name="pizza_detail_id" value="${row.pizza_detail_id}">
                                    <select name="done">
                                        <option value="0" ${row.Done === 0 ? "selected" : ""}>Not Done</option>
                                        <option value="1" ${row.Done === 1 ? "selected" : ""}>Done</option>
                                    </select>
                                    <button type="submit">Update</button>
                                </form>
                            </td>
                        </tr>
                    `;
                }).join("");

                //table
                resolve(`
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Size</th>
                                <th>Price</th>
                                <th>Toppings</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orders}
                        </tbody>
                    </table>
                `);
            }
        });
    });
}

//display taxes by zip code
async function displayTaxSummary() {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT only.zip, SUM(orders.TaxAmount) AS total_tax
             FROM orders
             JOIN ( 
                SELECT DISTINCT customer_id, zip
                FROM customer_info
                ) only
                ON orders.customer_id = only.customer_id
             GROUP BY only.zip
             ORDER BY only.zip;`,

            (err, rows) => {
                if (err) {
                    reject(err);
                } 
                else {
                    //rows
                    const summary = rows.map(row => `
                        <tr>
                            <td>${row.zip}</td>
                            <td>${row.total_tax.toFixed(2)}</td>
                        </tr>
                    `).join("");

                    //table
                    resolve(`
                        <table>
                            <thead>
                                <tr>
                                    <th>ZIP Code</th>
                                    <th>Total Tax</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${summary}
                            </tbody>
                        </table>
                    `);
                }
            }
        );
    });
}

//update employees
async function managementEmployee() {
    return new Promise((resolve, reject) => {
        db.all("SELECT employee_id, name, username, status FROM employees", (err, rows) => {
            if (err) {
                reject(err);
            } 
            else {
                //rows with buttons
                const employees = rows.map(row => `
                    <tr>
                        <td>${row.employee_id}</td>
                        <td>${row.name}</td>
                        <td>${row.username}</td>
                        <td>
                            <form method="POST" action="/final_app/updateEmployeeStatus">
                                <input type="hidden" name="employee_id" value="${row.employee_id}">
                                <select name="status">
                                    <option value="employee" ${row.status === "employee" ? "selected" : ""}>Employee</option>
                                    <option value="manager" ${row.status === "manager" ? "selected" : ""}>Manager</option>
                                </select>
                                <button type="submit">Update</button>
                            </form>
                        </td>
                    </tr>
                `).join("");

                //table
                resolve(`
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${employees}
                        </tbody>
                    </table>
                `);
            }
        });
    });
}

//add new employee
async function addNewEmployee() {
    return new Promise((resolve) => {
        resolve(`
            <div class="addNewEmployee">
                <h3>Add New Employee</h3>

                <form action="/final_app/addEmployee" method="POST" class="column add-employee-form">
                    <input type="text" name="newEmployeeName" placeholder="Full Name" required>
                    <input type="text" name="newEmployeeUsername" placeholder="Username" required>
                    <input type="password" name="newEmployeePassword" placeholder="Password" required>

                    <button type="submit">Add Employee</button>
                </form>

            </div>
        `);
    });
}


    //general functions
//encrypt passwrod
async function generateHash(password) {
    const salt = await bcrypt.genSaltSync(12);
    const hash = await bcrypt.hashSync(password, salt);

    return hash;
}

//add login attempt by employee/manager
function addLogginAttempt(username, success, ipAddress) {
    const timestamp = new Date().toISOString();
    
    db.run(
        "INSERT INTO login_attempts (username, success, IP_address, times_tried) VALUES (?, ?, ?, ?)",
        [username, success, ipAddress, timestamp],
        function(err) {
            if (err) {
                console.error("Error logging login attempt:", err.message);
            }
        }
    );
};

//get tax rate with REST API
async function getTaxRate(zipCode) {
    return new Promise(function(resolve, reject) {
        const state = "IL"; 
        const options = {
            hostname: 'assignment2example-env-1v2.eba-m9eezpmg.us-east-1.elasticbeanstalk.com',
            path: `/taxrates/${state}/${zipCode}`,
            method: 'GET'
        };

        const req = http.request(options, function(res) {
            let data = '';

            res.on('data', function(chunk) {
                data += chunk;
            });

            res.on('end', function() {
                try {
                    const parsedData = JSON.parse(data);

                    if (parsedData && parsedData.EstimatedCombinedRate) {
                        resolve(parseFloat(parsedData.EstimatedCombinedRate));
                    } 
                    else {
                        console.error("Invalid tax rate response:", parsedData);
                        resolve(0.1);
                    }
                } catch (error) {
                    console.error("Error parsing tax rate response:", error);
                    resolve(0.1);
                }
            });
        });

        req.on('error', function(error) {
            console.error("Error fetching tax rate:", error);
            resolve(0.1);
        });

        req.end();
    });
}

//load database
async function loadDatabase() {
    return new Promise(async (resolve, reject) => {
        const db = new sqlite.Database(DB, async (error) => {

            // default customer and manager
            // let customer_password = await generateHash("password123");
            // let manager_password = await generateHash("123123")
            // db.run(
            //     "INSERT INTO customer_account (username, password) VALUES (?, ?)",
            //     ["customer", customer_password]
            // );
            // db.run(
            //     "INSERT INTO employees (name, username, password, status) VALUES (?, ?, ?, ?)",
            //     ["Jacob Bond", "manager", manager_password, "manager"]
            // );

            if (error) {
                console.error("Error witht the database:", error);
                reject(error);
                return;
            }
            console.log("Connected to the database for initialization.");
    
            db.serialize(() => {
                //check if tables exist 
                db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='customer_account'", (err, row) => {
                    if (!row) { //if doesn't exists, create the database
                        let sql = `
                            CREATE TABLE IF NOT EXISTS customer_account (
                                customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
                                username TEXT NOT NULL UNIQUE,
                                password TEXT NOT NULL
                            )`;
                        db.run(sql);
                    };
                });

                db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='employees'", (err, row) => {
                    if (!row) {
                        let sql = `
                            CREATE TABLE IF NOT EXISTS employees (
                                employee_id INTEGER PRIMARY KEY AUTOINCREMENT,
                                name TEXT NOT NULL,
                                username TEXT NOT NULL UNIQUE,
                                password TEXT NOT NULL,
                                status TEXT
                            )`;
                        db.run(sql);
                    };
                });

                db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='customer_info'", (err, row) => {
                    if (!row) {
                        let sql = `
                            CREATE TABLE IF NOT EXISTS customer_info (
                                customer_info_id INTEGER PRIMARY KEY AUTOINCREMENT,
                                customer_id INTEGER NOT NULL,
                                name TEXT NOT NULL,
                                email TEXT UNIQUE,
                                phone TEXT,
                                address TEXT,
                                zip INTEGER NOT NULL,
                                FOREIGN KEY (customer_id) REFERENCES customer_account(customer_id)
                            )`;
                        db.run(sql);
                    };
                });

                db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='orders'", (err, row) => {
                    if (!row) {
                        let sql = `
                            CREATE TABLE IF NOT EXISTS orders (
                                order_id INTEGER PRIMARY KEY AUTOINCREMENT,
                                customer_id INTEGER NOT NULL,
                                date TEXT NOT NULL,
                                quantity INTEGER NOT NULL,
                                total_price REAL NOT NULL,
                                TaxRate REAL,
                                TaxAmount REAL,
                                FOREIGN KEY (customer_id) REFERENCES customer_account(customer_id)
                            )`;
                        db.run(sql);
                    }
                });

                db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='pizza_details'", (err, row) => {
                    if (!row) {
                        let sql = `
                            CREATE TABLE IF NOT EXISTS pizza_details (
                                pizza_detail_id INTEGER PRIMARY KEY AUTOINCREMENT,
                                order_id INTEGER NOT NULL,
                                size TEXT NOT NULL,
                                price REAL NOT NULL,
                                toppings INTEGER NOT NULL,
                                Done INTEGER NOT NULL DEFAULT 0,
                                FOREIGN KEY (order_id) REFERENCES orders(order_id)
                            )`;
                        db.run(sql);
                    }
                });

                db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='login_attempts'", (err, row) => {
                    if (!row) {
                        let sql = `
                            CREATE TABLE IF NOT EXISTS login_attempts (
                                attempt_id INTEGER PRIMARY KEY AUTOINCREMENT,
                                username TEXT NOT NULL,
                                success INTEGER NOT NULL,
                                IP_address TEXT,
                                times_tried TEXT NOT NULL
                            )`;
                        db.run(sql);
                    }
                });
                resolve();
            }); //end serialize
        });
    });
};

//load database
loadDatabase();

    //database connection
const db = new sqlite.Database(DB, (err) => {                       
    if (err) {
      console.error("Database connection failed:", err.message);
    } 
    else {
      console.log("Database found.");
    }
});

//export
module.exports = router;