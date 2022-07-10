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
  return (
    '<button type="button" class="btn btn-inverse-success btn-icon">' +
    '<i class="mdi mdi mdi-check" style="margin-right: 0px;"></i></button>' +
    '<button type="button" class="btn btn-inverse-danger btn-icon" style="margin-left: 10px;">' +
    '<i class="mdi mdi mdi-close" style="margin-right: 0px;"></i></button>'
  );
};

// initialize table
var table = new Tabulator("#DPC-table", {
  height: "500px",
  ajaxURL: "https://localhost:3030/DPCtable", //ajax URL
  ajaxConfig: "GET", //ajax HTTP request type
  ajaxError: function (error) {
    //error - fetch response object
    console.log(error);
  },
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
      field: "VALIDATION",
      hozAlign: "center",
      width: 77,
      formatter: "tickCross",
    },
    {
      title: "Chef Region",
      field: "VALIDATION",
      hozAlign: "center",
      width: 77,
      formatter: "tickCross",
    },
    {
      title: "Directeur",
      field: "VALIDATION",
      hozAlign: "center",
      width: 77,
      formatter: "tickCross",
    },
    {
      title: "pièce jointe",
      formatter: docIcon,
      width: 118 ,
      hozAlign: "center",
      cellClick: function (e, cell) {
        window.open("https://localhost:3031/demande/"+cell.getRow().getData().NUM_DPC,'_blank');
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

table.on("cellEdited", function (cell) {
  console.log(table.getRow(15).getData());
});
