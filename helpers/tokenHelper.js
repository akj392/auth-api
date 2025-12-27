const jwt = require("jsonwebtoken");

const generateAccessToken = (user) =>
    jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (user) =>
    jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

module.exports = { generateAccessToken, generateRefreshToken }
