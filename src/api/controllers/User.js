const { generateToken } = require("../../utils/jwt");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const getUsers = async (req, res, next) => {
    try {
      const users = await User.find()
      return res.status(200).json(users);
    } catch (error) {
      return res.status(400).json("error");
    }
};

const register = async (req, res, next) => {
    try {
      const userDuplicated = await User.findOne({ name: req.body.name });

      console.log(userDuplicated);
  
      if (userDuplicated) {
        return res.status(420).json("Usuario ya existente");
      }
  
      const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          rol: "user"
      });
      const user = await newUser.save();
      const token = generateToken(user._id);
      return res.status(201).json({ token, user })
    } catch (error) {
        console.error(error);
      return res.status(400).json("error");
    }
};

const login = async (req, res, next) => {
    try {
        const user = await User.findOne({name: req.body.name});
  
      if (!user) {
          return res.status(400).json("Usuario o contraseña incorrectos");
      }
  
      if(bcrypt.compareSync(req.body.password, user.password)) {
        const token = generateToken(user._id);
        return res.status(200).json( {user, token} )
    } else {
        return res.status(400).json("La contraseña es incorrecta 🚫");
    }
  
    } catch (error) {
        console.error(error);
      return res.status(400).json("error");
    }
  };



  module.exports = { getUsers, register, login}