const express = require("express");
const { getAllGamesByUserId } = require("../controllers/game.controller");
const authenticate = require("../middleware/authenticate");
const router = express.Router();

router.route("/user/game").get(authenticate, getAllGamesByUserId);

module.exports = router;
