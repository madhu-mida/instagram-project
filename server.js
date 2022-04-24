const express = require("express");
const { Store } = require("express-session");
const session = require("express-session");
const app = express();
const methodOverride = require("method-override");
require("dotenv").config();
require("./config/db");
const morgan = require("morgan");
const MongoStore = require("connect-mongo");

const PORT = process.env.PORT || 3000;

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));
app.use(morgan("tiny"));
app.use("/static", express.static("public"));

// Session middleware
app.use(
    session({
        secret: process.env.SECRET,
        store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
        saveUninitialized: true,
        resave: false,
    })
)

const UserRouter = require("./controllers/user");
app.use("/user", UserRouter)

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