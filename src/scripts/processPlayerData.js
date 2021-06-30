const csvToJSON = require("../helpers/csvToJSON");
const processPlayerMetadata = require("./processPlayerMetadata");
const processPlayerSeasonStats = require("./processPlayerSeasonStats");

async function processPlayerData(season) {
  const playerMetadata = await csvToJSON(
    `./Fantasy-Premier-League/data/${season}/player_idlist.csv`
  );

  await processPlayerMetadata(playerMetadata, season);
  await processPlayerSeasonStats(playerMetadata, season);
}

module.exports = processPlayerData;
