const express = require("express");
const { Store } = require("express-session");
const session = require("express-session");
const app = express();
const methodOverride = require("method-override");
require("dotenv").config();
require("./config/db");
const morgan = require("morgan");
const MongoStore = require("connect-mongo");

const User = require("./models/user")
const Post = require("./models/post")

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

const PostRouter = require("./controllers/post");
app.use("/post", PostRouter)

app.get("/", (req, res) => {
    res.redirect("/user/login")
})

app.get("/profile", async (req, res) => {
    console.log(req.session.user)
    const userId = req.session.userId;
    console.log("IIII", userId)
    console.log(typeof userId)
    const records = await Post.find({ '_id': { $in: req.session.user.savedPost } });
    console.log(records)
    Post.find({ userId }, (err, allPost) => {
        if (err) {
            console.log(err)
        }
        res.render("profile.ejs", { allpost: allPost, user: req.session.user, savedPost: records })
    })



})





app.get("/editpost", (req, res) => {
    res.render("editpost.ejs")
})

app.listen(PORT, () => {
    console.log(`You are Listening to PORT: ${PORT}`);
})