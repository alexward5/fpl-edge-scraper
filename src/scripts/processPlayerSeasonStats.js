const createTable = require("./createTable");
const seedTable = require("./seedTable");
const csvToJSON = require("../helpers/csvToJSON");
const cleanPlayerNames = require("../helpers/cleanPlayerNames");
const dbTableTemplates = require("../templates/dbtables.json");

async function processPlayerSeasonStats(playerMetadata, schema) {
  await createTable(schema, "player_totals", dbTableTemplates.player_totals);

  const playerSeasonStats = await csvToJSON(
    `./Fantasy-Premier-League/data/${schema}/cleaned_players.csv`
  );

  const playerSeasonStatsWithIds = playerSeasonStats.map((cleanedPlayerObj) => {
    const foundPlayer = playerMetadata.find(
      (player) =>
        player.first_name === cleanedPlayerObj.first_name &&
        player.second_name === cleanedPlayerObj.second_name
    );
    if (!foundPlayer) {
      throw new Error(
        `Error processing season stats for ${cleanedPlayerObj.first_name} ${cleanedPlayerObj.second_name}`
      );
    }
    return { ...cleanedPlayerObj, id: foundPlayer.id };
  });

  const playerSeasonStatsString = cleanPlayerNames(playerSeasonStatsWithIds);

  await seedTable(
    schema,
    "player_totals",
    dbTableTemplates.player_totals,
    playerSeasonStatsString
  );
}

module.exports = processPlayerSeasonStats;
