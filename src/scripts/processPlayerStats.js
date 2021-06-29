const csvToJSON = require("./csvToJSON");
const processPlayerMetadata = require("./processPlayerMetadata");
const processPlayerSeasonStats = require("./processPlayerSeasonStats");

async function processPlayerStats(season) {
  const playerMetadata = await csvToJSON(
    `./Fantasy-Premier-League/data/${season}/player_idlist.csv`
  );

  processPlayerMetadata(playerMetadata, season);
  processPlayerSeasonStats(playerMetadata, season);
}

module.exports = processPlayerStats;
