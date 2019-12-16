const generateRandomString = n => {
  let result = '';
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < n; i++) {
    const random = Math.floor(Math.random() * 60);
    result += chars[random];
  }
  return result;
};


const getUserByEmail = email => {
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




module.exports = {
  getUserByEmail
};