//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


mongoose.connect("mongodb://localhost:27017/UserDB", {useNewUrlParser: true, useUnifiedTopology: true});

app.get("/", function(req, res){
    res.render("home");
});


//create user schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
//encrypt password using secret string
//const secret = "ilovemoneyandwanttoberich.";

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });
//create user model
const User = new mongoose.model("User", userSchema);


app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});


app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
        
    });
//save new user
    newUser.save()
    .then(() =>{
        res.render("secrets");
    })
    .catch(err => {
        console.log(err);
    })
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    //find user by username
    User.findOne({email: username})
    .then((foundUser) =>{
        if(foundUser){
            if(foundUser.password === password){
                res.render("secrets");
            }
       } 
    })
    .catch(err => {
        console.log(err);
    });

});





app.listen(3000, function() {

    console.log("Server started on port 3000");
  
  });

