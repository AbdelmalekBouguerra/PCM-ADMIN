/* Importation de la connexion à la base de données. */
const db = require("../env/db");
/**
 * Elle renvoie tous les DPC qui ne sont pas encore validés par l'administrateur avec l'ID donné
 *
 * Args:
 *   ID: L'identifiant de l'administrateur.
 *   ROLE: Le rôle de l'administrateur.
 *   callback: Une fonction qui sera appelée lorsque la requête sera terminée.
 */
function getDPC(ID, ROLE, callback) {
  var query =
    "SELECT ID,NUM_DPC,(SELECT MATRICULE FROM `DEMANDEUR` AS D WHERE ID_DEMANDEUR = D.ID)" +
    "as MATRICULE_DEM,IF( ISNULL(ID_BENEFICIAIRE),'Lui-même',(SELECT LIEN_PARENTE FROM `BÉNÉFICIAIRE`" +
    "AS B WHERE ID_BENEFICIAIRE = B.ID)) as LIEN_PARENTE_BEN,STRUCTURE,ACT,STATU_DPC," +
    "IF( ISNULL(ID_AGENT),'false','true') as VALIDATION_AGENT," +
    "IF( ISNULL(ID_CHEFREGION),'false','true') as VALIDATION_CHEFREGION, " +
    "IF( ISNULL(ID_DIRECTEUR),'false','true') as VALIDATION_DIRECTEUR  " +
    "FROM `DPC`";

  /* Une requête qui est utilisée pour obtenir tous les DPC qui ne sont pas encore validés par
l'administrateur avec le role donné. */
  if (ROLE === "AGENT") {
    query += "WHERE ISNULL(ID_AGENT) AND STATU_DPC = 'processing' ORDER BY ID";
  } else if (ROLE === "CHEFREGION") {
    query +=
      "WHERE ISNULL(ID_CHEFREGION) AND ID_AGENT IS NOT NULL AND STATU_DPC = 'processing' " +
      "ORDER BY ID";
  } else if (ROLE === "DIRECTEUR") {
    query +=
      "WHERE ISNULL(ID_DIRECTEUR) AND ID_AGENT IS NOT NULL AND ID_CHEFREGION IS NOT NULL " +
      "AND STATU_DPC = 'processing' " +
      "ORDER BY ID";
  }

  db.query(query, (err, results) => {
    if (err) console.log(err);
    else callback(results);
  });
}

/**
 * Il obtient tous les DPC de la base de données.
 *
 * Args:
 *   callback: La fonction de rappel qui sera appelée lorsque la requête sera terminée.
 */
function getAllDPC(callback) {
  var query =
    "SELECT ID,NUM_DPC,(SELECT MATRICULE FROM `DEMANDEUR` AS D WHERE ID_DEMANDEUR = D.ID)" +
    "as MATRICULE_DEM,IF( ISNULL(ID_BENEFICIAIRE),'Lui-même',(SELECT LIEN_PARENTE FROM `BÉNÉFICIAIRE`" +
    "AS B WHERE ID_BENEFICIAIRE = B.ID)) as LIEN_PARENTE_BEN,STRUCTURE,ACT,STATU_DPC " +
    "FROM `DPC`";
  db.query(query, (err, results) => {
    if (err) console.log(err);
    else callback(results);
  });
}

/**
 * Elle renvoie tous les DPC qui ont été rejetés.
 * 
 * Args:
 *   callback: une fonction qui sera appelée lorsque la requête sera terminée.
 */
function getRejectedDPC(callback) {
  var query =
    "SELECT ID,NUM_DPC,(SELECT MATRICULE FROM `DEMANDEUR` AS D WHERE ID_DEMANDEUR = D.ID)" +
    "as MATRICULE_DEM,IF( ISNULL(ID_BENEFICIAIRE),'Lui-même',(SELECT LIEN_PARENTE FROM `BÉNÉFICIAIRE`" +
    "AS B WHERE ID_BENEFICIAIRE = B.ID)) as LIEN_PARENTE_BEN,STRUCTURE,ACT,STATU_DPC,REJECTION " +
    "FROM `DPC` WHERE STATU_DPC = 'rejected'";
  db.query(query, (err, results) => {
    if (err) console.log(err);
    else callback(results);
  });
}

/**
 * Elle met à jour la table DPC avec l'ID de l'agent qui a confirmé la demande
 *
 * Args:
 *   ID: L'identifiant du demande
 *   ROLE: Le rôle de l'administrateur qui confirme la demande.
 *   ID_AGENT: ID de l'agent qui confirme la demande.
 *   callback: Une fonction qui sera appelée lorsque la requête sera terminée.
 */
function confirmDPC(ID, ROLE, ID_AGENT, callback) {
  /* Checking if the role of the admin is agent. */
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

/**
 * Elle met à jour la table DPC avec l'ID de l'agent qui l'a rejeté, le statut du DPC est défini sur
 * rejeté (rejected) et la raison du rejet est définie (REJECTION col)
 *
 * Args:
 *   ID: ID du DPC à rejeter.
 *   ROLE: Le rôle de l'administrateur qui rejette le DPC.
 *   motifRejet: Le motif du rejet.
 *   ID_AGENT: ID de l'agent qui rejette le DPC.
 *   callback: une fonction qui sera appelée lorsque la requête sera terminée.
 */
function rejectDPC(ID, ROLE, motifRejet, ID_AGENT, callback) {
  /* Checking if the role of the admin is agent. */
  if (ROLE === "AGENT") {
    db.execute(
      `UPDATE DPC SET ID_AGENT = ?, STATU_DPC = 'rejected', REJECTION = ? WHERE ID = ?`,
      [ID_AGENT, motifRejet, ID],
      (err, results) => {
        if (err) console.log(err);
        else callback(results);
      }
    );
    // else if admin is agent we set ID_AGENT2 an id to it.
  } else if (ROLE === "CHEFREGION") {
    db.execute(
      `UPDATE DPC SET ID_CHEFREGION = ?, STATU_DPC = 'rejected' , REJECTION = ? WHERE ID = ?`,
      [ID_AGENT, motifRejet, ID],
      (err, results) => {
        if (err) console.log(err);
        else callback(results);
      }
    );

    // else if admin is agent we set ID_AGENT2 an id to it.
  } else if (ROLE === "DIRECTEUR") {
    db.execute(
      `UPDATE DPC SET ID_DIRECTEUR = ?, STATU_DPC = 'rejected' , REJECTION = ? WHERE ID = ?`,
      [ID_AGENT, motifRejet, ID],
      (err, results) => {
        if (err) console.log(err);
        else callback(results);
      }
    );
  } else {
    console.log("ERROR: Unknown agent role " + ROLE);
  }
}

/* Exportation les fonctions */
module.exports = {
  get: (req, res) => {
    let ID = req.session.adminUser.ID;
    let ROLE = req.session.adminUser.ROLE;
    getDPC(ID, ROLE, (results) => {
      res.json({ last_page: 1, data: results });
    });
  },
  getAll: (req, res) => {
    getAllDPC((results) => {
      res.json({ last_page: 1, data: results });
    });
  },
  getRejected: (req, res) => {
    getRejectedDPC((results) => {
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
  reject: (req, res) => {
    const { id, motifRejet } = req.body;
    console.log("id: " + JSON.stringify(id));
    const ROLE = req.session.adminUser.ROLE;
    const ID_AGENT = req.session.adminUser.ID;

    rejectDPC(id, ROLE, motifRejet, ID_AGENT, () => {
      res.json({
        msg: "success",
      });
    });
  },
};
