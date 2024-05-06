const { getStylistById, getStylists, postStylist, deleteStylist } = require("../controllers/Stylist");

const stylistsRouter = require("express").Router();

stylistsRouter.get("/:id", getStylistById);
stylistsRouter.get("/", getStylists);
stylistsRouter.post("/post", postStylist);
stylistsRouter.delete("/:id", deleteStylist);

module.exports = stylistsRouter;