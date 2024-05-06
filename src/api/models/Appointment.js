const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema(
  {
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }, 
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    service: { type: Schema.Types.ObjectId, ref: 'services', required: true }, 
    stylist: { type: Schema.Types.ObjectId, ref: 'stylists', required: true }, 
  },
  {
    timestamps: true,
    collection: "appointments"
  }
);

const Appointment = mongoose.model("appointments", appointmentSchema, "appointments");
module.exports = Appointment;