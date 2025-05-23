// ---------------------------
// Import required modules
// ---------------------------
const express = require("express");
const mongoose = require("mongoose");
const winston = require("winston");
const app = express();

// ---------------------------
// MongoDB Connection
// ---------------------------
const mongoUrl = process.env.MONGO_URL || "mongodb://admin:admin123@mongo:27017/calculator?authSource=calculator";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// ---------------------------
// MongoDB Schema
// ---------------------------
const calculationSchema = new mongoose.Schema({
    operation: String,
    n1: Number,
    n2: Number,
    result: Number,
    timestamp: { type: Date, default: Date.now }
});
const Calculation = mongoose.model("Calculation", calculationSchema);

// ---------------------------
// Logger Configuration
// ---------------------------
const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { service: "calculator-microservice" },
    transports: [
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" }),
    ],
});
if (process.env.NODE_ENV !== "production") {
    logger.add(new winston.transports.Console({ format: winston.format.simple() }));
}

// ---------------------------
// Arithmetic Operation Functions
// ---------------------------
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => {
    if (b === 0) throw new Error("Cannot divide by zero");
    return a / b;
};
const power = (a, b) => Math.pow(a, b);
const sqrt = (a) => {
    if (a < 0) throw new Error("Cannot take square root of a negative number");
    return Math.sqrt(a);
};
const mod = (a, b) => a % b;

// ---------------------------
// Reusable Handler for Two-Input Operations
// ---------------------------
const handleTwoInputOperation = async (req, res, operationFunc, operationName) => {
    try {
        const n1 = parseFloat(req.query.n1);
        const n2 = parseFloat(req.query.n2);
        if (isNaN(n1) || isNaN(n2)) throw new Error("Invalid input");

        const result = operationFunc(n1, n2);

        // Save to DB
        await Calculation.create({ operation: operationName, n1, n2, result });

        logger.info(`${operationName}: ${n1}, ${n2} => ${result}`);
        res.status(200).json({ statuscode: 200, data: result });
    } catch (error) {
        logger.error(`${operationName} Error: ` + error.message);
        res.status(500).json({ statuscode: 500, msg: error.message });
    }
};

// ---------------------------
// Routes
// ---------------------------
app.get("/calculate", async (req, res) => {
    try {
        const n1 = parseFloat(req.query.n1);
        const n2 = req.query.n2 !== undefined ? parseFloat(req.query.n2) : null;
        const operation = req.query.operation;
        if (isNaN(n1)) throw new Error("n1 incorrectly defined");
        if (["add", "subtract", "multiply", "divide", "power", "mod"].includes(operation) && isNaN(n2)) throw new Error("n2 incorrectly defined");

        let result;
        switch (operation) {
            case "add": result = add(n1, n2); break;
            case "subtract": result = subtract(n1, n2); break;
            case "multiply": result = multiply(n1, n2); break;
            case "divide": result = divide(n1, n2); break;
            case "power": result = power(n1, n2); break;
            case "sqrt": result = sqrt(n1); break;
            case "mod": result = mod(n1, n2); break;
            default: throw new Error("Invalid operation.");
        }

        await Calculation.create({ operation, n1, n2, result });
        logger.info(`Operation ${operation}: ${n1}, ${n2} => ${result}`);
        res.status(200).json({ statuscode: 200, data: result });

    } catch (error) {
        logger.error("Calculation Error: " + error.message);
        res.status(500).json({ statuscode: 500, msg: error.toString() });
    }
});

app.get("/add", (req, res) => handleTwoInputOperation(req, res, add, "add"));
app.get("/subtract", (req, res) => handleTwoInputOperation(req, res, subtract, "subtract"));
app.get("/multiply", (req, res) => handleTwoInputOperation(req, res, multiply, "multiply"));
app.get("/divide", (req, res) => handleTwoInputOperation(req, res, divide, "divide"));
app.get("/power", (req, res) => handleTwoInputOperation(req, res, power, "power"));
app.get("/mod", (req, res) => handleTwoInputOperation(req, res, mod, "mod"));

app.get("/sqrt", async (req, res) => {
    try {
        const n1 = parseFloat(req.query.n1);
        if (isNaN(n1)) throw new Error("Invalid input");
        const result = sqrt(n1);
        await Calculation.create({ operation: "sqrt", n1, result });
        logger.info(`Sqrt: √${n1} = ${result}`);
        res.status(200).json({ statuscode: 200, data: result });
    } catch (error) {
        logger.error("Sqrt Error: " + error.message);
        res.status(500).json({ statuscode: 500, msg: error.message });
    }
});

// ---------------------------
// Start the Server
// ---------------------------
const port = 3051;
app.listen(port, () => {
    console.log(`✅ Calculator microservice is listening on port ${port}`);
});
