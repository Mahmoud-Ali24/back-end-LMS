const { body } = require("express-validator");
const validationSchema = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("name is require")
      .isLength({ min: 2 })
      .withMessage("name must be at least 2 characters"),
  ];
};

module.exports = {
  validationSchema,
};
