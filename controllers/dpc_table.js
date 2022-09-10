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
    // await sys_fc.findOne();
    let query;
    let whereOption = "";
    if (!ordre_agent_list) {
      query = `SELECT * 
      FROM dpc 
      INNER JOIN user 
      ON dpc.user_id = user.user_id`;
    } else {
      for (let i = 0; i < ordre_agent_list.length; i++) {
        if (i == 0) whereOption += `${ordre_agent_list[i]} IS NOT NULL`;
        else whereOption += ` OR ${ordre_agent_list[i]} IS NOT NULL`;
      }
      console.log("whereOption : ", whereOption);
      query = `SELECT * 
      FROM dpc 
      INNER JOIN user 
      ON dpc.user_id = user.user_id
      WHERE ${whereOption};`;
    }
    db.query(query)
      .then((result) => {
        let data = result[0];
        data.forEach(element => {
          for (const key in element) {
            if (key.match("^[a-zA-Z]+_.*_[a-zA-Z]+$")){
              if (element[key] != null) element[key] = 1;
            }
          }
        });
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
