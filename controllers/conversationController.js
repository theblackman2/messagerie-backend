import Conversation from "../models/conversation.js";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

const validParticipants = (participants) =>
  new Promise((resolve, reject) => {
    participants.forEach((participant) => {
      if (!ObjectId.isValid(participant)) resolve(false);
    });
    resolve(true);
  });

export const getAll = async (req, res) => {
  const conversations = await Conversation.find();
  if (!conversations)
    return res.send({
      type: "Error",
      message: "Something went wrong",
    });
  res.send(conversations);
};

export const getOne = async (req, res) => {
  const id = req.params.id;
  if (!id || !ObjectId.isValid(id))
    return res.status(400).send({
      type: "Error",
      Message: "The id is required and must be valid",
    });
  const conversation = await Conversation.findOne({ _id: id });
  if (!conversation)
    return res.send({
      type: "Error",
      message: "The conversation doesn't exists",
    });
  res.send(conversation);
};

export const findOrCreate = async (req, res) => {
  const { participants } = req.body;
  if (!participants)
    return res.status(400).send({
      type: "Error",
      message: "The participants are required",
    });

  if (!Array.isArray(participants))
    return res.status(400).send({
      type: "Error",
      message: "The participants data must be an array",
    });

  if (participants.length < 2)
    return res.status(400).send({
      type: "Error",
      message: "There must be at least 2 participants",
    });

  const areValid = await validParticipants(participants);

  if (!areValid)
    return res.status(400).send({
      type: "Error",
      message: "There's something wrong with participants",
    });

  const existsConversation = await Conversation.findOne({
    participants: participants,
  });

  if (existsConversation) return res.send(existsConversation);

  const createdConversation = await Conversation.create({
    participants: [...participants],
    messages: [],
  });

  return res.status(201).send(createdConversation);
};
