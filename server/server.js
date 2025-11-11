const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const loanRoutes = require("./routes/loanRoutes");

dotenv.config();
console.log("🟡 MONGO_URI from .env:", process.env.MONGO_URI);
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/loans", loanRoutes);

app.get("/", (req, res) => res.send("Server running successfully..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
