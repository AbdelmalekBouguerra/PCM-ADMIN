/*
 * Author : Abdelmalek BOUGUERRA
 * Author Email : abdelmalekbouguerra2000@gmail.com
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
const Cms = require("../models/cms_act")(sequelize, DataTypes);

const pureJson = require("../utility/pureJson");

module.exports = {
  get: (req, res) => {
    Cms.findAll()
      .then((result) => res.status(200).json(result))
      .catch((err) => res.status(500).json(err));
  },
  post: (req, res) => {
    // var { id_empTable } = req.body;
    console.log("🚀 ~ file: emp_table.js ~ line 174 ~ req.body", req.body);

    // id_empTable = JSON.parse(req.body)
    // console.log(id_empTable);

    setPCTable(req.body, () => {
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
      res.redirect("/Prestations_cms");
    });
  },
};
