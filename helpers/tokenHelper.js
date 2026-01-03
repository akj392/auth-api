const jwt = require("jsonwebtoken");

const generateAccessToken = (user) =>
    jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3m" });

const generateRefreshToken = (user) =>
    jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

const verifyRefreshToken = (token) =>
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

module.exports = { generateAccessToken, generateRefreshToken, verifyRefreshToken }
