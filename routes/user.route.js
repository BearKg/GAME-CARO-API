const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateInfo,
  changePassword,
  updateAllScore,
  getUserByToken,
} = require("../controllers/user.controller");
const authenticate = require("../middleware/authenticate");

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);
router.route("/auth/getUser").get(authenticate, getUserByToken);
router.route("/updateAll").put(updateAllScore);
router.route("/updateInfo/:id").patch(updateInfo);
// router.route("/changePassword/:id").patch(changePassword);
module.exports = router;
