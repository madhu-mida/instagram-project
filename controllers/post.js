const express = require("express");
const Post = require("../models/post")
var fs = require('fs');
var path = require('path');
const router = express.Router();
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
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


router.get("/createpost", (req, res) => {
    console.log(req.session.userId)
    res.render("createpost.ejs")
})

router.post("/createpost", upload.single("image"), async (req, res) => {
    //console.log("req.body", req.body)
    //console.log("req.files", req.file)
    const newPost = {
        userId: req.session.userId,
        caption: req.body.caption,
        like: 0,
        save: 0,
        comment: [],
        createdAt: new Date(),
        image: {}
    }
    //var imgData = fs.readFileSync(path.join('/tmp/' + req.file.filename));
    //console.log("imgData base64 :: ", base64data);
    console.log("req.file.filename :: ", req.file.filename, req.body.caption);
    newPost.image.data = fs.readFileSync(path.join('/tmp/' + req.file.filename));
    newPost.image.contentType = req.file.mimetype;
    Post.create(newPost, (err, createdPost) => {
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error("Error while removing file", err)
            }
            //file removed
        })
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