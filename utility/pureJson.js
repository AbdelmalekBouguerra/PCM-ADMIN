/**
 * Author : Abdelmalek BOUGUERRA
 * Author Email : abdelmalekbouguerra2000@gmail.com
 * Created : Nov 2022
 * Description :
 * fusion all the json object with same ids that not have a value of string (bcz if  string
  it means new row) :
 * var empTable = [
   { id: '8', col: "libelle", value: "1" },
   { id: '8', col: "region", value: "2" },
   { id: '8', col: "tele", value: "3" },
   { id: '8', col: "email", value: "4" },
   { id: '9', col: "email", value: "4" },
   { id: '9', col: "libelle", value: "1" },
   { id: '9', col: "region", value: "2" },
   { id: '18', col: "tele", value: "3" },
   { id: 7, col: "libelle", value: "5" }
 ]; 
 * becomes =>
 res = [
   { id: '9', libelle: '1', region: '2', tele: '3', email: '4' },
   { id: '9', email: '4', libelle: '1', region: '2' },
   { id: '18', tele: '3' },
   { id: 7, col: "libelle", value: "5" }
 ]
 * @param empTable json object that u want to purify.
 * @return Json object that purified .
 * 
 * (c) Copyright by Abdelmalek BOUGUERRA.
 */

module.exports = function pureJson(empTable) {
  let res = [];
  let row = {};
  let ids = [];
  let isExisted = false;

  empTable.forEach((ele) => {
    isExisted = false;
    if (typeof ele.ID == "string") {
      // for first id when inserted directly
      if (typeof ids !== "undefined" && ids.length === 0) {
        ids.push(ele.ID);
      } else {
        // check if ids already inserted
        for (const element of ids)
          if (ele.ID == element) {
            isExisted = true;
            break;
          }
      }
      // if res is empty we creat first element and inserted
      if (typeof res !== "undefined" && res.length === 0) {
        row["ID"] = ele.ID;
        row[ele.col] = ele.value;
        res.push(row);
        row = {};
        // creat first element and push it to the res = [{id : ele.ID , ele.col = ele.value}]
      } else if (isExisted) {
        res.forEach((ele2) => {
          if (ele2.ID == ele.ID) {
            ele2[ele.col] = ele.value;
          }
        });
      } else {
        row["ID"] = ele.ID;
        row[ele.col] = ele.value;
        res.push(row);
        ids.push(ele.ID);
        row = {};
      }
    } else {
      res.push(ele);
    }
  });
  return res;
};
