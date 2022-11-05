/**
 * Author : Abdelmalek BOUGUERRA
 * Author Email : abdelmalekbouguerra2000@gmail.com
 * Created : Mar 2022
 * Updated : Nov 2022
 * description : All interaction with employeur table getter and setters From database, handling
 *               POST and GET methods called by the view "employeur.hbs".
 *
 * (c) Copyright by Abdelmalek BOUGUERRA.
 *
 */

const db = require("../env/db");
const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Structure = require("../models/structure")(sequelize, DataTypes);
const pureJson = require("../utility/pureJson");

module.exports = {
  get: (req, res) => {
    Structure.findAll()
      .then((result) => res.status(200).json(result))
      .catch((err) => res.status(500).json(err));
  },
  post: (req, res) => {
    //! this is not working
    if (
      req.body == null &&
      Object.entries(req.body).length === 0 &&
      req.body.constructor === Object
    ) {
      console.log("WRONGE");
      return res.status(401).send({ message: "Insufficient data" });
    }

    // first we organize our object.
    const result = pureJson(req.body);
    // then we loop in each element

    for (const element of result) {
      // if id is string it means new line
      if (typeof element.ID != "string") {
        db.query(
          "UPDATE structure SET " + element.col + "= ? WHERE structure_id = ?;",
          [
            // element.col,
            element.value,
            parseInt(element.ID),
          ],
          (err, results) => {
            if (err) console.log(err);
            else console.log(element.ID + " update successfully");
          }
        );
        // if id is int it means it s a new line
      } else {
        // check if element of table object is not undefined
        let ID = null,
          CODE = null,
          STR = null;
        if (typeof element.ID !== "undefined") ID = element.ID;
        if (typeof element.code_mnémonique !== "undefined")
          CODE = element.code_mnémonique;
        if (typeof element.structure_libelle !== "undefined")
          STR = element.structure_libelle;
        db.query(
          "INSERT INTO structure(structure_id,code_mnémonique,structure_libelle) VALUES(?,?,?);",
          [ID, CODE, STR],
          (err, results) => {
            if (err) console.log(err);
            else console.log(element.ID + " insert successfully");
          }
        );
      }
      res.status(200).send({ message: "OK" });
      //todo change this
    }
  },
  delete: async (req, res) => {
    let selectedRowsForDel = req.body;
    selectedRowsForDel = selectedRowsForDel.map((row) => row.structure_id);
    const row = await Structure.destroy({
      where: { structure_id: selectedRowsForDel },
    });
    if (row) res.status(200).send({ message: "OK" });
    else res.status(404).send({ message: "ROW NOT FOUND" });
  },
};

//! ==========================  WORK ON THIS -TOP PRIORITY- DO NOT REMOVE THIS ==========================

////to do 1[x] change ID in pureJson function to structure_id and leave the same build there
//todo 2[x] test if (1) its working or not.
//todo 3[] update delete code should be fairly simple.
//todo 4[] write a tree plan for updating all tables in the same way
//* 1/ in public file change https to http
//* 2/ change 3030 to 3050
//* 3/ add both in top
//* 4/ // progressiveLoad: "scroll",
//* 5/ change filds name to new names
//? const { DataTypes } = require("sequelize");
//? const sequelize = require("../config/sequelize");
//* 3/ work on get and delete endpoints
//* 4/ write any hard rework as todo for later update

//! ==========================  WORK ON THIS -TOP PRIORITY- DO NOT REMOVE THIS ==========================
