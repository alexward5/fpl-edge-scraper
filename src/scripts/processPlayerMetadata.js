const createTable = require("./dbFunctions/createTable");
const seedTable = require("./dbFunctions/seedTable");
const escapeQuotes = require("../helpers/escapeQuotes");
const dbTableTemplates = require("../templates/db-column-template.json");

async function processPlayerMetadata(playerMetadata, season) {
  await createTable(
    season,
    "player_metadata",
    dbTableTemplates.player_metadata
  );

  const playerMetadataString = escapeQuotes(playerMetadata);

  await seedTable(
    season,
    "player_metadata",
    dbTableTemplates.player_metadata,
    playerMetadataString
  );
}

module.exports = processPlayerMetadata;
