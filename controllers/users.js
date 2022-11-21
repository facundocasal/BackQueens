const { validationResult } = require("express-validator");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const { userNameOrEmail } = require("../helpers/loginValidate");

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

const editUser = async (req, res) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: "Algo salió mal" });
  }
  const { email, userName, name, lastName, passOld, password } = req.body;
  const { id } = req.params;
  const user = await User.findById(id);
  // const user = await User.findById(req.userId)
  // const user = await User.findById(id)
  // console.log(user)
  try {
    if (!passOld) {
      res.status(401).json({ message: "debes ingresar tu contraseña " });
    }
    const match = await bcrypt.compare(passOld, user.password);
    if (match) {
      const userMatchName = await User.findOne({ userName });
      if (userMatchName) {
        if (id != userMatchName._id) {
          res
            .status(401)
            .json({ message: "nombre de usuario ya se encuentra registrado" });
        }
      }
      const userEmailMatch = await User.findOne({ email: email });
      if (userEmailMatch) {
        if (id != userEmailMatch._id) {
          res
          .status(401)
          .json({ message: "email ya se encuentra registrado" });
        }
      }
      if (!password) {
        await User.findByIdAndUpdate(
          { _id: id },
          {
            email: email,
            userName: userName,
            name: name,
            lastName: lastName,
          },
          { new: true }
        );
        res.status(200).json({ message: "Usuario Modificado" });
      } else {
        const salt = bcrypt.genSaltSync();
        passwordEncript = bcrypt.hashSync(password, salt);
        // await User.findByIdAndUpdate({_id : req.userId}, {
        await User.findByIdAndUpdate(
          { _id: id },
          {
            email: email,
            userName: userName,
            name: name,
            lastName: lastName,
            password: passwordEncript,
          },
          { new: true }
        );
        res.status(200).json({ message: "Usuario Modificado" });
      }
    } else {
      res.status(401).json({ message: "credenciales incorrectas" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createUser, getUsers, deleteUser, getInfoUser, editUser };
