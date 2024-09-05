import { mongoose } from "mongoose";
import { Message } from "../models/message.model.js";
import asyncHandler from "express-async-handler";
import { Chat } from "../models/chat.model.js";

const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;
  if (!content || !chatId) {
    console.log("Invalid ata passed into request");
    return res.sendStatus(400);
  }
  try {
    const createdMessage = await Message.create({
      sender: req.user._id,
      content,
      chat: chatId,
    });

    const message = await Message.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(createdMessage._id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "sender",
          pipeline: [
            {
              $project: {
                password: 0,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "chats",
          localField: "chat",
          foreignField: "_id",
          as: "chat",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "users",
                foreignField: "_id",
                as: "users",
                pipeline: [
                  {
                    $project: {
                      password: 0,
                    },
                  },
                ],
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "groupAdmin",
                foreignField: "_id",
                as: "groupAdmin",
                pipeline: [
                  {
                    $project: {
                      password: 0,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                groupAdmin: {
                  $first: "$groupAdmin",
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          chat: {
            $first: "$chat",
          },
          sender: {
            $first: "$sender",
          },
        },
      },
    ]);
    await Chat.findByIdAndUpdate(
      chatId,
      { $set: { latestMessage: createdMessage } },
      { new: true }
    );

    res.json(message[0]);
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await Message.aggregate([
      {
        $match: {
          chat: new mongoose.Types.ObjectId(chatId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "sender",
          pipeline: [{ $project: { password: 0 } }],
        },
      },
      {
        $lookup: {
          from: "chats",
          localField: "chat",
          foreignField: "_id",
          as: "chat",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "users",
                foreignField: "_id",
                as: "users",
                pipeline: [
                  {
                    $project: {
                      password: 0,
                    },
                  },
                ],
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "groupAdmin",
                foreignField: "_id",
                as: "groupAdmin",
                pipeline: [
                  {
                    $project: {
                      password: 0,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                groupAdmin: {
                  $first: "$groupAdmin",
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          sender: {
            $first: "$sender",
          },
          chat: {
            $first: "$chat",
          },
        },
      },
    ]);
    res.json(messages);
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error(error.message);
  }
});
export { sendMessage, allMessage };
