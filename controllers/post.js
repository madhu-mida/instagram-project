const express = require("express");
const Post = require("../models/post")
var fs = require('fs');
var path = require('path');
const router = express.Router();
var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });


router.get("/createpost", (req, res) => {
    console.log(req.session.userId)
    res.render("createpost.ejs")
})

router.post("/createpost", upload.single('image'), async (req, res) => {
    console.log(req.body)
    // console.log(req.file.filename)
    const newPost = {
        userId: req.session.userId,
        caption: req.body.caption,
        like: 0,
        comment: [],
        createdAt: new Date()
    }
    // a.img.data = fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename);
    // a.img.contentType = 'image/png';
    Post.create(newPost, (err, createdPost) => {
        console.log(newPost)
        console.log(createdPost)
    })
    res.redirect("/profile")
})

router.delete("/delete", (req, res) => {
    let userId = req.session.userId;
    Post.findOneAndDelete({ userId }, (err, deletedPost) => {
        if (err) console.log(err);
        res.redirect("/profile")
    })
})

module.exports = router;