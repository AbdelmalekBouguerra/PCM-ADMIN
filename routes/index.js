const emp_table = require("../controllers/emp_table");
const auth = require("../controllers/auth");
const dpc = require("../controllers/dpc_table");
const express = require("express");
const res = require("express/lib/response");
const router = express.Router();

const openExplorer = require('open-file-explorer');


router.get("/", (req, res) => {
  res.render("login");
});

router.get("/dpc1",(req,res) => {
  console.log("hiii :=) hiiii");
  var auth = true
  module.exports = auth;
})

router
  .route("/dashboard")
  .post(auth.login)
  .get((req, res) => {
    if (req.session.isAuth) {
      var user = req.session.user;
      console.log("🚀 ~ file: index.js ~ line 15 ~ .get ~ user", user);
      var Fl = user.PRENOM.charAt(0).toUpperCase();
      var Ln = user.NOM.charAt(0).toUpperCase() + user.NOM.slice(1);
      console.log(Ln);
      res.render("dashboard", { user: user, FirstLetter: Fl, LastName: Ln });
    } else {
      res.render("login", {
        invalid: "You need to be authenticated to access this page",
      });
    }
  });

router.get("/shtab", (req, res) => {
  res.render("sh");
});

router.route("/sh").get(emp_table.get).post(emp_table.post);

router.get("/Acte_medical", (req, res) => {
  res.render("Acte_medical");
});

/* Rendering the SC.hbs file. */
router.get("/Structures_conventionnees", (req, res) => {
  res.render("SC");
});

router.get("/DPC", (req, res) => {
  res.render("DPC");
});

router.post("/deleteSH", emp_table.delete);

router.route("/DPCtable").get(dpc.get);

router.get('/openFolder',(req,res) => {
  const path = '/home/abdelmalek/projects';
openExplorer(path, err => {
    if(err) {
        console.log(err);
    }
    else {
        console.log("successful");
    }
});
})
module.exports = router;
