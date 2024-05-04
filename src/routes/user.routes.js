import { Router } from "express";
import {
  logInUser,
  logOutUser,
  registerUser,
} from "../controllers/users.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
  //completed
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/login").post(logInUser); //completed
// secure routes
router.route("/logout").post(
  //completed
  verifyJWT,
  logOutUser
);

export default router;
