const { validationResult } = require("express-validator");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const Purchase = require("../models/purchase");

const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: "Algo salió mal" });
  }

  try {
    const { email, userName, name, lastName, password } = req.body;

    const newUser = new User({
      email,
      userName,
      name,
      lastName,
      password,
      role: "client",
    });

    const salt = bcrypt.genSaltSync();
    newUser.password = bcrypt.hashSync(password, salt);

    await newUser.save();
    res.status(200).json({ message: `User created successfully`, status: 200 });
  } catch (error) {
    return res.status(400).json({
      message: "Cannot create user",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({
      mensaje: "Cannot found any user",
    });
  }
};

const getInfoUser = async (req, res) => {
  const { userName } = req.params;
  try {
    const userData = await User.findOne(
      { userName },
      "email role lastName name id"
    );
    res.json(userData);
  } catch (error) {
    return res.status(400).json({
      mensaje: "Cannot found any user",
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOneAndDelete({ _id: id });

    if (user) {
      return res.status(200).json({
        mensaje: "User deleted succefully!",
      });
    }

    return res.status(400).json({
      mensaje: "User not found!",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Cannot delete user",
      error,
    });
  }
};

module.exports = { createUser, getUsers, deleteUser, getInfoUser };
