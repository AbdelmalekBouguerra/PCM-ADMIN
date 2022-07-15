/* Importation du module express. */
const express = require("express");

/* Importation des modules depuis le dossier controllers. */
const emp_table = require("../controllers/emp_table");
const auth = require("../controllers/auth");
const dpc = require("../controllers/dpc_table");
const mc_table = require("../controllers/mc_table");
const pc_table = require("../controllers/pc_table");
const smt_table = require("../controllers/smt_table");
const stp_table = require("../controllers/stp_table");
const act_table = require("../controllers/act_table");

/* Création d'un nouvel objet routeur. */
const router = express.Router();

/* Variable globale utilisée pour stocker le prénom et le nom de l'utilisateur. */
var user;
var Fl;
var Ln;

/* Il s'agit de la route de la page de connexion. */
router.get("/", (req, res) => {
  res.render("login");
});

/* Un itinéraire pour la page du tableau de bord. */
router
  .route("/dashboard")
  .post(auth.login)
  .get((req, res) => {
    if (req.session.isAdminAuth) {
      user = req.session.adminUser;
      Fl = user.PRENOM.charAt(0).toUpperCase();
      Ln = user.NOM.charAt(0).toUpperCase() + user.NOM.slice(1);
      res.render("dashboard", { user: user, FirstName: Fl, LastName: Ln });
    } else {
      res.render("login", {
        invalid: "You need to be authenticated to access this page",
      });
    }
  });
// Sh table routes==========================================
router.get("/shtab", (req, res) => {
  user = req.session.adminUser;
  Fl = user.PRENOM.charAt(0).toUpperCase();
  Ln = user.NOM.charAt(0).toUpperCase() + user.NOM.slice(1);
  res.render("sh", {
    FirstName: Fl,
    LastName: Ln,
  });
});
router.route("/sh").get(emp_table.get).post(emp_table.post);
// ---------------------------------------------------------

// MEDECINS_CONVENTIONNES table routes====================
router.get("/Medecins_conventionnes", (req, res) => {
  user = req.session.adminUser;
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
  user = req.session.adminUser;
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

// Liste des structures Médecine du travail =================
router.get("/Structures_Medecine_du_travail", (req, res) => {
  user = req.session.adminUser;
  Fl = user.PRENOM.charAt(0).toUpperCase();
  Ln = user.NOM.charAt(0).toUpperCase() + user.NOM.slice(1);
  res.render("smt", {
    FirstName: Fl,
    LastName: Ln,
  });
});
router.route("/SMT").get(smt_table.get).post(smt_table.post);
router.post("/deleteSMT", smt_table.delete);
// -------------------------------------------------------

// Liste des structures Tiers payant ========================
router.get("/Structures_Tiers_payant", (req, res) => {
  user = req.session.adminUser;
  Fl = user.PRENOM.charAt(0).toUpperCase();
  Ln = user.NOM.charAt(0).toUpperCase() + user.NOM.slice(1);
  res.render("stp", {
    FirstName: Fl,
    LastName: Ln,
  });
});
router.route("/STP").get(stp_table.get).post(stp_table.post);
router.post("/deleteSTP", stp_table.delete);
// ----------------------------------------------------------

// Liste des acts ==========================================
router.get("/Acts", (req, res) => {
  user = req.session.adminUser;
  Fl = user.PRENOM.charAt(0).toUpperCase();
  Ln = user.NOM.charAt(0).toUpperCase() + user.NOM.slice(1);
  res.render("act", {
    FirstName: Fl,
    LastName: Ln,
  });
});
router.route("/ACT").get(act_table.get).post(act_table.post);
router.post("/deleteACT", act_table.delete);
// ----------------------------------------------------------

// Liste des Demande prise en charge =======================
router.get("/DPC", (req, res) => {
  user = req.session.adminUser;
  Fl = user.PRENOM.charAt(0).toUpperCase();
  Ln = user.NOM.charAt(0).toUpperCase() + user.NOM.slice(1);
  res.render("DPC");
});
router.post("/deleteSH", emp_table.delete);
router.route("/DPCtable").get(dpc.get);
// ---------------------------------------------------------

/* traiter la demande de confirmation */
router.route("/DPC/confirm").post(dpc.confirm);
/* traiter la demande de rejet */
router.route("/DPC/rejet").post(dpc.reject);


module.exports = router;
