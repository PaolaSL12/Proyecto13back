const Stylist = require("../models/Stylist");


const getStylists = async (req, res, next) => {
    try {
      const stylists = await Stylist.find();
      return res.status(200).json(stylists);
    } catch (error) {
      return res.status(400).json("error");
    }
  };

  const getStylistById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const stylist = await Stylist.findById(id);
      return res.status(200).json(stylist);
    } catch (error) {
      return res.status(400).json("error");
    }
  };

  const postStylist = async (req, res, next) => {
    try {
        const newStylist = new Stylist(req.body);
        const stylistSave = await newStylist.save();
        return res.status(201).json(stylistSave)
    } catch (error) {
        console.error(error);
        return res.status(400).json("Error en la solicitud")
    }
}

  const deleteStylist = async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedStylist = await Stylist.findByIdAndDelete(id);
      return res.status(200).json(deletedStylist);
    } catch (error) {
      return res.status(400).json("error");
    }
  };
  

  module.exports = { getStylists, getStylistById, postStylist, deleteStylist }