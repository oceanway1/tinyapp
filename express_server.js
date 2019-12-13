function generateRandomString(n) {
  let result = '';
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < n; i++) {
    const random = Math.floor(Math.random() * 60);
    result += chars[random];
  }
  return result;
};

const findUser = email => {
  for (let id in users) {
    if (users[id].email === email) {
      return users[id];
    }
  }
  return null;
}


const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookies = require('cookie-parser')

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookies());

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.get("/urls", (req, res) => {
  const user = users[req.cookies.userID]
  let templateVars = { urls: urlDatabase, user: user };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = users[req.cookies.userID]
  let templateVars = { user: user };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.cookies.userID]
  let templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL, user: user };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
app.post("/urls", (req, res) => {
  console.log(req.body);
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
  const email = req.body.email;
  const password = req.body.password;


  // const userID = req.cookies(userID);

  if (email === "" || password === "") {
    res.sendStatus(403);
  } else {
    //find the email 
    let user = findUser(email);
    if (user) {
      //check the password 
      if (user.password === password) {
        //everything is fine
        res.cookie("userID", user.id);
        res.redirect("/urls");
      } else {
        res.sendStatus(403);
      }
    } else {
      res.sendStatus(403);
    }
  }
  // if (findUser(email)) {
  //   res.cookie("userID", userID)
  //   // userData[username] = username;
  //   // console.log(userData);
  //   res.redirect("/urls");
  // } else {
  //   res.send("bad login");
  // }for (const userId in users) {
  // if (users[userId].email === email && users[userId].password === password) {
  //   res.sendStatus(403);
  // }
  // if (findUser(email)) {
  //   res.sendStatus(400);
  //   return;
  // }
  // //1. Check whether the useremail and password are there
  // //2. If Yes(email, password){
  // if (email == "") {
  //   res.sendStatus(403);
  // }
  // if (findUser(email)) {
  //   if (users[userID].password !== password) {
  // res.sendStatus(403);}
  //  else {

  // }

  //     if ( matcghes){
  //   return usermatched
  // } else {
  //   username / password does not match
  // }
  //           } else {
  //   email does not exists in the urlDatabase.
  //           }
  //         else {
  //   please enter the username and password.they can't be null
  // }
  //   //}
  //   //

});

app.get("/login", (req, res) => {
  const user = users[req.cookies.userID]

  let templateVars = {
    user: user
  }
  res.render("login", templateVars);
})
app.post("/logout", (req, res) => {
  res.clearCookie("userID");
  res.redirect("/urls");
})
app.get("/registration", (req, res) => {
  const user = users[req.cookies.userID]
  let templateVars = {
    user: user
  };
  res.render("registration", templateVars);
})

app.post("/registration", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userID = generateRandomString(6);
  users[userID] = {};
  //check if email already exists
  //use found user with email
  //if true then duplicate email
  // if false then allow user to make us
  // const FoundUserWithEmail = 
  if (email == '' && password == '') {
    res.sendStatus(400);
    return;
  }
  if (findUser(email)) {
    res.sendStatus(400);
    return;
  }
  users[userID].id = userID;
  users[userID].email = email;
  users[userID].password = password;
  res.cookie("userID", userID);
  console.log(users)
  //make a function that loops through the users and finds a matching email
  res.redirect("/urls");
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});








