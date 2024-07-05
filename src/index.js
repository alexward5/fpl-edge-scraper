import "dotenv/config";
import fs from "fs";
import shell from "shelljs";
import processCSVData from "./csv-scripts/processCSVData.cjs";
import processAPIData from "./api-scripts/processAPIData.js";

const PROCESS_CSV = false;
const PROCESS_API = true;

// Set Permier League season, determines which CSV file data will be pulled from
const season = "2019-20";

(() => {
    if (PROCESS_CSV) {
        // Check if FPL data already exists locally, if not then pull the repo
        if (!fs.existsSync("./Fantasy-Premier-League")) {
            shell.exec("git clone https://github.com/vaastav/Fantasy-Premier-League", { async: true }, () => {
                processCSVData(season);
            });
        } else {
            processCSVData(season);
        }
    }
})();

(() => {
    if (PROCESS_API) {
        processAPIData();
    }
})();
