import User from "../models/user.js";
import { compare, encrypt } from "../services/bcrypt.js";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export const getAll = async (req, res) => {
  const users = await User.find({ active: true }, { pseudo: 1, imageUrl: 1 });
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
      message:
        "Le pseudo que vous avez entré est déjà utilisé, si vous êtes la même personne connectez-vous",
    });

  const cryptedPassword = await encrypt(password);
  const user = await User.create({
    pseudo,
    password: cryptedPassword,
  });
  if (user) {
    const payload = {
      id: user._id,
      pseudo: user.pseudo,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "1d" });
    res.status(201).send({
      type: "success",
      message: "The user is created",
      user: {
        id: user._id,
        pseudo: user.pseudo,
        active: user.active,
        token: `Bearer ${token}`,
      },
    });
  } else
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

  const payload = {
    pseudo: foundUser.pseudo,
    id: foundUser.id,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "1d" });

  res.send({
    type: "Success",
    message: "User loged in",
    user: {
      id: foundUser._id,
      pseudo: foundUser.pseudo,
      active: foundUser.active,
      token: `Bearer ${token}`,
    },
  });
};
