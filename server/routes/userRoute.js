const express = require("express");
const router = express.Router();
const userController = require("./../controllers/userController");

router
    .route("/")
    .get(userController.getAllUsers)
    .post(userController.createUser);

router.get("/email?:email",userController.getUserByEmail);

router
    .route("/:id")
    .get(userController.getUserById)
    .delete(userController.deleteUser)
    .patch(userController.updateUser);

router.post('/login', userController.login);


module.exports = router;