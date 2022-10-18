import User from "../models/user.js";
import { compare, encrypt } from "../services/bcrypt.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import cloudinary from "../services/cloudinary.js";

const ObjectId = mongoose.Types.ObjectId;

const secret = process.env.JWT_SECRET;

export const getAll = async (req, res) => {
  const users = await User.find({ active: true }, "pseudo imageUrl");
  res.send(users);
};

export const getOne = async (req, res) => {
  const id = req.params.id;
  if (!id || !ObjectId.isValid(id))
    return res.status(400).send({
      type: "Error",
      message: "The request body must contain a valid id",
    });

  const user = await User.findOne({ _id: id, active: true }, { password: 0 });
  if (!user)
    return res.send({
      type: "Error",
      message: "The user doesn't exists",
    });

  res.send(user);
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
        "Il y a une erreur avec le pseudo que vous voulez utiliser, si l'erreur persiste, créez-en un autre",
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
        imageUrl: user.imageUrl,
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
      message:
        "Les identifiants que vous avez entré sont incorrectes, veillez réessayer",
    });

  const cryptedPassword = foundUser.password;
  const match = await compare(password, cryptedPassword);
  if (!match)
    return res.json({
      type: "Error",
      message:
        "Les identifiants que vous avez entré sont incorrectes, veillez réessayer",
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
      imageUrl: foundUser.imageUrl,
    },
  });
};

export const updateProfileImage = async (req, res) => {
  const { userId, encodedFile } = req.body;
  if (!userId || !encodedFile) return res.sendStatus(400);
  const user = User.findOne({ _id: userId });
  if (!user) return res.sendStatus(401);
  let imageUrl = null;
  try {
    const response = await cloudinary.uploader.upload(encodedFile, {
      upload_preset: process.env.CLOUD_PRESET,
    });
    imageUrl = response.public_id;
  } catch (err) {
    return res.status(500).send(err);
  }

  const updated = await User.updateOne(
    { _id: userId },
    { $set: { imageUrl: imageUrl } }
  );
  if (!updated) return res.sendStatus(500);
  return res.json({
    type: "success",
    data: {
      response: updated,
      imageUrl: imageUrl,
    },
  });
};
