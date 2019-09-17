//jshint esversion:6
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO
//mongoose
mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const loginSchema = new mongoose.Schema({
  username: String,
  password: String
});

const Login = mongoose.model("Login", loginSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new Login({
      username: req.body.username,
      password: hash
    });
    newUser.save((err) => {
      if(err){
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });
});

app.post("/login", (req, res) => {
  Login.findOne({username: req.body.username}, (err, foundUser) => {
    if(err || !foundUser) {
      console.log(err);
    } else {
      bcrypt.compare(req.body.password, foundUser.password, function(err, isMatched) {
        if(isMatched === true) {
          res.render("secrets");
        } else {
          res.render("error");
        }
      });
    }
  })
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
