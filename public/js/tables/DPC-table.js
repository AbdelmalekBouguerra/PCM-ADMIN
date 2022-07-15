let idRejctionDemande;

//Generate doc icon
var docIcon = function (cell, formatterParams) {
  //plain text value'
  return (
    '<button type="button" class="btn btn-inverse-primary btn-icon">' +
    '<i class="mdi mdi mdi-file" style="margin-right: 0px;"></i>' +
    "</button>"
  );
};

var success = function (cell, formatterParams) {
  //plain text value
  return `
    <button type="button" class="btn btn-inverse-success btn-icon" 
    data-id="${cell.getRow().getData().ID}" onclick="confirmation(this)">
    <i class="mdi mdi mdi-check" style="margin-right: 0px;"></i></button>
    <button type="button" class="btn btn-inverse-danger btn-icon"
    data-id="${cell.getRow().getData().ID}" onclick="rejectionModel(this)"
     style="margin-left: 10px;">
    <i class="mdi mdi mdi-close" style="margin-right: 0px;"></i></button>
  `;
};

// initialize table
var table = new Tabulator("#DPC-table", {
  height: "500px",
  ajaxURL: "https://localhost:3030/DPCtable", //ajax URL
  ajaxConfig: "GET", //ajax HTTP request type
  layout: "fitColumns",
  progressiveLoad: "scroll",
  autoColumns: false, //create columns from data field names
  history: true,
  placeholder: "No Data Set",
  index: "ID",
  columns: [
    { title: "Id", field: "ID", width: 48, sorter: "number" },
    {
      title: "Demandeur",
      field: "MATRICULE_DEM",
      width: 116,
      sorter: "string",
    },
    {
      title: "Lien de parente du Ben",
      field: "LIEN_PARENTE_BEN",
      width: 157,
      sorter: "string",
    },
    {
      title: "Structure",
      field: "STRUCTURE",
      width: 146,
      sorter: "string",
    },
    {
      title: "Act",
      field: "ACT",
      width: 146,
      sorter: "string",
    },
    {
      title: "Agent",
      field: "VALIDATION_AGENT",
      hozAlign: "center",
      width: 77,
      formatter: "tickCross",
    },
    {
      title: "Chef Region",
      field: "VALIDATION_CHEFREGION",
      hozAlign: "center",
      width: 77,
      formatter: "tickCross",
    },
    {
      title: "Directeur",
      field: "VALIDATION_DIRECTEUR",
      hozAlign: "center",
      width: 77,
      formatter: "tickCross",
    },
    {
      title: "pièce jointe",
      formatter: docIcon,
      width: 118,
      hozAlign: "center",
      cellClick: function (e, cell) {
        window.open(
          "https://localhost:3031/demande/" + cell.getRow().getData().NUM_DPC,
          "_blank"
        );
      },
    },
    {
      formatter: success,
      title: "Action",
      width: 138,
      hozAlign: "center",
    },
  ],
});

/**
 * It takes an element as an argument, gets the id of the element, sends it to the backend, and then
 * updates the table
 *
 * Args:
 *   ele: the element that was clicked
 */
function confirmation(ele) {
  var id = { id: ele.dataset.id };
  console.log("id: " + JSON.stringify(id));
  // console.log("input : ", input.value);
  if (confirm("êtes-vous sûr de vouloir accepte cette demande!")) {
    $.ajax({
      url: "/DPC/confirm", // Url of backend (can be python, php, etc..)
      type: "POST", // data type (can be get, post, put, delete)
      data: JSON.stringify(id),
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      async: false, // enable or disable async (optional, but suggested as false if you need to populate data afterwards)
      success: function (response, textStatus, jqXHR) {
        console.log(response);
        table.setData();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  } else return false;
}

/**
 * Elle montre un modal
 *
 * Args:
 *   ele: L'élément qui a déclenché l'événement.
 */
function rejectionModel(ele) {
  idRejctionDemande = ele.dataset.id;
  $("#model_rejet").modal("show");
}

/**
 * Il envoie une requête POST au backend avec l'id de la demande à rejeter
 *
 * Args:
 *   ele: L'élément qui a été cliqué.
 */
function rejection(ele) {
  const motifRejet = document.getElementById("motifRejet").value;
  const data = { id: idRejctionDemande, motifRejet: motifRejet };
  console.log(JSON.stringify(data));
  if (confirm("Voulez-vous vraiment rejeter cette demande ?")) {
    $.ajax({
      url: "/DPC/rejet", // Url of backend
      type: "POST", // data type (can be get, post, put, delete)
      data: JSON.stringify(data),
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      async: false, // enable or disable async
      success: function (response, textStatus, jqXHR) {
        console.log(response);
        $('#model_rejet').modal('hide');
        table.setData();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  } else return false;
}
