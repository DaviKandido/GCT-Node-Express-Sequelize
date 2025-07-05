const express = require("express");
const usersController = require("../controllers/user.controller");

const router = express.Router();

router.post("/sign-up", usersController.signUp);
router.post("/login", usersController.login);

module.exports = router;