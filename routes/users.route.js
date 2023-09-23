const express = require("express");

const router = express.Router();

const usersController = require("../controllers/users.controller");
const verifyToken = require("../middlewares/verfiyToken");
const userRoles = require("../utils/userRoles");
const allowedTo = require("../middlewares/allowedTo");

router
  .route("/")
  .get(verifyToken, allowedTo(userRoles.MANGER), usersController.getAllUsers);

router
  .route("/register")
  .post(verifyToken, allowedTo(userRoles.MANGER), usersController.register);

router.route("/login").post(usersController.login);

// delete user
router
  .route("/:id")
  .delete(verifyToken, allowedTo(userRoles.MANGER), usersController.deleteUser);

// update user
router
  .route("/:id")
  .patch(verifyToken, allowedTo(userRoles.MANGER), usersController.updateUser);

// logout user
router.route("/logout").post(verifyToken, usersController.logout);

// get user (current user by token)
router.route("/me").get(verifyToken, usersController.getCurrentUser);

// get user by id
router
  .route("/:id")
  .get(verifyToken, allowedTo(userRoles.MANGER), usersController.getUserById);

module.exports = router;
