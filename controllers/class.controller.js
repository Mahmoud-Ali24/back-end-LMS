const { validationResult } = require("express-validator");

const Class = require("../models/classes.model");

const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middlewares/asyncWrapper.JS");

const getAllClasses = asyncWrapper(async (req, res) => {
  const classes = await Class.find();
  res.send({ status: httpStatusText.SUCCESS, data: { classes } });
});

const getClassById = asyncWrapper(async (req, res, next) => {
  const classs = await Class.findOne({ id: req.params.id });
  if (!classs) {
    const error = appError.create("class not found", 404, httpStatusText.FAIL);
    return next(error);
  }
  res.json({ status: httpStatusText.SUCCESS, data: { classs } });
});

const createNewClass = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }
  const newClass = new Class(req.body);
  await newClass.save();
  res.status(201).json({ status: httpStatusText.SUCCESS, data: { newClass } });
});

const deleteClass = asyncWrapper(async (req, res) => {
  const classs = await Class.findOneAndDelete({ id: req.params.id });

  if (!classs)
    return res
      .status(404)
      .json({ status: httpStatusText.FAIL, message: "Class not found" });

  res.status(201).json({ status: httpStatusText.SUCCESS, data: { classs } });
});

const updateClass = asyncWrapper(async (req, res) => {
  const updateClass = await Class.findOneAndUpdate(
    { id: req.params.id },
    { $set: { ...req.body } }
  );
  res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { updateClass } });
});

module.exports = {
  getAllClasses,
  getClassById,
  createNewClass,
  deleteClass,
  updateClass,
};
