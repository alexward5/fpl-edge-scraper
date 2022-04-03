require("dotenv").config();
const fs = require("fs");
const shell = require("shelljs");
const processPlayerData = require("./csv-scripts/processPlayerData");

// Set Permier League season, determines which CSV file data will be pulled from
const season = "2020-21";

(() => {
  // Check if FPL data already exists locally, if not then pull the repo
  if (!fs.existsSync("./Fantasy-Premier-League")) {
    shell.exec(
      "git clone https://github.com/vaastav/Fantasy-Premier-League",
      { async: true },
      () => {
        processPlayerData(season);
      }
    );
  } else {
    processPlayerData(season);
  }
})();
