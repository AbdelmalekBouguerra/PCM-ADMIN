/* Importation du module express. */
const express = require("express");

/* Importation des modules depuis le dossier controllers. */
const sh_table = require("../controllers/sh_table");
const auth = require("../controllers/auth");
const dpc = require("../controllers/dpc_table");
const mc_table = require("../controllers/mc_table");
const pc_table = require("../controllers/pc_table");
const smt_table = require("../controllers/smt_table");
const stp_table = require("../controllers/stp_table");
const act_table = require("../controllers/act_table");

const createPDF = require("../controllers/createDPC");

/* Création d'un nouvel objet routeur. */
const router = express.Router();

/* Variable globale utilisée pour stocker le prénom et le nom de l'utilisateur. */
var user;
// var Fl;
// var Ln;

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
      // Fl = user.PRENOM.charAt(0).toUpperCase();
      // Ln = user.NOM.charAt(0).toUpperCase() + user.NOM.slice(1);
      res.render("dashboard", { user: user });
    } else {
      res.render("login", {
        invalid: "You need to be authenticated to access this page",
      });
    }
  });
// Sh table routes==========================================
router.get("/shtab", (req, res) => {
  user = req.session.adminUser;
  // Fl = user.PRENOM.charAt(0).toUpperCase();
  // Ln = user.NOM.charAt(0).toUpperCase() + user.NOM.slice(1);
  res.render("sh");
});
/* obtenir la table (get) et ajouter les nouvelles lignes (post) */
router.route("/sh").get(sh_table.get).post(sh_table.post);
/* supprimer les lignes sélectionnées */
router.post("/deleteSH", sh_table.delete);
// ---------------------------------------------------------

// MEDECINS_CONVENTIONNES table routes====================
router.get("/Medecins_conventionnes", (req, res) => {
  user = req.session.adminUser;
  // Fl = user.PRENOM.charAt(0).toUpperCase();
  // Ln = user.NOM.charAt(0).toUpperCase() + user.NOM.slice(1);
  res.render("MC");
});
/* obtenir la table (get) et ajouter les nouvelles lignes (post) */
router.route("/MC").get(mc_table.get).post(mc_table.post);
/* supprimer les lignes sélectionnées */
router.post("/deleteMC", mc_table.delete);
// -------------------------------------------------------

// PRESTATIONS_CMS =======================================
router.get("/Prestations_cms", (req, res) => {
  user = req.session.adminUser;
  // Fl = user.PRENOM.charAt(0).toUpperCase();
  // Ln = user.NOM.charAt(0).toUpperCase() + user.NOM.slice(1);
  res.render("PC");
});
/* obtenir la table (get) et ajouter les nouvelles lignes (post) */
router.route("/PC").get(pc_table.get).post(pc_table.post);
/* supprimer les lignes sélectionnées */
router.post("/deletePC", pc_table.delete);
// -------------------------------------------------------

// Liste des structures Médecine du travail =================
router.get("/Structures_Medecine_du_travail", (req, res) => {
  user = req.session.adminUser;
  // Fl = user.PRENOM.charAt(0).toUpperCase();
  // Ln = user.NOM.charAt(0).toUpperCase() + user.NOM.slice(1);
  res.render("smt");
});
/* obtenir la table (get) et ajouter les nouvelles lignes (post) */
router.route("/SMT").get(smt_table.get).post(smt_table.post);
/* supprimer les lignes sélectionnées */
router.post("/deleteSMT", smt_table.delete);
// -------------------------------------------------------

// Liste des structures Tiers payant ========================
router.get("/Structures_Tiers_payant", (req, res) => {
  user = req.session.adminUser;
  // Fl = user.PRENOM.charAt(0).toUpperCase();
  // Ln = user.NOM.charAt(0).toUpperCase() + user.NOM.slice(1);
  res.render("stp");
});
/* obtenir la table (get) et ajouter les nouvelles lignes (post) */
router.route("/STP").get(stp_table.get).post(stp_table.post);
/* supprimer les lignes sélectionnées */
router.post("/deleteSTP", stp_table.delete);
// ----------------------------------------------------------

// Liste des acts ==========================================
router.get("/Acts", (req, res) => {
  user = req.session.adminUser;
  // Fl = user.PRENOM.charAt(0).toUpperCase();
  // Ln = user.NOM.charAt(0).toUpperCase() + user.NOM.slice(1);
  res.render("act");
});
/* obtenir la table (get) et ajouter les nouvelles lignes (post) */
router.route("/ACT").get(act_table.get).post(act_table.post);
/* supprimer les lignes sélectionnées */
router.post("/deleteACT", act_table.delete);
// ----------------------------------------------------------

// Liste des Demande prise en charge =======================
router.get("/DPC", (req, res) => {
  user = req.session.adminUser;
  // Fl = user.PRENOM.charAt(0).toUpperCase();
  // Ln = user.NOM.charAt(0).toUpperCase() + user.NOM.slice(1);
  res.render("DPC");
});
/* obtenir toutes les demandes */
// router.get("/DPCAlltable", dpc.getAll);
// /* obtenir toutes les demandes rejetées. */
// router.get("/DPCRejectedtable", dpc.getRejected);
// /* obtenir les demandes non encore traitées par l'administrateur */
router.route("/DPCtable").get(dpc.get);
/* traiter la demande de confirmation */
router.route("/DPC/confirm").post(dpc.confirm);

// /* traiter la demande de rejet */
// router.route("/DPC/rejet").post(dpc.reject);
// ---------------------------------------------------------

router.get("/createDPC/:id", createPDF);
module.exports = router;
