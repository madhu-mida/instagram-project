const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

// Check for DB Connection and Errors
db.on("connected", () => {
    console.log("MongoDB Connected")
})
db.on("disconnected", () => {
    console.log("MongoDB Disconnected")
})
db.on("error", (err) => {
    console.log(err.message)
})