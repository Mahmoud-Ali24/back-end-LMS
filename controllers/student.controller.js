const { validationResult } = require("express-validator");

const Student = require("../models/student.model");

const httpStatusText = require("../utils/httpStatusText");
const { json } = require("express");
const asyncWrapper = require("../middlewares/asyncWrapper.JS");
const appError = require("../utils/appError");

const getAllStudents = asyncWrapper(async (req, res, next) => {
  const students = await Student.find();
  res.json({ status: httpStatusText.SUCCESS, data: { students } });
});

const getStudentById = asyncWrapper(async (req, res, next) => {
  const student = await Student.findOne({ id: req.params.id });
  if (!student) {
    const error = appError.create(
      "student not found",
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }
  return res.json({ status: httpStatusText.SUCCESS, data: { student } });
});

const createNewStudent = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }
  const newStudent = new Student(req.body);
  await newStudent.save();
  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { newStudent } });
});

const deleteStudent = asyncWrapper(async (req, res) => {
  const student = await Student.findOneAndDelete({ id: req.params.id });
  if (!student) {
    return res
      .status(404)
      .json({ status: httpStatusText.FAIL, message: "Student not found" });
  }

  res.json({ status: httpStatusText.SUCCESS, data: null });
});

const updateStudent = asyncWrapper(async (req, res) => {
  const updateStudent = await Student.findOneAndUpdate(
    { id: req.params.id },
    { $set: { ...req.body } }
  );
  res.json({ status: httpStatusText.SUCCESS, data: { updateStudent } });
});

module.exports = {
  getAllStudents,
  getStudentById,
  createNewStudent,
  deleteStudent,
  updateStudent,
};
