const express = require("express");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = mongoose.model("user");
const router = express.Router();

router.post("/signin", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username });

        // Generate token with operation "signin"
        const token = jwt.sign({ userId: user._id, role: 'admin', operation: 'signin' }, 'jwtSecret');
        res.send(token);
    } catch (err) {
        res.status(422).send(err.message);
    }
});

router.get("/", async (req, res) => {
    const users = await User.find();
    res.status(200).send(users);
});

router.post("/signup", async (req, res) => {
    try {
        const { email, username, password } = req.body;
        // Generate salt and hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Save user with hashed password
        const user = new User({ email, username, password: hashedPassword });
        await user.save();

        /// Generate token with operation "signup"
        const token = jwt.sign({ userId: user._id, role: 'admin', operation: 'signup' }, 'jwtSecret');
        // Send token and success message in one response
        res.send({ token, message: "Sign Up Success" });
    } catch (err) {
        res.status(422).send(err.message);
    }
});

module.exports = router;