const { getServicesById, getServices, postService, deleteService } = require("../controllers/Service");

const servicesRouter = require("express").Router();

servicesRouter.get("/:id", getServicesById);
servicesRouter.get("/", getServices);
servicesRouter.post("/post", postService);
servicesRouter.delete("/:id", deleteService);

module.exports = servicesRouter;