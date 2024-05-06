const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stylistSchema = new Schema(
  {
    name: { type: String, required: true },
    availability: [
      {
        day: { type: String, required: true },
        start_time: { type: String, required: true }, 
        end_time: { type: String, required: true },
        available: { type: Boolean, default: true } 
      }
    ]
  },
  {
    timestamps: true,
    collection: "stylists"
  }
);

stylistSchema.methods.markAvailable = function(date, startTime, endTime) {
  const slot = this.availability.find(slot => slot.day === date && slot.start_time === startTime && slot.end_time === endTime);
  if (slot) {
    slot.available = true;
  }
};

const Stylist = mongoose.model("stylists", stylistSchema, "stylists");
module.exports = Stylist;