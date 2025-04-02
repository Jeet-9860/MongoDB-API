require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
console.log("User routes loaded");
const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
