const express = require("express");

const router = express.Router();

const classesController = require("../controllers/class.controller");

router
  .route("/")
  .get(classesController.getAllClasses)
  .post(classesController.createNewClass);

router
  .route("/:id")
  .get(classesController.getClassById)
  .delete(classesController.deleteClass)
  .patch(classesController.updateClass);

module.exports = router;
