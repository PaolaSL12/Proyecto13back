const { isAuth } = require("../../middlewares/auth");
const { getAppointmentById, getAppointments, createAppointment, deleteAppointment } = require("../controllers/Appointment");

const appointmentRouter = require("express").Router();

appointmentRouter.get("/:id", getAppointmentById);
appointmentRouter.get("/", getAppointments);
appointmentRouter.post("/post", isAuth,  createAppointment);
appointmentRouter.delete("/:id", deleteAppointment);

module.exports = appointmentRouter;