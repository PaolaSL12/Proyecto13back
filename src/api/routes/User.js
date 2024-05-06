const { getUsers, register, login } = require("../controllers/User");

const usersRouter = require("express").Router();

usersRouter.get("/", getUsers);
usersRouter.post("/register", register);
usersRouter.post("/login", login)



module.exports = usersRouter;