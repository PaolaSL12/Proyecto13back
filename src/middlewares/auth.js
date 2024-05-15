const User = require("../api/models/User");
const { verifyToken } = require("../utils/seed/functions/jwt");


const isAuth = async (req, res, next) => {
    try {

        const token = req.headers.authorization;
        const parsedToken = token.replace("Bearer ", "");

        const { id } = verifyToken(parsedToken);
        const user = await User.findById(id);

        user.password = null;
        req.user = user;
        next();
        
    } catch (error) {
        return res.status(400).json("No estás autorizado")
    }
}

const isAdmin = async (req, res, next) => {
    try {

        const token = req.headers.authorization;
        const parsedToken = token.replace("Bearer ", "");

        const { id } = verifyToken(parsedToken);

        const user = await User.findById(id);

        if (user.rol === "admin") {
            user.password = null;
            req.user = user;
            next();
        } else {
            return res.status(400).json("No tienes autoriacion para relizar esta acción")
        }
    } catch (error) {
        return res.status(400).json("No estas autorizado")
    }
}

module.exports = { isAuth, isAdmin}
