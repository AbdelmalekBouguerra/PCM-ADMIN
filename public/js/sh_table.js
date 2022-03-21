function showBtn() {
  var ele = document.getElementById("btn");

  ele.innerHTML =
    '<form method="post" action = "/sh">' +
    '<input type="hidden" name="id_empTable" id="hiddenInput" />' +
    '<button type="submit" class="btn btn-inverse-primary btn-fw m-2">Enregistrer</button> '+
    '<button type="button" onClick="window.location.reload();" class="btn btn-inverse-danger btn-fw m-2">Cancel</button>' +
    "</form>";
  var input = document.getElementById("hiddenInput");
  input.value = JSON.stringify(id_empTable);
  console.log("json", id_empTable);
  console.log("input : ", input.value);
}
function showDeleteBtn() {
  
}
var id_empTable = [];
var selectedData = [];
var json_emp = {};
// FIX : test if is it changed or not to save the new value.

//initialize table
var table = new Tabulator("#example-table", {
  layout: "fitColumns",
  data: data, //assign data to table
  autoColumns: false, //create columns from data field names
  history:true,
  columns: [
    {formatter:"rowSelection", width: 10, titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, cellClick:function(e, cell){
      cell.getRow().toggleSelect();
      
    }},
    { title: "Id", field: "ID", width:70, sorter:"number"},
    { title: "Code Mnémonique", field: "CODE", editor: "input",sorter:"string" },
    { title: "Structures", field: "STRUCTURE", editor: "input",sorter:"string" },
  ],
});
table.on("cellEdited", function (cell) {
  json_emp["ID"] =  cell.getRow().getData().ID;
  json_emp["col"] = cell.getField();
  json_emp["value"] = cell.getValue()

  id_empTable.push(json_emp);
  console.log("🚀 ~ file: editable_table.js ~ line 47 ~ id_empTable", id_empTable)
  json_emp = {};

  showBtn();


});

document.getElementById("add-row").addEventListener("click", function(){
    lastID = lastID + 1 ;
    table.addRow({ ID : lastID});
    table.redraw();
});

document.getElementById("del-row").addEventListener("click",function(){
  selectedData = table.getSelectedData(); //get array of currently selected data.
  console.log(selectedData);
  if (confirm("êtes-vous sûr de vouloir supprimer ces lignes!")) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/deleteSH", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
    value: selectedData
}));
window.location.reload();
  }

} )

//undo button
document.getElementById("history-undo").addEventListener("click", function(){
  table.undo();
});



//Define variables for input elements
var fieldEl = document.getElementById("filter-field");
var typeEl = "like"
var valueEl = document.getElementById("filter-value");

//Custom filter example
function customFilter(data){
    return data.car && data.rating < 3;
}

//Trigger setFilter function with correct parameters
function updateFilter(){
  var filterVal = fieldEl.options[fieldEl.selectedIndex].value;
  var typeVal = typeEl.options[typeEl.selectedIndex].value;

  var filter = filterVal == "function" ? customFilter : filterVal;

  if(filterVal == "function" ){
    typeEl.disabled = true;
    valueEl.disabled = true;
  }else{
    typeEl.disabled = false;
    valueEl.disabled = false;
  }

  if(filterVal){
    table.setFilter(filter,typeVal, valueEl.value);
  }
}

//Update filters on value change
document.getElementById("filter-field").addEventListener("change", updateFilter);
document.getElementById("filter-value").addEventListener("keyup", updateFilter);