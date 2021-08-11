const fs = require("fs");
const createTable = require("./dbFunctions/createTable");
const seedTable = require("./dbFunctions/seedTable");
const csvToJSON = require("../helpers/csvToJSON");
const cleanPlayerNames = require("../helpers/cleanPlayerNames");
const dbTableTemplates = require("../templates/dbtables.json");

async function processGWStats(schema) {
  await createTable(schema, "gameweek_data", dbTableTemplates.gameweek);

  // Each gameweek data file is formatted as gw1.csv, gw2.csv, etc.
  // Here we create an array with one index per gameweek file, formatted as 'gw1', 'gw2', etc.
  const gameweeks = fs
    .readdirSync(`./Fantasy-Premier-League/data/${schema}/gws`)
    .filter((fileName) => fileName.includes("gw"));

  // Aggregate all gameweek CSV data into one array with one index per gameweek
  const gameweeksArray = await Promise.all(
    gameweeks.map(async (gameweek) =>
      csvToJSON(`./Fantasy-Premier-League/data/${schema}/gws/${gameweek}`)
    )
  );

  // Flatten the gameweeks array into a one dimensional array
  // with all of the gameweek data for a particular season.
  // Each element in the array is an object with the data for a single player in a single gameweek
  const mergedGameweeks = [].concat(...gameweeksArray);

  // Add unique id to each player gameweek object in our array
  // using the gameweek number appended to the element number.
  // This id is used as the primary key in our gameweek data table
  const gameweekStatsString = cleanPlayerNames(
    mergedGameweeks.map((playerData) => ({
      ...playerData,
      id: playerData.element.concat(playerData.round),
    }))
    // Replace 'xP' with 'xp' so it can be used in db column name
  ).replace(/xP/g, "xp");

  await seedTable(
    schema,
    "gameweek_data",
    dbTableTemplates.gameweek,
    gameweekStatsString
  );
}

module.exports = processGWStats;
