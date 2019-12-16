
const generateRandomString = n => {
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
      allURLs[shortURL] = urlDatabase[shortURL].longURL;
    }
  }

  return allURLs;
}



const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session')
const cookies = require('cookie-parser')
const bcrypt = require('bcrypt');
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ['ayy', 'what', 'up', 'my', 'dudes', 'it is wednesday'],
}))

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
  },
}

const urlDatabase = {
  b6UTxQ: { longURL: "http://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "http://www.facebook.ca", userID: "userRandomID" },
  b34KGO: { longURL: "http://www.tsn.ca", userID: "aJ00lW" },
  i3BoGR: { longURL: "http://www.lighthouselabs.ca", userID: "abc123" }
};

app.get("/", (req, res) => {
  res.redirect("/login");
});


// pretty sure no bug!
app.get("/urls", (req, res) => {
  let userid = users[req.session.userID].id;
  const userURLs = urlsForUser(userid);
  if (userURLs) {
    const user = users[req.session.userID].id
    let templateVars = { urls: userURLs, user: user };
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/login");
  }
});


app.get("/urls/new", (req, res) => {
  const user = users[req.session.userID]
  if (user) {
    console.log("running for sure")
    let templateVars = { user: user };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login")
  }
});


// JH sez: buggy.  also no auth.
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

// JH sez: buggy
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(`${longURL}`);
});


app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.userID
  };
  console.log("after creating the new url is :", urlDatabase);
  res.redirect(`urls/${shortURL}`)
});


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


// JH sez: buggy.  also no auth.
app.post("/urls/:shortURL", (req, res) => {
  console.log('running app.post("/urls/:shortURL');
  let newLongURL = req.body.longURL;
  urlDatabase[req.params.shortURL] = newLongURL;
  res.redirect("/urls");
})


app.post("/urls/:shortURL/delete", (req, res) => {
  const email = req.body.email;
  if (findUser(email)) {
    delete urlDatabase[req.params.shortURL];
  } else {
    res.redirect("/urls");
  }
})


app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email === "" || password === "") {
    res.sendStatus(403);
  } else {
    let user = findUser(email);
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        req.session.userID = user.id;
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


app.post("/logout", (req, res) => {
  req.session = null
  res.redirect("/urls");
})


app.get("/registration", (req, res) => {
  const user = users[req.session.userID]
  let templateVars = {
    user: user
  };
  res.render("registration", templateVars);
})


app.post("/registration", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userID = generateRandomString(6);
  if (email === '' && password === '') {
    res.sendStatus(400);
    return;
  }
  if (findUser(email)) {
    res.sendStatus(400);
    return;
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  users[userID] = {
    id: userID,
    email: email,
    password: hashedPassword,
  };
  req.session.userID = userID;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
