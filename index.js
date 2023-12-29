require("./src/models/transactions_models.js");
require("./src/models/user.js");

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const transactionsRoutes = require("./src/routes/transactionsRoutes.js");
const authRoutes = require("./src/routes/authRoutes");
const mongoose = require("mongoose");
// const multer  = require("multer");
// const path = require("path");
const app = express();

const mongoUri = "mongodb://127.0.0.1:27017/TugasKelompok";
mongoose.connect(mongoUri);
mongoose.connection.on("connected", ()  =>{
    console.log("Connected to mongo instance");
});

mongoose.connection.on("error", (err) => {
    console.error("Error connecting to mongo", err);
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // menangani x-www-form-urlencoded
// app.use("/images", express.static(path.join(__dirname, "images"))); //middleware to access images
// app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single("image"));


// Gunakan middleware body parser
app.use(express.json());

// router
app.use("/bdd",transactionsRoutes);
app.use("/users",authRoutes);

// handle error
app.use((error, req, res, next) => {
    const status = error.errorStatus || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data});
});


//serve
app.listen(2023, () =>{
    console.log("Server is up on port 2023");
});


/* 

// mongoose.connect('mongodb+srv://muqsitohaldilaandelasara:y3k1C9cZdt4dZgrX@cluster0.w9f3iug.mongodb.net/')
// .then(() => {
//     app.listen(PORT, () => console.log("Connection success"));
// })
// .catch(err => console.log("Error : =>", err))


Kita bisa menggunakan cors. install dulu library dengan npm install cors, lalu panggil cors nya

    app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Origin-Methods", 
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    res.setHeader(
        "Access-Control-Allow-Header", 
        "Content-Type", 
        "Authorization"
    );
    next();
    //BodyParser untuk ngebaca request yang dikirimkan user
})*/
