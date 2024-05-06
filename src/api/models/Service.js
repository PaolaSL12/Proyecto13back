const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const serviceSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true }, 
    duration: { type: Number, required: true }
  },
  {
    timestamps: true,
    collection: "services"
  }
);

const Service = mongoose.model("services", serviceSchema, "services");
module.exports = Service;