const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const router = express.Router();

router.get("/signup", (req, res) => {
    res.render("signup.ejs")
});

router.post("/signup", async (req, res) => {
    console.log("before creating", req.body)
    req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))
    User.create(req.body, (err, user) => {
        console.log("after creating", req.body)
        if (err) console.log(err);
        res.redirect("/user/login")
    })
})

router.get("/login", (req, res) => {
    res.render("login.ejs")
});

router.post("/login", async (req, res) => {
    console.log(req.body)
    const { email, password } = req.body;
    User.findOne({ email }, async (err, user) => {

        if (err || !user) {
            return res.send("User Not Exist")
        }

        const passwordMatches = await bcrypt.compare(password, user.password)
        if (!passwordMatches) {
            return res.send("Incorrect Password");
        }

        req.session.loggedIn = true;
        req.session.email = email;

        res.redirect("/profile")

    })
})

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        res.redirect("/user/login")
    })
})

module.exports = router;

