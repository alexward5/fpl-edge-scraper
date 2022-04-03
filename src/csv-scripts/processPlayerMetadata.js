const createTable = require("../dbFunctions/createTable");
const seedTable = require("../dbFunctions/seedTable");
const escapeQuotes = require("../helpers/escapeQuotes");
const dbTableTemplates = require("../templates/db-column-template.json");

const tableName = "player_metadata";

async function processPlayerMetadata(playerMetadata, season) {
  await createTable(season, tableName, dbTableTemplates[tableName]);

  const playerMetadataString = escapeQuotes(playerMetadata);

  await seedTable(
    season,
    tableName,
    dbTableTemplates[tableName],
    playerMetadataString
  );
}

module.exports = processPlayerMetadata;
