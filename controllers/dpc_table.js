const db = require("../config/sequelize");
const { DataTypes } = require("sequelize");
const dpcModel = require("../models/dpc")(db, DataTypes);

const sys_fc = require("../models/sys_flux_confirmation")(db, DataTypes);

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
      code_mnémonique,structure_libelle
      FROM dpc 
      INNER JOIN user
      ON dpc.user_id = user.user_id
      LEFT JOIN structure
      ON dpc.structure_id = structure.structure_id 
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
      .then((result) => {
        let data = result[0];
        data.forEach((element) => {
          for (const key in element) {
            if (key.match("^[a-zA-Z]+_.*_[a-zA-Z]+$")) {
              if (element[key] != null) element[key] = 1;
            }
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
};
