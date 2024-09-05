import asyncHandler from "express-async-handler";
import { Chat } from "../models/chat.model.js";
import { mongoose } from "mongoose";

//to get the chats of one one chat if available and if not then create one
const accessChat = asyncHandler(async (req, res) => {
  const user = req.user;
  const { userId } = req.body; // sending the id of person we want to create one on one chat with

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  console.log("type:", typeof req.user._id, "and ", typeof userId);
  //for showing already created chats
  const chat = await Chat.aggregate([
    {
      $match: {
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: req.user._id } } },
          {
            users: { $elemMatch: { $eq: new mongoose.Types.ObjectId(userId) } },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "users",
        foreignField: "_id",
        as: "users",
        pipeline: [
          {
            $project: {
              name: 1,
              email: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "messages",
        localField: "latestMessage",
        foreignField: "_id",
        as: "latestMessage",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "sender",
              foreignField: "_id",
              as: "sender",
              pipeline: [
                {
                  $project: {
                    name: 1,
                    avatar: 1,
                    email: 1,
                  },
                },
              ],
            },
          },
          {
            $project: {
              content: 1,
              sender: { $arrayElemAt: ["$sender", 0] },
            },
          },
        ],
      },
    },
  ]);
  console.log("checckingg sirrr", chat);
  if (chat.length > 0) {
    console.log("bom", chat);
    res.send(chat[0]);
  } else {
    console.log("creating new chat");
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [userId, req.user._id],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.aggregate([
        {
          $match: {
            _id: createdChat._id,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "users",
            foreignField: "_id",
            as: "users",
            pipeline: [
              {
                $project: {
                  name: 1,
                  email: 1,
                  avatar: 1,
                },
              },
            ],
          },
        },

        {
          $lookup: {
            from: "messages",
            localField: "latestMessage",
            foreignField: "_id",
            as: "latestMessage",
            pipeline: [
              {
                $lookup: {
                  from: "users",
                  localField: "sender",
                  foreignField: "_id",
                  as: "sender",
                  pipeline: [
                    {
                      $project: {
                        name: 1,
                        avatar: 1,
                        email: 1,
                      },
                    },
                  ],
                },
              },
              {
                $project: {
                  content: 1,
                  sender: { $arrayElemAt: ["$sender", 0] },
                },
              },
            ],
          },
        },
      ]);
      console.log("pom", FullChat);
      res.status(200).send(FullChat[0]);
    } catch (err) {
      console.log("accessChat error here", err);
      res
        .status(500)
        .send({ message: "Failed to create or retrieve chat", error: err });
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    const LoggedInUser = req.user;
    const allChats = await Chat.aggregate([
      {
        $match: {
          users: { $elemMatch: { $eq: LoggedInUser._id } },
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "latestMessage",
          foreignField: "_id",
          as: "latestMessage",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "sender",
                pipeline: [
                  {
                    $project: {
                      name: 1,
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
              },
            },
            {
              $project: {
                content: 1,
                sender: 1,
                // sender:{$arrayElemAt:["$sender",0]}
              },
            },
          ],
        },
      },
      {
        $lookup:{
          from:"users",
          localField:"users",
          foreignField:"_id",
          as:"users",
          pipeline:[
            {
              $project:{
                password:0
              }
            }
          ]
        }
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
      // {
      //   $project: {
      //     isGroupChat: 1,
      //     chatName: 1,
      //     latestMessage: 1,
      //     users:1,
      //   },
      // },
      {
        $sort: {
          updatedAt: -1,
        },
      },
    ]);

    res.status(200).send(allChats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: "Failed to fetch chats", error });
  }
});

// create groupChat
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  var users = JSON.parse(req.body.users);
  console.log("is it users here?", users);
  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }
  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      isGroupChat: true,
      users,
      chatName: req.body.name,
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await Chat.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(groupChat._id) } },
      {
        $lookup: {
          from: "users",
          localField: "users",
          foreignField: "_id",
          as: "users",
          pipeline: [
            {
              $project: {
                name: 1,
                email: 1,
                avatar: 1,
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
    ]);
    console.log(fullGroupChat);
    res.status(200).json(fullGroupChat[0]);
  } catch (error) {
    res.status(400).message("yippe its wrong budbak");
  }
});

//rename group
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  let updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { $set: { chatName } },
    { new: true }
  );
  console.log(updatedChat);
  updatedChat=await Chat.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(updatedChat._id) } },
    {
      $lookup: {
        from: "users",
        localField: "users",
        foreignField: "_id",
        as: "users",
        pipeline: [
          {
            $project: {
              name: 1,
              email: 1,
              avatar: 1,
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
  ])
  if(!updatedChat){
    res.status(404);
    throw new Error("Chat not found")
  }
  else{
    res.json(updatedChat[0]);
  }
});

//add to group
const addToGroup=asyncHandler(async(req,res)=>{
    const {userId,chatId}=req.body;

    try {
        let updatedChat = await Chat.findByIdAndUpdate(
          chatId,
          {
            $push: { users: userId }
          },
          {
            new: true
          }
        );
        updatedChat=await Chat.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(updatedChat._id) } },
            {
              $lookup: {
                from: "users",
                localField: "users",
                foreignField: "_id",
                as: "users",
                pipeline: [
                  {
                    $project: {
                      name: 1,
                      email: 1,
                      avatar: 1,
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
          ])
        if (!updatedChat[0]) {
          return res.status(404).json({ message: 'Chat not found' });
        }
        

        res.status(200).json(updatedChat[0]);
      } catch (error) {
        console.error('Error adding user to group:', error);
        res.status(500).json({ message: 'Failed to add user to group', error });
      }
    
})

const removeFromGroup=asyncHandler(async(req,res)=>{
    const {userId,chatId}=req.body;

    try {
        let updatedChat = await Chat.findByIdAndUpdate(
          chatId,
          {
            $pull: { users: userId }
          },
          {
            new: true
          }
        );
        updatedChat=await Chat.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(updatedChat._id) } },
            {
              $lookup: {
                from: "users",
                localField: "users",
                foreignField: "_id",
                as: "users",
                pipeline: [
                  {
                    $project: {
                      name: 1,
                      email: 1,
                      avatar: 1,
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
          ])
        if (!updatedChat[0]) {
          return res.status(404).json({ message: 'Chat not found' });
        }
        

        res.status(200).json(updatedChat[0]);
      } catch (error) {
        console.error('Error removing user from group:', error);
        res.status(500).json({ message: 'Failed to remove user from group', error });
      }
    
})
export { accessChat, fetchChats, createGroupChat,renameGroup ,addToGroup,removeFromGroup};
