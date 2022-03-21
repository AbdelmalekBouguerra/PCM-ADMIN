const emp_table = require('../controllers/emp_table');
const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.render('page');
});

router.route("/sh")
    .get(emp_table.get)
    .post(emp_table.post)

router.get("/Acte_medical", (req, res) => {
    res.render('Acte_medical');
});

router.get("/Structures_conventionnees", (req, res) => {
    res.render('SC');
});

module.exports = router;