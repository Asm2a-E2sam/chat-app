const express = require("express");
const router = express.Router();
const userController = require("./../controllers/userController");
const authController = require('../controllers/authController');

router
    .route("/")
    .get(userController.getAllUsers)
    .post(userController.createUser);

router.get("/email?:email",userController.getUserByEmail);
router.get("/checkPassword",userController.checkOldPassword);

router
    .route("/:id")
    .get(userController.getUserById)
    .delete(userController.deleteUser)
    .patch(userController.updateUser);

module.exports = router;