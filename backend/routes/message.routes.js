import {Router} from "express"
import { verifyLoggedIn } from "../middlewares/auth.middleware.js"
import { sendMessage,allMessage } from "../controllers/message.controller.js";

const router=Router()



router.route('/').post(verifyLoggedIn,sendMessage)
router.route('/:chatId').get(verifyLoggedIn,allMessage)

export default router;