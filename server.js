const express = require("express");
const app = express();
const methodOverride = require("method-override");
require("dotenv").config();
require("./config/db");

const PORT = process.env.PORT || 3000;

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));



app.listen(3000, () => {
    console.log(`You are Listening to PORT: ${PORT}`);
})