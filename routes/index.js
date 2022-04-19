const emp_table = require('../controllers/emp_table');
const auth = require('../controllers/auth');
const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.render('login');
});

router.route('/dashboard')
    .post(auth.login)
    .get((req,res) =>{
        if (req.session.isAuth){
        var user = req.session.user;
        console.log("🚀 ~ file: index.js ~ line 15 ~ .get ~ user", user)
        var Fl = user.PRENOM.charAt(0).toUpperCase();
        var Ln = user.NOM.charAt(0).toUpperCase() + user.NOM.slice(1);
        console.log(Ln);
        res.render('dashboard', { user:user ,FirstLetter : Fl, LastName : Ln });
        } else {
            res.render('login', {
                invalid: 'You need to be authenticated to access this page',
            })
        }

    })
    
router.route("/sh")
    .get(emp_table.get)
    .post(emp_table.post)

router.get("/Acte_medical", (req, res) => {
    res.render('Acte_medical');
});

router.get("/Structures_conventionnees", (req, res) => {
    res.render('SC');
});
router.post("/deleteSH",emp_table.delete)

module.exports = router;