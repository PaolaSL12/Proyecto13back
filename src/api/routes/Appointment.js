const { isAuth } = require("../../middlewares/auth");
const { getAppointmentById, getAppointments, createAppointment, deleteAppointment, getAppointmentByDate } = require("../controllers/Appointment");

const appointmentRouter = require("express").Router();

appointmentRouter.get("/:day/:month/:year", getAppointmentByDate)
appointmentRouter.get("/:id", getAppointmentById);
appointmentRouter.get("/", getAppointments);
appointmentRouter.post("/post", isAuth,  createAppointment);
appointmentRouter.delete("/:id", deleteAppointment);


module.exports = appointmentRouter;