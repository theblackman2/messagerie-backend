import User from "../models/user.js";
import { compare, encrypt } from "../services/bcrypt.js";

export const getAll = async (req, res) => {
  const users = await User.find();
  res.send(users);
};

export const register = async (req, res) => {
  const { pseudo, password } = req.body;
  if (!pseudo || !password)
    return res.status(400).json({
      type: "Error",
      message: "The pseudo and password are required",
    });

  const existsUser = await User.findOne({ pseudo });

  if (existsUser)
    return res.json({
      type: "Error",
      message: "This pseudo is already used",
    });

  const cryptedPassword = await encrypt(password);
  const user = await User.create({
    pseudo,
    password: cryptedPassword,
  });
  if (user)
    res.status(201).json({
      type: "success",
      message: "The user is created",
    });
  else
    res.status(500).json({
      type: "Error",
      message: "Something went wrong",
    });
};

export const login = async (req, res) => {
  const { pseudo, password } = req.body;
  if (!pseudo || !password)
    return res.status(400).json({
      type: "Error",
      message: "The pseudo and password are required",
    });

  const foundUser = await User.findOne({ pseudo: pseudo });

  if (!foundUser)
    return res.json({
      type: "Error",
      message: "Le pseudo que vous avez entré est incorrect",
    });

  const cryptedPassword = foundUser.password;
  const match = await compare(password, cryptedPassword);
  if (!match)
    return res.json({
      type: "Error",
      message: "Le mot de passe entré est incorrecte",
    });
  res.send("User connected");
};
