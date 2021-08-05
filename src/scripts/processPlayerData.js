const csvToJSON = require("../helpers/csvToJSON");
const processPlayerMetadata = require("./processPlayerMetadata");
const processPlayerSeasonStats = require("./processPlayerSeasonStats");
const processGwStats = require("./processGwStats");

async function processPlayerData(season) {
  const playerMetadata = await csvToJSON(
    `./Fantasy-Premier-League/data/${season}/player_idlist.csv`
  );

  const gameweeks = [1, 2, 3, 4, 5];

  try {
    // One process function for each db table we want to create
    await processPlayerMetadata(playerMetadata, season);
    await processPlayerSeasonStats(playerMetadata, season);
    await Promise.all(
      gameweeks.map(async (gameweek) =>
        processGwStats(playerMetadata, season, gameweek)
      )
    );
  } catch (err) {
    console.error(err);
  } finally {
    console.log("Finished processing historical data");
  }
}

module.exports = processPlayerData;
