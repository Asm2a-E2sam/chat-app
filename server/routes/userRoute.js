const express = require("express");
const router = express.Router();
const userController = require("./../controllers/userController");

router
    .route("/")
    .get(userController.getAllUsers)
    .post(userController.createUser);

router.get('/profile', userController.profile);

router.post('/login', userController.login);
router.post('/logout', userController.logout);

router.get("/email?:email",userController.getUserByEmail);
router
    .route("/:id")
    .get(userController.getUserById)
    .delete(userController.deleteUser)
    .patch(userController.updateUser);



module.exports = router;