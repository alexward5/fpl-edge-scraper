const createTable = require("../dbFunctions/createTable");
const seedTable = require("../dbFunctions/seedTable");
const csvToJSON = require("../helpers/csvToJSON");
const escapeQuotes = require("../helpers/escapeQuotes");
const dbTableTemplates = require("../templates/db-column-template.json");

const tableName = "player_season_totals";

async function processPlayerSeasonStats(playerMetadata, season) {
  await createTable(season, tableName, dbTableTemplates[tableName]);

  const playerSeasonStats = await csvToJSON(
    `./Fantasy-Premier-League/data/${season}/cleaned_players.csv`
  );

  // This map is used to ensure that players who share the same first and last name will each be given a unique id
  const usedIdsMap = {};

  // Player id is missing in season stats CSV, so find it in metadata and add it to season stats object
  const playerSeasonStatsWithIds = playerSeasonStats.map((playerStatsObj) => {
    const foundPlayers = playerMetadata.filter(
      (playerMetadataObj) =>
        playerMetadataObj.first_name === playerStatsObj.first_name &&
        playerMetadataObj.second_name === playerStatsObj.second_name
    );
    if (!foundPlayers.length) {
      throw new Error(
        `Error processing season stats for ${playerStatsObj.first_name} ${playerStatsObj.second_name} - unable to find player name match in metadata`
      );
      // If only one player with the first/last name is found, then return the id from our metadata with that player's season stats
    } else if (foundPlayers.length === 1) {
      return { ...playerStatsObj, id: foundPlayers[0].id };
    } else {
      // If more than one player with the first/last name is found, iterate over those players until an unused id is found
      for (let i = 0; i < foundPlayers.length; i += 1) {
        if (!usedIdsMap[foundPlayers[i].id]) {
          // When an unused id is found, add that id to our map so it will not be used again
          usedIdsMap[foundPlayers[i].id] = true;
          return { ...playerStatsObj, id: foundPlayers[i].id };
        }
      }
    }
    return null;
  });

  const playerSeasonStatsString = escapeQuotes(playerSeasonStatsWithIds);

  await seedTable(
    season,
    tableName,
    dbTableTemplates[tableName],
    playerSeasonStatsString
  );
}

module.exports = processPlayerSeasonStats;
