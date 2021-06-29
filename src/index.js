require("dotenv").config();
const fs = require("fs");
const shell = require("shelljs");
const processPlayerStats = require("./scripts/processPlayerStats");

const season = "2020-21";

if (fs.existsSync("./Fantasy-Premier-League")) {
  console.log("FPL DATA ALREADY EXISTS");
  processPlayerStats(season);
} else {
  console.log("CLONING REPO");
  shell.exec(
    "git clone https://github.com/vaastav/Fantasy-Premier-League",
    { async: true },
    () => {
      console.log("FINISHED CLOING REPO!");
      processPlayerStats(season);
    }
  );
}
