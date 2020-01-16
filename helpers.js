// function for generate random string for shortURL
const generateRandomString = n => {
  let result = '';
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < n; i++) {
    const random = Math.floor(Math.random() * 60);
    result += chars[random];
  }
  return result;
};

// function for check user if user is log in
const findUser = (email, users) => {
  for (let id in users) {
    if (users[id].email === email) {
      return users[id];
    }
  }
  return null;
}

// Match each url in url database for each user 
const urlsForUser = (id, urlDatabase) => {
  const allURLs = {};
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      allURLs[shortURL] = urlDatabase[shortURL].longURL;
    }
  }
  return allURLs;
}


module.exports = {
  generateRandomString,
  findUser,
  urlsForUser
};
