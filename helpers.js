// const users = {
//   "userRandomID": {
//     id: "userRandomID",
//     email: "user@example.com",
//     password: "purple-monkey-dinosaur"
//   },
//   "aJ48lW": {
//     id: "aJ48lW",
//     email: "user2@example.com",
//     password: "dishwasher-funk"
//   },
// }
const users ={};

 
// const urlDatabase = {
//   shortURL: {longURL: '', username: ""},
//   shortURL: {longURL: '', username: "" }
// };



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


const urlsForUser = (id,urlDatabase) => {
  console.log(urlDatabase)
  console.log(id)
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
