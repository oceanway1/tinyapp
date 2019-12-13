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


const urlsForUser = id => {
  const allURLs = {};
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      allURLs[shortURL] = urlDatabase[shortURL];
    }
  }

  return allURLs;
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
  "aJ48lW": {
    id: "aJ48lW",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}


const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "userRandomID" }
};

app.get("/urls", (req, res) => {
  const userID = req.cookies.userID;
  if (userID) {
    console.log('in urls handler - userID:', userID);
    const userURLs = urlsForUser(userID);
    if (userURLs) {
      const user = users[req.cookies.userID]
      let templateVars = { urls: userURLs, user: user };
      res.render("urls_index", templateVars);
    }
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/new", (req, res) => {
  const userID = req.cookies.userID;
  // const password = req.body.password;
  // const user = findUser(email);
  if (userID) {
    const user = users[userID]
    let templateVars = { user: user };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login")
  }
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
  res.redirect("/urls");
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

