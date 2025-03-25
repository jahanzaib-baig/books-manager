require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

// Routes
const bookRoutes = require("./routes/bookRoutes");

connectDB(); // Connect to MongoDB

const app = express();

// Middleware (ORDER MATTERS)
app.use(cors());
app.use(express.json()); // Ensure JSON body parsing is enabled
app.use(bodyParser.json()); // This is redundant, but doesn't hurt

// API Routes
app.use("/api", bookRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
