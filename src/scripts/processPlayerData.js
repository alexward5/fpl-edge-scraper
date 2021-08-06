const fs = require("fs");
const csvToJSON = require("../helpers/csvToJSON");
const processPlayerMetadata = require("./processPlayerMetadata");
const processPlayerSeasonStats = require("./processPlayerSeasonStats");
const processGwStats = require("./processGwStats");

async function processPlayerData(season) {
  const playerMetadata = await csvToJSON(
    `./Fantasy-Premier-League/data/${season}/player_idlist.csv`
  );

  /**
   * Each gameweek data file is formatted as gw1.csv, gw2.csv, etc.
   * Here we create an array with one index per gameweek file, and that array is used to
   * create a table for each gameweek named after the file with the '.csv' ending removed
   */
  const gameweeks = fs
    .readdirSync(`./Fantasy-Premier-League/data/${season}/gws`)
    .filter((fileName) => fileName.includes("gw"))
    .map((fileName) => fileName.split(".").slice(0, 1));

  try {
    // One process function for each db table we want to create
    await processPlayerMetadata(playerMetadata, season);
    await processPlayerSeasonStats(playerMetadata, season);
    await Promise.all(
      gameweeks.map(async (gameweek) => processGwStats(season, gameweek))
    );
  } catch (err) {
    console.error(err);
  } finally {
    console.log("Finished processing historical data");
  }
}

module.exports = processPlayerData;
