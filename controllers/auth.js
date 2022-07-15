const ldap = require("ldapjs");
const db = require("../env/db");

// retrive the username
function getUser(username, callback) {
  db.execute(
    "SELECT * FROM DEMANDEUR WHERE USERNAME = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
      callback(results);
    }
  );
}

// connect to LDAP server
function authLDAP(username, password, res) {
  const client = ldap.createClient({
    url: "ldap://10.111.106.11:389",
  });

  client.bind("SONATRACH\\" + username, password, (err) => {
    if (err) {
      console.log(
        "Error in LDAP connection : " + err + "for user : " + username
      );
    } else {
      console.log("Success LDAP connection for user " + username);
      res.render("index", {
        invalid: "password is incorrect",
        password: password,
        username: username,
      });
    }
  });
}
// get the post request sent by the index form
exports.login = (req, res) => {
  const { username, password } = req.body;

  if (password !== "0000") {
    res.render("login", {
      invalid: "password is incorrect",
      password: password,
      username: username,
    });
  } else {
    req.session.isAdminAuth = true; // bool value to check if user logged in
    getUser(username, (user) => {
      req.session.adminUser = user[0]; // save user information in session value
      req.session.adminUsername = username;
      var Fl = user[0].PRENOM.charAt(0).toUpperCase();
      var Ln = user[0].NOM.charAt(0).toUpperCase() + user[0].NOM.slice(1);
      res.render("dashboard", { user: user[0], FirstLetter: Fl, LastName: Ln });
    });
  }
  // authLDAP(username,password,res);
};
