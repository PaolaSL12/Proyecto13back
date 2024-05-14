const { getUsers, register, login, getUserById } = require("../controllers/User");

const usersRouter = require("express").Router();

usersRouter.get("/:id", getUserById);
usersRouter.get("/", getUsers);
usersRouter.post("/register", register);
usersRouter.post("/login", login)



module.exports = usersRouter;