const csvToJSON = require("../helpers/csvToJSON");
const processPlayerMetadata = require("./processPlayerMetadata");
const processPlayerSeasonStats = require("./processPlayerSeasonStats");
const processGwStats = require("./processGwStats");
const processTeamMetadata = require("./processTeamMetadata");

async function processPlayerData(season) {
  const playerMetadata = await csvToJSON(
    `./Fantasy-Premier-League/data/${season}/player_idlist.csv`
  );

  try {
    // One function for each db table we want to create and seed
    await processPlayerMetadata(playerMetadata, season);
    await processPlayerSeasonStats(playerMetadata, season);
    await processGwStats(season);
    await processTeamMetadata(season);
  } catch (err) {
    console.error(err);
  } finally {
    console.log("Finished processing historical data");
  }
}

module.exports = processPlayerData;
