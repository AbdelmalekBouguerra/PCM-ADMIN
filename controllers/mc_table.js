/*
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
const Medecins = require("../models/medecins_conventionnes.js")(
  sequelize,
  DataTypes
);
const pureJson = require("../utility/pureJson");
var table = [];

/** getEmpTable
 * fetch the employeur table for MySQL server
 * @param callback sync function insert into it any code that depend on getEmpTable function.
 * @return JSON Object the employeur table.
 */

function getMCTable(callback) {
  db.execute("SELECT * FROM MEDECINS_CONVENTIONNES", (err, results) => {
    if (err) console.log(err);
    else callback(results);
  });
}

function deleteRows(selectedData, callback) {
  console.log(
    "🚀 ~ file: emp_table.js ~ line 31 ~ deleteRows ~ selectedData",
    selectedData
  );
  selectedData = JSON.parse(selectedData);
  selectedData.forEach((ele) => {
    db.execute(
      "DELETE FROM MEDECINS_CONVENTIONNES WHERE ID = ?;",
      [ele.ID],
      (err, results) => {
        if (err) console.log(err);
        else console.log(ele.ID, "deleted");
      }
    );
  });
  callback();
}

function setMCTable(table, callback) {
  if (table !== null) {
    // first we organize our object.
    var res = pureJson(table);
    // then we loop in each element
    for (var i = 0; i < res.length; i++) {
      var modifItems = res[i];
      // if id is string it means new line
      if (!(typeof modifItems.ID == "string")) {
        db.query(
          "UPDATE MEDECINS_CONVENTIONNES SET " +
            modifItems.col +
            "= ? WHERE ID = ?;",
          [
            // modifItems.col,
            modifItems.value,
            parseInt(modifItems.ID),
          ],
          (err, results) => {
            if (err) console.error(err);
            else console.log("update successfully");
          }
        );
        // if id is int it means it s a new line
      } else {
        console.log("execute insert");
        // check if element of table object is not undefined
        var ID = null,
          MEDECIN = null,
          ADRESSE = null,
          TEL = null,
          WILLAYA = null,
          SPECIALITE = null;
        if (typeof modifItems.ID !== "undefined") ID = modifItems.ID;
        if (typeof modifItems.MEDECIN !== "undefined")
          MEDECIN = modifItems.MEDECIN;
        if (typeof modifItems.SPECIALITE !== "undefined")
          SPECIALITE = modifItems.SPECIALITE;
        if (typeof modifItems.ADRESSE !== "undefined")
          ADRESSE = modifItems.ADRESSE;
        if (typeof modifItems.WILLAYA !== "undefined")
          WILLAYA = modifItems.WILLAYA;
        db.query(
          "INSERT INTO MEDECINS_CONVENTIONNES(ID,MEDECIN,SPECIALITE,ADRESSE,TEL,WILLAYA) VALUES(?,?,?,?,?,?);",
          [ID, MEDECIN, SPECIALITE, ADRESSE, TEL, WILLAYA],
          (err, results) => {
            if (err) console.log(err);
            else console.log("insert successfully");
          }
        );
      }
    }
    callback();
  } else {
    return 0;
  }
}

module.exports = {
  get: (req, res) => {
    Medecins.findAll()
      .then((result) => res.status(200).json(result))
      .catch((err) => res.status(500).json(err));
  },
  post: (req, res) => {
    if (req.body !== null) {
      // first we organize our object.
      const result = pureJson(req.body);
      // then we loop in each element

      for (const element of result) {
        // if id is string it means new line
        if (typeof element.ID != "string") {
          db.query(
            "UPDATE `medecins_conventionnes` SET " +
              element.col +
              "= ? WHERE id = ?;",
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
            "INSERT INTO medecins_conventionnes(id,medecin,specialite,adresse,tele,wilaya) VALUES(?,?,?,?,?,?);",
            [ID, CODE, STR],
            (err, results) => {
              if (err) console.log(err);
              else console.log(element.ID + " insert successfully");
            }
          );
        }
      }
      res.status(200).send({ message: "OK" });
      //todo change this
    } else {
      res.status(401).send({ message: "Insufficient data" });
    }
  },
  delete: async (req, res) => {
    let selectedRowsForDel = req.body;
    selectedRowsForDel = selectedRowsForDel.map((row) => row.id);
    const row = await Medecins.destroy({
      where: { id: selectedRowsForDel },
    });
    if (row) res.status(200).send({ message: "OK" });
    else res.status(404).send({ message: "ROW NOT FOUND" });
  },
};
