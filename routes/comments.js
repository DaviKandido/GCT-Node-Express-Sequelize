const express = require("express");
const commentsController = require("../controllers/comment.controller");

const router = express.Router();

router.post("/", commentsController.save);
router.get("/:id", commentsController.show);
router.get("/", commentsController.index);
router.patch("/:id", commentsController.update);
router.delete("/:id", commentsController.destroy);

module.exports = router;