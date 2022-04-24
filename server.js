const express = require("express");
const app = express();
const methodOverride = require("method-override");
require("dotenv").config();
require("./config/db");
const morgan = require("morgan");

const PORT = process.env.PORT || 3000;

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));
app.use(morgan("tiny"));
app.use("/static", express.static("public"));

app.get("/login", (req, res) => {
    res.render("login.ejs")
})

app.get("/signup", (req, res) => {
    res.render("signup.ejs")
})

app.get("/profile", (req, res) => {
    res.render("profile.ejs")
})

app.get("/edit", (req, res) => {
    res.render("editprofile.ejs")
})

app.get("/createpost", (req, res) => {
    res.render("createpost.ejs")
})

app.get("/editpost", (req, res) => {
    res.render("editpost.ejs")
})

app.listen(3000, () => {
    console.log(`You are Listening to PORT: ${PORT}`);
})