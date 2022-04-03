require("dotenv").config();
// const fs = require("fs");
// const shell = require("shelljs");
// const processCSVData = require("./csv-scripts/processCSVData");
const processAPIData = require("./api-scripts/processAPIData");

// Set Permier League season, determines which CSV file data will be pulled from
// const season = "2019-20";

// (() => {
//   // Check if FPL data already exists locally, if not then pull the repo
//   if (!fs.existsSync("./Fantasy-Premier-League")) {
//     shell.exec(
//       "git clone https://github.com/vaastav/Fantasy-Premier-League",
//       { async: true },
//       () => {
//         processCSVData(season);
//       }
//     );
//   } else {
//     processCSVData(season);
//   }
// })();

(() => {
    processAPIData();
})();
