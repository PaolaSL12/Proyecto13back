const { generateToken } = require("../../utils/seed/functions/jwt");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const getUsers = async (req, res, next) => {
    try {
      const users = await User.find().populate('appointments')
      return res.status(200).json(users);
    } catch (error) {
      return res.status(400).json("error");
    }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate({
      path: 'appointments',
      populate: [
        { path: 'stylist', model: 'stylists' },
        { path: 'service', model: 'services' } 
      ]
    });
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(400).json("error");
  }
};

const register = async (req, res, next) => {
  try {
    const userDuplicated = await User.findOne({ name: req.body.name });

    if (userDuplicated) {
      return res.status(420).json("Usuario ya existente");
    }

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      rol: "user",
    });

    const user = await newUser.save();

    const token = generateToken(user._id);

    return res.status(201).json({ token, user });
  } catch (error) {
    console.error(error);
    return res.status(400).json("error");
  }
};

const login = async (req, res, next) => {
  try {
    const name = req.body.name;
    const password = req.body.password;

    const user = await User.findOne({ name });

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(420).json("Usuario o contraseña incorrectos");
    }

    const token = generateToken(user._id);
    return res.status(200).json({ user, token });
} catch (error) {
    console.error(error);
    return res.status(400).json("Error al procesar la solicitud");
}
};



  module.exports = { getUsers, register, login, getUserById}