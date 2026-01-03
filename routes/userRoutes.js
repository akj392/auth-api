const router = require('express').Router();
const bcrypt = require("bcryptjs");
const uuid = require('uuid');
const authenticate = require('../middlewares/auth.middleware')
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../helpers/tokenHelper');
const users = [];

router.get('/all', (req, res) => {
    res.json(users);
});

router.get("/me", authenticate, (req, res) => {
    res.json({ message: "Protected", user: req.user });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);
    if (!user) return res.sendStatus(401);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.sendStatus(401);

    const payload = { id: user.id, email: user.email };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });

    res.json({ accessToken });
});


router.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
    }

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        ...req.body,
        id: uuid.v4(),
        password: hashedPassword,
    };
    users.push(newUser);

    const payload = { id: newUser.id, email };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.SECURE_FLAG,
        sameSite: "lax",
    });

    res.status(201).json({
        message: "Signup successful!",
        accessToken,
    });
});

router.post("/refresh", (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.sendStatus(401);
    }

    try {
        const decoded = verifyRefreshToken(refreshToken);

        const payload = { id: decoded.id, email: decoded.email };

        const newAccessToken = generateAccessToken(payload);
        const newRefreshToken = generateRefreshToken(payload);

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        return res.json({ accessToken: newAccessToken });
    } catch (err) {
        return res.sendStatus(403);
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("refreshToken");
    res.sendStatus(204);
});

module.exports = router;

