const createTable = require("./dbFunctions/createTable");
const seedTable = require("./dbFunctions/seedTable");
const csvToJSON = require("../helpers/csvToJSON");
const escapeQuotes = require("../helpers/escapeQuotes");
const dbTableTemplates = require("../templates/dbtables.json");

async function processPlayerSeasonStats(playerMetadata, season) {
  await createTable(season, "player_totals", dbTableTemplates.player_totals);

  const playerSeasonStats = await csvToJSON(
    `./Fantasy-Premier-League/data/${season}/cleaned_players.csv`
  );

  // ID is missing in season stats CSV, so find it in metadata and add it to season stats object
  const playerSeasonStatsWithIds = playerSeasonStats.map((playerStatsObj) => {
    const foundPlayer = playerMetadata.find(
      (playerMetadataObj) =>
        playerMetadataObj.first_name === playerStatsObj.first_name &&
        playerMetadataObj.second_name === playerStatsObj.second_name
    );
    if (!foundPlayer) {
      throw new Error(
        `Error processing season stats for ${playerStatsObj.first_name} ${playerStatsObj.second_name}`
      );
    }
    return { ...playerStatsObj, id: foundPlayer.id };
  });

  const playerSeasonStatsString = escapeQuotes(playerSeasonStatsWithIds);

  await seedTable(
    season,
    "player_totals",
    dbTableTemplates.player_totals,
    playerSeasonStatsString
  );
}

module.exports = processPlayerSeasonStats;
