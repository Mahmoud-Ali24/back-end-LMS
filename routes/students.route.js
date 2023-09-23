const express = require("express");

const router = express.Router();

const studentsController = require("../controllers/student.controller");
const { validationSchema } = require("../middlewares/validationSchema");

router
  .route("/")
  .get(studentsController.getAllStudents)
  .post(validationSchema(), studentsController.createNewStudent);

router
  .route("/:id")
  .get(studentsController.getStudentById)
  .delete(studentsController.deleteStudent)
  .patch(studentsController.updateStudent);

module.exports = router;
