import { Router } from "express";
import {allUser, authUser, registerUser} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyLoggedIn } from "../middlewares/auth.middleware.js";
const router=Router();

router.route("/register").post(upload.single('avatar'),registerUser);
router.route("/login").post(authUser)
router.route("/").get(verifyLoggedIn,allUser);
// router.route("/LoggedInUser").get(verifyLoggedIn,currentLoggedInUser)


//google auth routes

export default router;