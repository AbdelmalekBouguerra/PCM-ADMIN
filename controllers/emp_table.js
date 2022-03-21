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

var table = [];

/** getEmpTable
 * fetch the employeur table for MySQL server
 * @param callback sync function insert into it any code that depend on getEmpTable function.
 * @return JSON Object the employeur table.
 */

function getEmpTable(callback) {
  db.execute("SELECT * FROM SH", (err, results) => {
    if (err) console.log(err);
    else callback(results);
  });
}

function setEmpTable(table, callback) {
  // first we organize our object.
  var res = pureJson(table);
  console.log("🚀 ~ file: emp_table.js ~ line 33 ~ setEmpTable ~ table", table)
  console.log("🚀 ~ file: emp_table.js ~ line 33 ~ setEmpTable ~ res", res)
  // then we loop in each element
  for (var i = 0; i < res.length; i++) {
    var modifItems = res[i];
    // if id is string it means not a new line
    if (typeof modifItems.ID == "string") {
      db.execute(
        "UPDATE SH SET " + modifItems.col + "= ? WHERE ID = ?;",
        [
          // modifItems.col,
          modifItems.value,
          parseInt(modifItems.id),
        ],
        (err, results) => {
          if (err)
            console.log(
              "🚀 ~ file: emp_table.js ~ line 8 ~ getEmpTable ~ err",
              err
            );
        }
      );
      // if id is int it means it s a new line
    } else {
      // check if element of table object is not undefined
      var ID = null,
        CODE = null,
        STR = null;
      if (typeof modifItems.ID !== "undefined") ID = modifItems.ID;
      if (typeof modifItems.CODE !== "undefined") CODE = modifItems.CODE;
      if (typeof modifItems.STRUCTURE !== "undefined") STR = modifItems.STRUCTURE;
      console.log("id,code,str",ID,CODE,STR);
      db.execute(
        "INSERT INTO SH(ID,CODE,STRUCTURE) VALUES(?,?,?);",
        [ID, CODE, STR],
        (err, results) => {
          if (err) console.log(err);
        }
      );
    }
  }
  callback();
}

/** pureJson
* fusion all the json object with same ids that not have a value of string (bcz if not string
  it means new row) :
* var empTable = [
  { id: 8, col: "libelle", value: "1" },
  { id: 8, col: "region", value: "2" },
  { id: 8, col: "tele", value: "3" },
  { id: 8, col: "email", value: "4" },
  { id: 9, col: "email", value: "4" },
  { id: 9, col: "libelle", value: "1" },
  { id: 9, col: "region", value: "2" },
  { id: 18, col: "tele", value: "3" },
  { id: "7", col: "libelle", value: "5" }
]; 
* becomes =>
res = [
  { id: 9, libelle: '1', region: '2', tele: '3', email: '4' },
  { id: 9, email: '4', libelle: '1', region: '2' },
  { id: 18, tele: '3' },
  { id: "7", col: "libelle", value: "5" }
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
    if (typeof ele.ID !== "string") {
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
          if ((ele2.id = ele.ID)) {
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
    }
  });
  return res;
}

module.exports = {
  get: (req, res) => {
    getEmpTable((results) => {
      table = results;
      console.log(
        "🚀 ~ file: emp_table.js ~ line 16 ~ getEmpTable ~ table",
        table
      );
      res.render("sh", { table: table });
    });
  },
  post: (req, res) => {
    var { id_empTable } = req.body;
    id_empTable = JSON.parse(id_empTable);

    setEmpTable(id_empTable, () => {
      getEmpTable((results) => {
        table = results;
        res.render("sh", { table: table });
      });
    });
  },
};
