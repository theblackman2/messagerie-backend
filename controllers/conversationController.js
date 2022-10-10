import Conversation, { MessageModel } from "../models/conversation.js";
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
    participants: { $all: participants },
  });

  if (existsConversation) return res.send(existsConversation);

  const createdConversation = await Conversation.create({
    participants: [...participants],
    messages: [],
  });

  return res.status(201).send(createdConversation);
};

export const addMessage = async (req, res) => {
  const { id, message } = req.body;
  if (!id || !message || !ObjectId.isValid(id))
    return res.status(400).send({
      type: "Error",
      message: "The request body must contain valid id and message",
    });

  const conversation = await Conversation.findOne({ _id: id });
  if (!conversation)
    return res.status(400).send({
      type: "Error",
      message: "The conversation doesn't exists",
    });

  const senderId = message.sender;
  if (!ObjectId.isValid(senderId))
    return res.status(400).send({
      type: "Error",
      message: "The sender id is not valid",
    });

  const createdMessage = await MessageModel.create({
    sender: senderId,
    text: message.text ? message.text : "",
    imageUrl: message.imageUrl ? message.imageUrl : "",
  });

  Conversation.updateOne(
    { _id: id },
    {
      $push: { messages: createdMessage },
    },
    (error, success) => {
      if (error)
        res.send({
          type: "Error",
          message: "Something went wrong",
        });
      else {
        MessageModel.deleteOne({ _id: createdMessage._id }, (error, done) => {
          if (error)
            res.status(400).send({
              type: "Error",
              message: "Sothing went wrong",
            });
          else {
            res.status(201).send({
              type: "Success",
              message: "Message created",
              data: success,
            });
          }
        });
      }
    }
  );
};

export const getRecents = async (req, res) => {
  const { id } = req.query;
  if (!id || !ObjectId.isValid(id))
    return res.status(400).send({
      type: "Error",
      message: "The request querries must contain a valid id",
    });

  const recents = await Conversation.find({
    participants: { $in: id },
  }).sort({ updatedAt: "desc" });

  res.send(recents);
};
