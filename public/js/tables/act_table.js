//initialize table
const table = new Tabulator("#act-table", {
  scrollToRowPosition: "bottom", //position row in the center of the table when scrolled to
  height: "500px",
  ajaxURL: "http://localhost:3050/ACT", //ajax URL
  ajaxConfig: "GET", //ajax HTTP request type
  ajaxError: function (error) {
    //error - fetch response object
  },
  layout: "fitColumns",
  //   progressiveLoad: "load",
  autoColumns: false, //create columns from data field names
  history: true,
  //  placeholder: "No Data Set",
  index: "id",
  columns: [
    {
      formatter: "rowSelection",
      width: 10,
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
      cellClick: function (e, cell) {
        cell.getRow().toggleSelect();
      },
    },
    { title: "Id", field: "id", width: 53, sorter: "number" },
    {
      title: "Code",
      field: "code",
      width: 203,
      editor: "input",
      sorter: "string",
    },
    {
      title: "Désignation",
      field: "designation",
      editor: "input",
      sorter: "string",
    },
    {
      title: "Montant global ttc",
      field: "montant_global",
      editor: "input",
      sorter: "number",
    },
    {
      title: "Structures",
      field: "tiers_payant_structure.structure",
      sorter: "string",
    },
  ],
});

function deletRow() {
  // var input = document.getElementById("hiddenInput");
  // input.value = JSON.stringify(id_empTable);
  console.log("json", id_empTable);
  // console.log("input : ", input.value);
  if (confirm("êtes-vous sûr de vouloir ajouter ces lignes!")) {
    $.ajax({
      url: "/ACT", // Url of backend (can be python, php, etc..)
      type: "POST", // data type (can be get, post, put, delete)
      data: JSON.stringify(id_empTable),
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

function showBtn() {
  var ele = document.getElementById("btn");

  ele.innerHTML =
    '<button type="button" onClick="deletRow();" class="btn btn-inverse-primary btn-fw m-2">Enregistrer</button> ' +
    '<button type="button" onClick="window.location.reload();" class="btn btn-inverse-danger btn-fw m-2">Cancel</button>';
}

function showDeleteBtn() {}

var id_empTable = [];
var selectedData = [];
var json_emp = {};
// FIX : test if is it changed or not to save the new value.
table.on("cellEdited", function (cell) {
  json_emp["ID"] = cell.getRow().getData().ID;
  json_emp["col"] = cell.getField();
  json_emp["value"] = cell.getValue();

  id_empTable.push(json_emp);
  json_emp = {};
  console.log(id_empTable);
  showBtn();
});
table.on("rowSelected", function (row) {
  //row - row component for the selected row
  selectedData = table.getSelectedData();
  var selectedRowsForDel = document.getElementById("selectedRowsForDel");
  selectedRowsForDel.value = JSON.stringify(selectedData);
  //get array of currently selected data.
  console.log(selectedData);
});

document.getElementById("add-row").addEventListener("click", function () {
  var rowCount = table.getDataCount() + 1;
  console.log(rowCount);
  // we add +'' to make the ID a string cuz our controller test if string it update else insert
  table.addRow({ ID: rowCount + 1 + "" });
  table.scrollToRow(rowCount + 1, "middle", true);
  table.redraw();
});

document.getElementById("del-row").addEventListener("click", function () {
  //   if (confirm("êtes-vous sûr de vouloir supprimer ces lignes!")) {
  //     //! FIX : here it first execute the POST method from /sh link (Add rows)
  //     //! then it go for the deleting the rows
  //     var xhr = new XMLHttpRequest();
  //     xhr.open("POST", "/deleteSH", true);
  //     xhr.setRequestHeader('Content-Type', 'application/json');
  //     xhr.send(JSON.stringify({
  //     value: selectedData
  // }));
  // window.location.reload();
  //   }
});

//Define variables for input elements
const fieldEl = document.getElementById("filter-field");
const typeEl = "like";
const valueEl = document.getElementById("filter-value");

//Trigger setFilter function with correct parameters
function updateFilter() {
  var filterVal = fieldEl.options[fieldEl.selectedIndex].value;
  console.log(
    "🚀 ~ file: sh_table.js ~ line 90 ~ updateFilter ~ filterVal",
    filterVal
  );
  typeVal = "like";
  var filter = filterVal == "function" ? customFilter : filterVal;

  if (filterVal == "function") {
    typeEl.disabled = true;
    valueEl.disabled = true;
  } else {
    typeEl.disabled = false;
    valueEl.disabled = false;
  }

  if (filterVal) {
    table.setFilter(filter, typeVal, valueEl.value);
  }
}

//Update filters on value change
document
  .getElementById("filter-field")
  .addEventListener("change", updateFilter);
document.getElementById("filter-value").addEventListener("keyup", updateFilter);
