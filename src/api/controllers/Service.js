const Service = require("../models/Service");

const getServices = async (req, res, next) => {
    try {
      const service = await Service.find();
      return res.status(200).json(service);
    } catch (error) {
      return res.status(400).json("error");
    }
  };

  const getServicesById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const service = await Service.findById(id);
      return res.status(200).json(service);
    } catch (error) {
      return res.status(400).json("error");
    }
  };

  const postService = async (req, res, next) => {
    try {
        const newService = new Service(req.body);
        const serviceSave = await newService.save();
        return res.status(201).json(serviceSave)
    } catch (error) {
        console.error(error);
        return res.status(400).json("Error en la solicitud")
    }
}

  const deleteService = async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedService = await Service.findByIdAndDelete(id);
      return res.status(200).json(deletedService);
    } catch (error) {
      return res.status(400).json("error");
    }
  };
  

  module.exports = { getServices, getServicesById, postService, deleteService }