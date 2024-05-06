require("dotenv").config();
const express = require("express");
const { connectDB } = require("./src/config/db");
const stylistsRouter = require("./src/api/routes/Stylist");
const servicesRouter = require("./src/api/routes/Service");
const usersRouter = require("./src/api/routes/User");
const appointmentRouter = require("./src/api/routes/Appointment");

const app = express();

connectDB();

app.use(express.json())

app.use("/api/stylist", stylistsRouter);
app.use("/api/service", servicesRouter);
app.use("/api/user", usersRouter);
app.use("/api/appointment", appointmentRouter);

app.use("*", (req, res, next) => {
    return res.status(404).json("Route not found")
})

app.listen(3000, () => {
    console.log("http://localhost:3000");
})