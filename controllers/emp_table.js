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
  db.execute("SELECT * FROM EMPLOYEUR", (err, results) => {
    if (err)
      console.log("🚀 ~ file: emp_table.js ~ line 8 ~ getEmpTable ~ err", err);
    else callback(results);
  });
}

function setEmpTable(modif, callback) {
  for (var i = 0; i < modif.length; i++) {
    var modifItems = modif[i];
    console.log(
      "🚀 ~ file: emp_table.js ~ line 16 ~ setEmpTable ~ modifItems",
      modifItems
    );

    console.log(
      "🚀 ~ file: emp_table.js ~ line 18 ~ setEmpTable ~ modifItems.col",
      modifItems.col
    );
    console.log(modifItems.col.replace(/['"]+/g, ""));
    db.execute(
      "UPDATE EMPLOYEUR SET " + modifItems.col + "= ? WHERE ID = ?;",
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
  }
  callback();
}

function addNewEmp(idEmp,libEmp, adrEmp, regEmp, telEmp, emailEmp, callback) {
  db.execute(
    "INSERT INTO EMPLOYEUR(ID,LIBELLE,ADRESSE,REGION,TELE,MAIL) VALUES(?,?,?,?,?,?);",
    [idEmp,libEmp,adrEmp, regEmp, telEmp, emailEmp],
    (err, results) => {
      if (err)
        console.log(
          "file : emp_table.js / func : addNewEmp / line : 43 / \n err : ",
          err
        );
      else callback();
    }
  );
}

module.exports = {
  get: (req, res) => {
    getEmpTable((results) => {
      table = results;
      console.log(
        "🚀 ~ file: emp_table.js ~ line 16 ~ getEmpTable ~ table",
        table
      );
      res.render("employeur", { table: table });
    });
  },
  post: (req, res) => {
    var { id_empTable } = req.body;
    id_empTable = JSON.parse(id_empTable);
    console.log("🚀 ~ file: emp_table.js ~ line 34 ~ id_empTable", id_empTable);
    setEmpTable(id_empTable, () => {
      getEmpTable((results) => {
        table = results;
        console.log(
          "🚀 ~ file: emp_table.js ~ line 16 ~ getEmpTable ~ table",
          table
        );
        res.render("employeur", { table: table });
      });
    });
  },
};
