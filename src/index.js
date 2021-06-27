const fs = require("fs");
const shell = require("shelljs");
const csvtojson = require("csvtojson");

async function processPlayerIds() {
  const jsonObj = await csvtojson()
    .fromFile("./Fantasy-Premier-League/data/2020-21/player_idlist.csv")
    .then((json) => json)
    .catch((err) =>
      console.error(`Error converting CSV to JSON: ${err.message}`)
    );

  console.log(jsonObj);
}

if (fs.existsSync("./Fantasy-Premier-League")) {
  console.log("FPL DATA ALREADY EXISTS");
  processPlayerIds();
} else {
  console.log("CLONING REPO");
  shell.exec(
    "git clone https://github.com/vaastav/Fantasy-Premier-League",
    { async: true },
    () => {
      console.log("FINISHED CLOING REPO!");
      processPlayerIds();
    }
  );
}
