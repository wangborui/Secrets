//jshint esversion:6
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const md5 = require('md5');

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
  const newUser = new Login({
    username: req.body.username,
    password: md5(req.body.password)
  })

  newUser.save((err) => {
    if(err){
      console.log(err);
    } else {
      res.render("secrets");
    }
  })
});

app.post("/login", (req, res) => {
  Login.findOne({username: req.body.username}, (err, foundUser) => {
    if(err || !foundUser) {
      console.log(err);
    } else {
      if(foundUser.password === md5(req.body.password)) {
        res.render("secrets");
      } else {
        res.render("error");
      }
    }
  })
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
