const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("user");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).send({ error: "Anda harus login." });
    }

    const token = authorization.replace("Bearer ", "");
    
    jwt.verify(token, 'jwtSecret', async (err, payload) => {
        if (err) {
            return res.status(401).send({ error: "Anda harus login terlebih dahulu." });
        }

        const { userId, role, operation } = payload;

        if (role !== "admin") {
            return res.status(401).send({ error: "Role anda tidak dapat melakukan akses tersebut." });
        }

        if (operation !== "signin") {
            return res.status(401).send({ error: "Token tidak valid untuk operasi ini." });
        }

        const user = await User.findById(userId);
        req.user = user;
        next();
    });
};