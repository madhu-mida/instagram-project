const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Post = require("../models/post")
var fs = require('fs');

const router = express.Router();

var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/tmp')
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, file.originalname)
    }
});

var upload = multer({ storage: storage });

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
        console.log("user :: ", user);
        req.session.loggedIn = true;
        req.session.email = email;
        req.session.userId = user._id;
        req.session.user = user;

        res.redirect("/user/home")
        // res.render("profile.ejs", { loginDetails: user })

    })
})

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        res.redirect("/user/login")
    })
})

router.get("/edit", (req, res) => {
    console.log(req.params.id)
    res.render("editprofile.ejs", { user: req.session.user })
})

router.put("/edit", upload.single("profileimage"), async (req, res) => {
    const userId = req.session.userId;
    console.log("req.file :: ", req.file);
    if (req.file) {
        let profileImageData = fs.readFileSync('/tmp/' + req.file.filename);
        let profileContentType = req.file.mimetype;
        let profileImage = {
            data: profileImageData,
            contentType: profileContentType
        }
        let result = await User.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    name: req.body.fullname,
                    bio: req.body.bio,
                    gender: req.body.gender,
                    image: profileImage
                }
            },
            { new: true }
        )
    } else {
        let result = await User.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    name: req.body.fullname,
                    bio: req.body.bio,
                    gender: req.body.gender
                }
            },
            { new: true }
        )
    }
    // console.log("Result", result)
    res.redirect("/profile")
})


router.get("/home", (req, res) => {
    const userId = req.session.userId;
    console.log(req.session.user)

    Post.find({ 'userId': { $ne: userId } }, (err, allPost) => {
        if (err) {
            console.log(err)
        }
        res.render("home.ejs", { allpost: allPost, user: req.session.user })
    })

})

router.post("/comment", async (req, res) => {
    const newComment = {
        user: {
            fullname: req.session.user.fullname,
            _id: req.session.user._id,
            username: req.session.user.username
        },
        comment: req.body.comment,
        createdAt: new Date()
    }
    console.log(req.body)
    let result = await Post.findOneAndUpdate(
        { _id: req.body.postid },
        { $push: { comment: newComment } },
        {
            returnOriginal: false
        }
    );
    console.log("result", result)
    res.send(result)

})

router.post("/like", async (req, res) => {
    let likeIncCount = 1;
    if (req.body.shouldDislike && req.body.shouldDislike === 'true') {
        likeIncCount = -1
    }
    console.log("req.body :: ", req.body);
    let result = await Post.findOneAndUpdate(
        { _id: req.body.postid },
        { $inc: { like: likeIncCount } },
        {
            returnOriginal: false
        }
    );
    if (req.body.shouldDislike && req.body.shouldDislike === 'true') {

        let userResult = await User.findOneAndUpdate(
            { _id: req.session.userId },
            { $pull: { likedPost: req.body.postid } },
            {
                returnOriginal: false
            }
        )
        let removeIndex = req.session.user.likedPost.indexOf(req.body.postid);
        req.session.user.likedPost.splice(removeIndex, 1);

    } else {
        let userResult = await User.findOneAndUpdate(
            { _id: req.session.userId },
            { $push: { likedPost: req.body.postid } },
            {
                returnOriginal: false
            }
        )

        req.session.user.likedPost.push(req.body.postid)
    }

    console.log("result", result)
    res.send(result)
})

router.post("/save", async (req, res) => {
    let saveIncCount = 1;
    if (req.body.shouldDisSave && req.body.shouldDisSave === 'true') {
        saveIncCount = -1
    }
    console.log("req.body :: ", req.body);
    let result = await Post.findOneAndUpdate(
        { _id: req.body.postid },
        { $inc: { save: saveIncCount } },
        {
            returnOriginal: false
        }
    );
    if (req.body.shouldDisSave && req.body.shouldDisSave === 'true') {

        let userResult = await User.findOneAndUpdate(
            { _id: req.session.userId },
            { $pull: { savedPost: req.body.postid } },
            {
                returnOriginal: false
            }
        )
        let removeIndex = req.session.user.savedPost.indexOf(req.body.postid);
        req.session.user.savedPost.splice(removeIndex, 1);

    } else {
        let userResult = await User.findOneAndUpdate(
            { _id: req.session.userId },
            { $push: { savedPost: req.body.postid } },
            {
                returnOriginal: false
            }
        )

        req.session.user.savedPost.push(req.body.postid)
    }

    console.log("result", result)
    res.send(result)
})



router.get("/show/:id", (req, res) => {
    res.render("showpost.ejs")
})

router.get("/savedPost", async (req, res) => {

})

module.exports = router;

