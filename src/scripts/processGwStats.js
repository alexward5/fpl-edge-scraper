const fs = require("fs");
const createTable = require("./dbFunctions/createTable");
const seedTable = require("./dbFunctions/seedTable");
const csvToJSON = require("../helpers/csvToJSON");
const escapeQuotes = require("../helpers/escapeQuotes");
const dbTableTemplates = require("../templates/dbtables.json");

async function processGWStats(season) {
  await createTable(season, "gameweek_data", dbTableTemplates.gameweek);

  // Here we create an array with one index per gameweek file, formatted as 'gw1.csv', 'gw2.csv', etc.
  const gameweekFiles = fs
    .readdirSync(`./Fantasy-Premier-League/data/${season}/gws`)
    .filter((fileName) => fileName.includes("gw"));

  // Aggregate all gameweek CSV data into one array with one index per gameweek
  const gameweeksArr = await Promise.all(
    gameweekFiles.map(async (gameweekFile) =>
      csvToJSON(`./Fantasy-Premier-League/data/${season}/gws/${gameweekFile}`)
    )
  );

  // Flatten the gameweeks array into a one dimensional array
  // Each element in the array is an object with the data for a single player in a single gameweek
  const mergedGameweeks = [].concat(...gameweeksArr);

  // Add unique id (gameweek/round number appended to the element number) to each player gameweek object in our array
  // This id is used as the primary key in our gameweek data table
  const gameweekStatsString = escapeQuotes(
    mergedGameweeks.map((playerData) => ({
      ...playerData,
      id: playerData.element.concat(playerData.round),
    }))
  ).toLowerCase();

  await seedTable(
    season,
    "gameweek_data",
    dbTableTemplates.gameweek,
    gameweekStatsString
  );
}

module.exports = processGWStats;
