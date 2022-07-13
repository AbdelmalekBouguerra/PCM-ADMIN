// call the db connection object
const { query } = require("../env/db");
const db = require("../env/db");

function getDPC(ID, ROLE, callback) {
  var query;
  if (ROLE === "AGENT") {
    query =
      "SELECT ID,NUM_DPC,(SELECT MATRICULE FROM `DEMANDEUR` AS D WHERE ID_DEMANDEUR = D.ID)" +
      "as MATRICULE_DEM,IF( ISNULL(ID_BENEFICIAIRE),'Lui-même',(SELECT LIEN_PARENTE FROM `BÉNÉFICIAIRE`" +
      "AS B WHERE ID_BENEFICIAIRE = B.ID)) as LIEN_PARENTE_BEN,STRUCTURE,ACT,STATU_DPC," +
      "IF(ID_AGENT = ?,'true','false') as VALIDATION_AGENT," +
      "IF( ISNULL(ID_CHEFREGION),'false','true') as VALIDATION_CHEFREGION, " +
      "IF( ISNULL(ID_DIRECTEUR),'false','true') as VALIDATION_DIRECTEUR  " +
      "FROM `DPC`" +
      "WHERE ISNULL(ID_AGENT) ORDER BY ID";
  }

  db.query(query, [ID, ID], (err, results) => {
    if (err) console.log(err);
    else callback(results);
  });
}

function confirmDPC(ID, ROLE, ID_AGENT, callback) {
  // if admin is agent we set ID_AGENT1 an id to it.
  if (ROLE === "AGENT") {
    db.execute(
      `UPDATE DPC SET ID_AGENT = ? WHERE ID = ?`,
      [ID_AGENT, ID],
      (err, results) => {
        if (err) console.log(err);
        else callback(results);
      }
    );
    // else if admin is agent we set ID_AGENT2 an id to it.
  } else if (ROLE === "CHEFREGION") {
    db.execute(
      `UPDATE DPC SET ID_CHEFREGION = ? WHERE ID = ?`,
      [ID_AGENT, ID],
      (err, results) => {
        if (err) console.log(err);
        else callback(results);
      }
    );

    // else if admin is agent we set ID_AGENT2 an id to it.
  } else if (ROLE === "DIRECTEUR") {
    db.execute(
      `UPDATE DPC SET ID_DIRECTEUR = ? WHERE ID = ?`,
      [ID_AGENT, ID],
      (err, results) => {
        if (err) console.log(err);
        else callback(results);
      }
    );
  } else {
    console.log("ERROR: Unknown agent role " + agentRole);
  }
}

module.exports = {
  get: (req, res) => {
    let ID = req.session.adminUser.ID;
    let ROLE = req.session.adminUser.ROLE;
    getDPC(ID, ROLE, (results) => {
      res.json({ last_page: 1, data: results });
    });
  },
  confirm: (req, res) => {
    let { id } = req.body;
    console.log("id: " + JSON.stringify(id));
    let ROLE = req.session.adminUser.ROLE;
    let ID_AGENT = req.session.adminUser.ID;
    confirmDPC(id, ROLE, ID_AGENT, () => {
      res.json({
        msg: "success",
      });
    });
  },
};
