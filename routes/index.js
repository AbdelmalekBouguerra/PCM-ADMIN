const emp_table = require("../controllers/emp_table");
const auth = require("../controllers/auth");
const dpc = require("../controllers/dpc_table");
const express = require("express");
const res = require("express/lib/response");
const mc_table = require("../controllers/mc_table");
const pc_table = require("../controllers/pc_table");
const router = express.Router();

var user;
var Fl;
var Ln;

router.get("/", (req, res) => {
  res.render("login");
});

router
  .route("/dashboard")
  .post(auth.login)
  .get((req, res) => {
    if (req.session.isAuth) {
      user = req.session.user;
      Fl = user.PRENOM.charAt(0).toUpperCase();
      Ln = user.NOM.charAt(0).toUpperCase() + user.NOM.slice(1);
      res.render("dashboard", { user: user, FirstName: Fl, LastName: Ln });
    } else {
      res.render("login", {
        invalid: "You need to be authenticated to access this page",
      });
    }
  });

router.get("/shtab", (req, res) => {
  // todo change the mothed how you are passing user data
  // todo add a auth test
  user = req.session.user;
  Fl = user.PRENOM.charAt(0).toUpperCase();
  Ln = user.NOM.charAt(0).toUpperCase() + user.NOM.slice(1);
  res.render("sh", {
    FirstName: Fl,
    LastName: Ln,
  });
});
// to get sh table
router.route("/sh").get(emp_table.get).post(emp_table.post);
// MEDECINS_CONVENTIONNES table routes====================
router.get("/Medecins_conventionnes", (req, res) => {
  user = req.session.user;
  Fl = user.PRENOM.charAt(0).toUpperCase();
  Ln = user.NOM.charAt(0).toUpperCase() + user.NOM.slice(1);
  res.render("MC", {
    FirstName: Fl,
    LastName: Ln,
  });
});
router.route("/MC").get(mc_table.get).post(mc_table.post);
router.post("/deleteMC", mc_table.delete);
// -------------------------------------------------------

// PRESTATIONS_CMS =======================================
router.get("/Prestations_cms", (req, res) => {
  user = req.session.user;
  Fl = user.PRENOM.charAt(0).toUpperCase();
  Ln = user.NOM.charAt(0).toUpperCase() + user.NOM.slice(1);
  res.render("PC", {
    FirstName: Fl,
    LastName: Ln,
  });
});
router.route("/PC").get(pc_table.get).post(pc_table.post);
router.post("/deletePC", pc_table.delete);
// -------------------------------------------------------
router.get("/DPC", (req, res) => {
  res.render("DPC");
});

router.post("/deleteSH", emp_table.delete);

router.route("/DPCtable").get(dpc.get);

module.exports = router;
