import asyncHandler from "express-async-handler";
import { User } from "../models/user.model.js";
import generateToken from "../config/generateToken.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const avatarPath = req.file?.path;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  console.log("avatar path:", avatarPath);
  let avatarUploaded;
  let avatar = "";
  if (avatarPath) {
    avatarUploaded = await uploadOnCloudinary(avatarPath);
    avatar = avatarUploaded?.url;
  }
  console.log("hello here is uploaded", avatarUploaded);
  console.log("hello here lies avatar:", avatar);
  const user = await User.create({
    name,
    email,
    password,
    avatar,
  });
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    throw new Error("Failed to create the user");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("data ", email, "   ", password);
  const user = await User.findOne({ email });
  console.log(user);
  if (user && (await user.matchPassword(password))) {
    console.log("is it her?");
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    console.log("its here hahah");
    throw new Error("failed to login");
  }
});

// /api/user?search=hero   queriess
const allUser = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          {
            name: { $regex: req.query.search, $options: "i" },
          },
          {
            email: { $regex: req.query.search, $options: "i" },
          },
        ],
      }:{};
    const users=await ( User.find(keyword)).find({_id:{$ne:req.user._id}})
    res.send(users)
  console.log(keyword);
});

export { registerUser, authUser, allUser };
