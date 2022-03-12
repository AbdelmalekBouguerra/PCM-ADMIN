const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.render('page');
});

router.get("/employeur", (req, res) => {
    res.render('employeur');
});

router.get("/Acte_medical", (req, res) => {
    res.render('Acte_medical');
});

router.get("/Structures_conventionnees", (req, res) => {
    res.render('SC');
});
module.exports = router;