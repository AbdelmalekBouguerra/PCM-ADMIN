function showBtn() {
  var ele = document.getElementById("btn");

  ele.innerHTML =
    '<form method="post" action = "/sh">' +
    '<input type="hidden" name="id_empTable" id="hiddenInput" />' +
    '<button type="submit" class="btn m-lg-1 btn-primary btn-rounded btn-fw">save</button>' +
    '<button type="button" onClick="window.location.reload();" class="btn btn-danger btn-rounded btn-fw">cancel</button>' +
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