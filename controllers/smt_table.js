/*
 * Author : Abdelmalek BOUGUERRA
 * Author Email : abdelmalekbouguerra2000@gmail.com
 * Updated : Nov 2022
 * Created : Mar 2022
 * description : All interaction with employeur table getter and setters From database, handling
 *               POST and GET methods called by the view "employeur.hbs".
 *
 * (c) Copyright by Abdelmalek BOUGUERRA.
 *
 */

// call the db connection object
const db = require("../env/db");
const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const SMT = require("../models/medecin_travail_act")(sequelize, DataTypes);
const pureJson = require("../utility/pureJson");

module.exports = {
  get: (req, res) => {
    SMT.findAll()
      .then((result) => res.status(200).json(result))
      .catch((err) => res.status(500).json(err));
  },
  post: (req, res) => {
    // var { id_empTable } = req.body;
    console.log("🚀 ~ file: emp_table.js ~ line 174 ~ req.body", req.body);

    // id_empTable = JSON.parse(req.body)
    // console.log(id_empTable);

    setMCTable(req.body, () => {
      res.json({
        msg: "success",
      });
    });
  },
  delete: (req, res) => {
    var { selectedRowsForDel } = req.body;

    console.log(
      "🚀 ~ file: emp_table.js ~ line 181 ~ value",
      selectedRowsForDel
    );

    deleteRows(selectedRowsForDel, () => {
      res.redirect("/Structures_Medecine_du_travail");
    });
  },
};
