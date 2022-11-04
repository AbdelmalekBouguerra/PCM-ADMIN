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

// call the db connection object
const db = require("../env/db");
const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Structure = require("../models/structure")(sequelize, DataTypes);

var table = [];

function deleteRows(selectedData, callback) {
  selectedData = JSON.parse(selectedData);
  selectedData.forEach((ele) => {
    db.execute("DELETE FROM SH WHERE ID = ?;", [ele.ID], (err, results) => {
      if (err) console.log(err);
      else console.log(ele.ID, "deleted");
    });
  });
  callback();
}

/** pureJson
* fusion all the json object with same ids that not have a value of string (bcz if  string
  it means new row) :
* var empTable = [
  { id: '8', col: "libelle", value: "1" },
  { id: '8', col: "region", value: "2" },
  { id: '8', col: "tele", value: "3" },
  { id: '8', col: "email", value: "4" },
  { id: '9', col: "email", value: "4" },
  { id: '9', col: "libelle", value: "1" },
  { id: '9', col: "region", value: "2" },
  { id: '18', col: "tele", value: "3" },
  { id: 7, col: "libelle", value: "5" }
]; 
* becomes =>
res = [
  { id: '9', libelle: '1', region: '2', tele: '3', email: '4' },
  { id: '9', email: '4', libelle: '1', region: '2' },
  { id: '18', tele: '3' },
  { id: 7, col: "libelle", value: "5" }
]
* @param empTable json object that u want to purify.
* @return Json object that purified .
*/
function pureJson(empTable) {
  var res = [];
  var row = {};
  var ids = [];
  var isExisted = false;

  empTable.forEach((ele) => {
    isExisted = false;
    if (typeof ele.ID == "string") {
      // for first id when inserted directly
      if (typeof ids !== "undefined" && ids.length === 0) {
        ids.push(ele.ID);
      } else {
        // check if ids already inserted
        for (let i = 0; i < ids.length; i++)
          if (ele.ID == ids[i]) {
            isExisted = true;
            break;
          }
      }
      // if res is empty we creat first element and inserted
      if (typeof res !== "undefined" && res.length === 0) {
        row["ID"] = ele.ID;
        row[ele.col] = ele.value;
        res.push(row);
        row = {};
        // creat first element and push it to the res = [{id : ele.ID , ele.col = ele.value}]
      } else if (isExisted) {
        res.forEach((ele2) => {
          if (ele2.ID == ele.ID) {
            ele2[ele.col] = ele.value;
          }
        });
      } else {
        row["ID"] = ele.ID;
        row[ele.col] = ele.value;
        res.push(row);
        ids.push(ele.ID);
        row = {};
      }
    } else {
      res.push(ele);
    }
  });
  return res;
}

module.exports = {
  get: (req, res) => {
    Structure.findAll()
      .then((result) => res.status(200).json(result))
      .catch((err) => res.status(500).json(err));
  },
  post: (req, res) => {
    // // var { id_empTable } = req.body;
    // // id_empTable = JSON.parse(req.body);
    if (req.body !== null) {
      // first we organize our object.
      const result = pureJson(req.body);
      // then we loop in each element

      for (const element of result) {
        // if id is string it means new line
        if (typeof element.ID != "string") {
          db.query(
            "UPDATE structure SET " +
              element.col +
              "= ? WHERE structure_id = ?;",
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
      }
      res.status(200).send({ message: "OK" });
      //todo change this
    } else {
      res.status(401).send({ message: "Insufficient data" });
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
