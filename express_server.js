function generateRandomString(n) {
  let result = '';
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < n; i++) {
    const random = Math.floor(Math.random() * 60);
    result += chars[random];
  }
  return result;
};

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookies = require('cookie-parser')

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookies());

const userData = {};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.get("/urls", (req, res) => {
  const username = req.cookies.username;
  console.log("username", username);
  let templateVars = { urls: urlDatabase, username: username };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const username = req.cookies.username;
  let templateVars = { username: username };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  // const longURL = ...
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  const shortURL = generateRandomString(6);
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`urls/${shortURL}`)
});
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
})

app.post("/urls/:shortURL", (req, res) => {
  let newLongURL = req.body.longURL;
  urlDatabase[req.params.shortURL] = newLongURL;
  console.log(newLongURL);
  res.redirect("/urls");
})

app.post("/urls/:id", (req, res) => {
  res.redirect("/urls");
})

app.post("/login", (req, res) => {
  const username = req.body.username;
  // const password = req.body.password;
  if (username) {
    res.cookie("username", username)
    // userData[username] = username;
    // console.log(userData);
    res.redirect("/urls");
  } else {
    res.send("bad login");
  }
})

app.get("/login", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
  }
  res.render("urls_index", templateVars);
})
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
})
// app.get("/register", (req, res) => {
// res.


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



