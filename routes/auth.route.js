const express = require("express");
const router = express.Router();
const {
  loginController,
  registerController,
  loginControllerForAdmin,
  logoutController,
} = require("../controllers/auth.controller");
const testAdmin = require("../middleware/test-admin");

const rateLimiter = require("express-rate-limit");
const authenticate = require("../middleware/authenticate");
const {
  changePassword,
  updateInfo,
} = require("../controllers/user.controller");
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    msg: "Too many requests from this IP, please try again after 15 minutes",
  },
});

router.route("/login").post(loginController);
router.route("/logout").post(logoutController);
router.route("/register").post(apiLimiter, registerController);
router.route("/admin").post(loginControllerForAdmin);
router.route("/changePassword").patch(authenticate, changePassword);
router.route("/updateInfo").patch(authenticate, updateInfo);
module.exports = router;
