// require("dotenv").config();
import "dotenv/config";
// const fs = require("fs");
// const shell = require("shelljs");
// const processCSVData = require("./csv-scripts/processCSVData");
// const processAPIData = require("./api-scripts/processAPIData");
import processCSVData from "./csv-scripts/processCSVData.cjs";
import processAPIData from "./api-scripts/processAPIData.js";
import fs from "fs";
import shell from "shelljs";

// Set Permier League season, determines which CSV file data will be pulled from
const season = "2019-20";

(() => {
    // Check if FPL data already exists locally, if not then pull the repo
    if (!fs.existsSync("./Fantasy-Premier-League")) {
        shell.exec("git clone https://github.com/vaastav/Fantasy-Premier-League", { async: true }, () => {
            processCSVData(season);
        });
    } else {
        processCSVData(season);
    }
})();

// (() => {
//     processAPIData();
// })();
