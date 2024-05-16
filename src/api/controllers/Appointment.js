const Appointment = require("../models/Appointment");
const moment = require('moment');
const Service = require("../models/Service");
const Stylist = require("../models/Stylist");
const User = require("../models/User");
const isAvailable = require("../../utils/functions/isAviable");
const calculateEndTime = require("../../utils/functions/calculateEndTime");


const getAppointments = async (req, res, next) => {
  try {
    const appointment = await Appointment.find().populate('user').populate('service').populate('stylist');
    return res.status(200).json(appointment);
  } catch (error) {
    console.error(error);
    return res.status(400).json("error");
  }
};

const getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    return res.status(200).json(appointment);
  } catch (error) {
    return res.status(400).json("error");
  }
};

const getAppointmentByDate = async (req, res, next) => {
  try {
    const { day, month, year } = req.params;
    const formattedDate = `${day}/${month}/${year}`;
    const appointments = await Appointment.find({ date: formattedDate }).populate('user').populate('service').populate('stylist');

    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No se encontraron citas para esta fecha' });
    }

    return res.status(200).json(appointments);
  } catch (error) {
    console.error('Error al obtener citas por fecha:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}


const createAppointment = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { date, startTime, service: serviceId, stylist } = req.body;
    
    const formattedDate = moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY');

    const service = await Service.findById(serviceId);
    const stylistObj = await Stylist.findById(stylist);

    if (!service || !stylistObj) {
      return res.status(404).json({ error: 'Servicio o estilista no encontrado' });
    }

    const endTime = calculateEndTime(startTime, service.duration);

    const isIntervalAvailable = isAvailable(stylistObj, formattedDate, startTime, endTime);

    if (!isIntervalAvailable) {
      return res.status(400).json({ error: 'El intervalo de tiempo no está disponible' });
    }

    const endTimeWithBuffer = moment(endTime, 'HH:mm').add(service.duration, 'minutes');

    const isStylistAvailable = await Appointment.findOne({
      stylist: stylist,
      date: formattedDate,
      $or: [
        { $and: [
            { startTime: { $lt: endTimeWithBuffer.format('HH:mm') } },
            { endTime: { $gt: startTime } }
          ]
        }
      ]
    });
    
    if (isStylistAvailable) {
      return res.status(420).json({ error: 'El estilista no está disponible para este horario' });
    }

    stylistObj.workSchedule.forEach(schedule => {
      if (schedule.day === formattedDate) {
        schedule.timeSlots.push({ startTime, endTime });
      }
    });
    stylistObj.available = false;

    const newAppointment = new Appointment({
      date: formattedDate,
      startTime,
      endTime,
      user: userId,
      service: service._id, 
      stylist
    });

    stylistObj.appointments.push(newAppointment._id);

    await stylistObj.save();
    const appointmentSave = await newAppointment.save();
    await User.findByIdAndUpdate(userId, { $push: { appointments: appointmentSave._id } });
    
    return res.status(201).json(appointmentSave);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error en la solicitud");
  }
};

const deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "La cita no se encontró" });
    }

    const stylistId = appointment.stylist;

    const stylist = await Stylist.findById(stylistId);
    if (!stylist) {
      return res.status(404).json({ message: "El estilista no se encontró" });
    }

    stylist.appointments.pull(id);

    await stylist.save();

    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    await User.findByIdAndUpdate(deletedAppointment.user, { $pull: { appointments: id } });

    return res.status(200).json(deletedAppointment);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Error en la solicitud" });
  }
};

module.exports = {
  getAppointments,
  getAppointmentById,
  createAppointment,
  deleteAppointment,
  getAppointmentByDate
};
