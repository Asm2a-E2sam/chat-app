const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: "success",
            usersLength: users.length,
            data: {
                users,
            },
        });
    } catch (err) {
        res.status(400).json({
            message: "failed",
            err,
        });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "User not found",
            });
        }
        res.status(200).json({
            status: "success",
            data: {
                user,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: "Failed to get user",
            error: err,
        });
    }
};

exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        console.log(user);
        res.status(201).json({
            status: "success",
            data: {
                user,
            },
        });
    } catch (err) {
        const isUser = await User.findOne({ email: req.body.email });
        if (isUser) {
            res.status(402).json({ message: "email exists before" });
        }
        res.status(400).json({
            message: "failed",
            err,
        });
    }
};


exports.updateUser = async (req, res) => {
    let data = req.body;
    delete data.confirmPassword;
    try {
        const { password, confirmPassword } = req.body;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 12);
            req.body.password = hashedPassword;
        }
        const user = await User.findByIdAndUpdate(req.params.id, data, {
            new: true,
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        const token = jwt.sign({ userId: user._id }, "654TalkWaveUser");
        res.status(201).json({
            status: "success",
            data: {
                user,
                token,
            },
        });
    } catch (err) {
        res.status(400).json({
            message: "Failed to update user",
            error: err.message,
        });
    }
};
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) next(err);
        res.status(201).json({
            status: "success",
            data: {
                user,
            },
        });
    } catch (err) {
        res.status(400).json({
            message: "failed",
            err,
        });
    }
};

exports.getUsersByLocationID = async (req, res) => {
    try {
        const { locationID } = await User.find(req.query);
        res.status(201).json({
            status: "success",
            data: {
                user,
            },
        });
    } catch (err) {
        res.status(400).json({
            message: "failed",
            err,
        });
    }
};

// filter by Email
exports.getUserByEmail = async (req, res) => {
    var email = req.query.email;
    try {
        var user = await User.findOne({ email: email });
        if(!user){
            res.status(201).json({ message: "not user" });
        }else{
            res.status(201).json(user);
        }
    } catch (err) {
        res.status(422).json({ message: err.message });
    }
};

// check old password
exports.checkOldPassword = async (req, res) => {
    var currentPassword = req.body.currentPassword;
    var password = req.body.password;

    try {
        const isMatch = await bcrypt.compare(currentPassword, password);
        if (isMatch) {
            res.status(200).json({ match: true });
        } else {
            res.status(200).json({ match: false });
        }
    } catch (error) {
        console.error("Error comparing passwords:", error);
        res.status(500).json({ error: "Error comparing passwords" });
    }
};
