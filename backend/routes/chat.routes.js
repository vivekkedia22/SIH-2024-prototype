import {Router} from "express"
import { verifyLoggedIn } from "../middlewares/auth.middleware.js";
import { accessChat, fetchChats ,createGroupChat,renameGroup,addToGroup,removeFromGroup} from "../controllers/chat.controller.js";
const router=Router();
router.route("/").post(verifyLoggedIn,accessChat )
router.route("/").get(verifyLoggedIn,fetchChats)
router.route("/group").post(verifyLoggedIn,createGroupChat)
router.route("/rename").put(verifyLoggedIn,renameGroup)
router.route("/groupremove").put(verifyLoggedIn,removeFromGroup) //add a person to group
router.route("/groupadd").put(verifyLoggedIn,addToGroup) // remove a person from a group 

export default router