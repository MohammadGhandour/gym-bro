const UserModel = require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.singUp = async (req, res) => {
    const { username, password } = req.body;

    const userAlreadyExists = await UserModel.findOne({ username: username });
    if (!userAlreadyExists) {
        bcrypt.hash(password, 10)
            .then((hash) => {
                try {
                    UserModel.create({ username: username, password: hash })
                        .then((user) => {
                            UserModel.findOne({ username: username })
                                .then((registeredUser) => {
                                    if (!registeredUser) {
                                        res.status(404).json({ error: "User doesn't exist." })
                                    } else {
                                        res.status(200).json({
                                            userId: registeredUser._id,
                                            token: jwt.sign(
                                                { userId: registeredUser._id },
                                                process.env.WORKOUT_TOKEN,
                                                { expiresIn: '365d' }
                                            ),
                                            username
                                        });
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                    res.status(404).json({ error: "User not found." });
                                })
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(500).json({ error: err.message });
                        })
                } catch (err) {
                    console.log(err);
                    res.status(400).json({ error: err.message })
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({ error: err.message })
            })
    } else {
        res.status(400).json({ error: "User already exists !" });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username: username });
        if (!user) {
            res.status(404).json({ error: "User doesn't exist." })
        } else {
            bcrypt.compare(password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: "Password is incorrect !" })
                    } else {
                        res.status(200).json({
                            userId: user._id,
                            token: jwt.sign(
                                { userId: user._id },
                                process.env.WORKOUT_TOKEN,
                                { expiresIn: '168h' }
                            ),
                            username
                        });
                    }
                })
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message })
    }
};

exports.getUser = async (req, res) => {
    const userId = req.params.userId;
    await UserModel.findById(userId)
        .then((user) => {
            if (!user) {
                res.status(404).json({ error: "User doesn't exist." })
            } else {
                res.status(200).json(user);
            }
        })
        .catch((err) => {
            res.status(404).json({ error: "Couldn't find user" + err })
        })
}