
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');
const users = {};
const urlDatabase = {};
const { generateRandomString, findUser, urlsForUser } = require('./helpers');
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ['ayy', 'what', 'up', 'my', 'dudes', 'it is wednesday'],
}))

// Redirect to login page
app.get("/", (req, res) => {
  res.redirect("/login");
});

// Home page route
app.get("/urls", (req, res) => {
  const user = users[req.session.userID]
  if (!user) {
    return res.redirect("/login")
  }
  let userid = users[req.session.userID].id;
  const userURLs = urlsForUser(userid, urlDatabase);
  let templateVars = { urls: userURLs, user: user };
  res.render("urls_index", templateVars);
});

// new url route
app.get("/urls/new", (req, res) => {
  const user = users[req.session.userID]
  if (user) {
    let templateVars = { user: user };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login")
  }
});

// show shortURL route
app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.session.userID]
  if (user) {
    let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: user };
    res.render("urls_show", templateVars);
  }
  else {
    res.redirect("/login");
  }
});

// redirect to longUrl page from shortURL route
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(`${longURL}`);
});

// post new urls 
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.userID
  };
  res.redirect(`urls/${shortURL}`)
});

// add new url in url route
app.post("/urls/:id", (req, res) => {
  const nURL = req.body.newURL;
  const id = req.params.id;
  const user = users[req.session.userID]
  if (user) {
    urlDatabase[id].longURL = nURL;
    res.redirect("/urls");
  } else {
    res.send("please login ");
  }
});

// Route to shortened URL
app.post("/urls/:shortURL", (req, res) => {
  let newLongURL = req.body.longURL;
  urlDatabase[req.params.shortURL] = newLongURL;
  res.redirect("/urls");
})

// Delelte url database for user
app.post("/urls/:shortURL/delete", (req, res) => {
  const user = users[req.session.userID]
  if (user) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  }
})

//login verification
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email === "" || password === "") {
    return res.sendStatus(403);
  } else {
    const user = findUser(email, users);
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        req.session.userID = user.id;
        res.redirect("/urls");
      } else {
        return res.sendStatus(403);
      }
    } else {
      return res.sendStatus(403);
    }
  }
});

// route for login 
app.get("/login", (req, res) => {
  const user = users[req.session.userID]
  if (user) {
    res.redirect('/urls');
  } else {
    let templateVars = {
      user: null
    }
    res.render("login", templateVars);
  }
});

// after logout process, redirect user to login page
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
})

//route for registratrion
app.get("/registration", (req, res) => {
  const user = users[req.session.userID]
  let templateVars = {
    user: user
  };
  res.render("registration", templateVars);
})

//registration process, verifaction 
app.post("/registration", (req, res) => {
  const email = req.body.email;
  let password = bcrypt.hashSync(req.body.password, 10);
  const userID = generateRandomString(6);
  if (email === '' && password === '') {
    res.sendStatus(400);
    return;
  }
  if (findUser(email, users)) {
    res.sendStatus(400);
    return;
  }
  users[userID] = {
    id: userID,
    email: email,
    password: password,
  };
  req.session.userID = userID;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
