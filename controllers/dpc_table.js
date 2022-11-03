const db = require("../config/sequelize");
const { DataTypes } = require("sequelize");
const dpcModel = require("../models/dpc")(db, DataTypes);

const sys_fc = require("../models/sys_flux_confirmation")(db, DataTypes);
const Tiers_payant_structure = require("../models/tiers_payant_structure")(
  db,
  DataTypes
);
const Medecin_travail_act = require("../models/medecin_travail_act")(
  db,
  DataTypes
);
const Medecins_conventionnes = require("../models/medecins_conventionnes")(
  db,
  DataTypes
);
const Act = require("../models/act")(db, DataTypes);

// Act [n]-->[1] TP_structure relation ----------------
Tiers_payant_structure.hasMany(Act, {
  foreignKey: "tiers_payant_structure_id",
});
Act.belongsTo(Tiers_payant_structure, {
  foreignKey: "tiers_payant_structure_id",
});
// --------------------------------------------

module.exports = {
  get: async (req, res, next) => {
    // let ROLE = req.session.adminUser.role;
    const level = req.session.adminLevel;
    console.log("🚀 ~ file: dpc_table.js ~ line 11 ~ get: ~ level", level);
    let ordre_agent_list = null;
    if (level > 1) {
      const fc = await sys_fc.findAll({ where: { niveau: level - 1 } });
      const ordre = fc.map((c) => c.ordre_affichage);
      ordre_agent_list = ordre.map((o) => `agent_${o}_confirmation`);
      console.log(
        "🚀 ~ file: dpc_table.js ~ line 16 ~ get: ~ ordre_agent_list",
        ordre_agent_list
      );
    }
    let query = `SELECT dpc_id,id_act,son,
      type_demande,agent_1_confirmation,agent_2_confirmation,agent_3_confirmation,agent_4_confirmation,
      user.nom as nom,user.prenom as prenom,tele,email,beneficiare.nom as bennom,beneficiare.prenom beneprenom,
      code_mnémonique,structure_libelle,date_creation,dpc_number 
      FROM dpc 
      INNER JOIN user
      ON dpc.user_id = user.user_id
      LEFT JOIN structure
      ON user.employeur = structure.structure_id 
      LEFT JOIN beneficiare
      ON dpc.beneficiare_id = beneficiare.id `;
    let whereOption = "";
    if (ordre_agent_list) {
      for (let i = 0; i < ordre_agent_list.length; i++) {
        if (i == 0) whereOption += `${ordre_agent_list[i]} IS NOT NULL`;
        else whereOption += ` OR ${ordre_agent_list[i]} IS NOT NULL`;
      }
      console.log("whereOption : ", whereOption);
      query += ` WHERE ${whereOption};`;
    }
    db.query(query)
      .then(async (result) => {
        let data = result[0];
        let ms = []; // Médecines de soins
        let tp = []; // Tiers payant
        let pc = []; // Prises en charge 100 %
        data.forEach((element) => {
          // founding agent_*_confirmation keys and replace the ids of admins with 1 to show ✔
          for (const key in element) {
            if (key.match("^[a-zA-Z]+_.*_[a-zA-Z]+$")) {
              if (element[key] != null) element[key] = 1;
            }
          }
          // add act data to data object
          // to avoid have multiple calls to the table i will make a array of indexes with dpc id and act id
          if (element["type_demande"] == "Médecines de soins") {
            ms.push({ dpc_id: element["dpc_id"], act_id: element["id_act"] });
          } else if (element["type_demande"] == "Tiers payant") {
            tp.push({ dpc_id: element["dpc_id"], act_id: element["id_act"] });
          } else if (element["type_demande"] == "Prises en charge 100 %") {
            pc.push({ dpc_id: element["dpc_id"], act_id: element["id_act"] });
          }
        });

        // fetching data
        let medecins_conventionnes; // Médecines de soins
        let act; // Tiers payant
        let medecin_travail_act; // Prises en charge 100 %

        if (ms.length > 0) {
          let ids = ms.map((m) => m.act_id);
          medecins_conventionnes = await Medecins_conventionnes.findAll({
            where: { id: ids },
            raw: true,
          });
        }
        if (tp.length > 0) {
          let ids = tp.map((m) => m.act_id);
          console.log("🚀 ~ file: dpc_table.js ~ line 102 ~ .then ~ ids", ids);
          try {
            act = await Act.findAll({
              where: { id: ids },
              include: [
                {
                  model: Tiers_payant_structure,
                },
              ],
              raw: true,
            });
          } catch (error) {
            console.log(error);
          }
        }
        if (pc.length > 0) {
          let ids = pc.map((m) => m.act_id);
          try {
            medecin_travail_act = await Medecin_travail_act.findAll({
              where: { medecin_travail_structure_id: ids },
              raw: true,
            });
          } catch (error) {
            console.log(error);
          }
        }
        console.log("act :", act);
        data.map((element) => {
          if (element.type_demande == "Médecines de soins") {
            element["act"] = medecins_conventionnes.find(
              (mc) => mc.id == element.id_act
            );
          }
          if (element.type_demande == "Tiers payant") {
            element["act"] = act.find((act) => act.id == element.id_act);
          }
          if (element.type_demande == "Prises en charge 100 %") {
            element["act"] = medecin_travail_act.find(
              (mt) => mt.medecin_travail_structure_id == element.id_act
            );
          }
        });
        console.log("data : ", data);
        res.status(200).json(data);
      })
      .catch((err) => res.status(500).json({ message: "ERROR", err }));
  },
  confirm: async (req, res, next) => {
    let { id } = req.body;

    let ROLE = req.session.adminUser.role;
    let ID_AGENT = req.session.adminUser.user_id;

    const fc = await sys_fc.findOne({
      where: { role: ROLE },
      attributes: ["ordre_affichage"],
    });
    let updateCol = {};
    updateCol[`agent_${fc.ordre_affichage}_confirmation`] = ID_AGENT;

    const dpcUpdate = await dpcModel.update(updateCol, {
      where: {
        dpc_id: id,
      },
    });
    if (!dpcUpdate) console.log("❌ not updated");
    else console.log("✔ updated");
    res.json({
      msg: "success",
    });
  },
  reject: async (req, res, next) => {
    try {
    } catch (error) {
      console.log(error);
      res.next(error);
    }
  },
};
