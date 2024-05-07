const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stylistSchema = new Schema(
  {
    name: { type: String, required: true },
    workSchedule: [{
      day: { type: String, required: true },
      timeSlots: [{
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
      }]
    }],
    daysOff: [{ type: String, required: true }],
    available: { type: Boolean, default: true },
    appointments: [{ type: Schema.Types.ObjectId, ref: 'appointments' }]
  },
  {
    timestamps: true,
    collection: "stylists"
  }
);

stylistSchema.methods.markAvailable = function(date, startTime, endTime) {
  const slot = this.workSchedule.find(slot => slot.day === date && slot.startTime <= startTime && slot.endTime >= endTime && !this.daysOff.includes(date));
  return !!slot;
};

const Stylist = mongoose.model("stylists", stylistSchema, "stylists");
module.exports = Stylist;