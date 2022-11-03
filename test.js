const fs = require("fs");
const db = require("./config/sequelize");
const { DataTypes } = require("sequelize");
const Tiers_payant_structure = require("./models/tiers_payant_structure")(
  db,
  DataTypes
);
const Act = require("./models/act")(db, DataTypes);
let data = "";

Tiers_payant_structure.findAll({
  attributes: ["tiers_payant_structure_id", "code"],
  raw: true,
})
  .then((tp) => {
    Act.findAll({
      attributes: ["id", "tiers_payant_structure_id"],
      raw: true,
    })
      .then((act) => {
        tp.map((t) => {
          act.map((a) => {
            if (t.code == a.tiers_payant_structure_id) {
              data +=
                "update act set tiers_payant_structure_id=" +
                t.tiers_payant_structure_id +
                " where id = " +
                a.id +
                ";\n";
            }
          });
        });
        console.log(data);
        fs.writeFileSync("./test.txt", data);
      })
      .catch((err) => {});
  })
  .catch((err) => {});
