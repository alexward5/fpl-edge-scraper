const createTable = require("./createTable");
const seedTable = require("./seedTable");
const cleanPlayerNames = require("./cleanPlayerNames");
const dbTableTemplates = require("../templates/dbtables.json");

async function processPlayerMetadata(playerMetadata, schema) {
  createTable(schema, "player_metadata", dbTableTemplates.player_metadata);

  const playerMetadataString = cleanPlayerNames(playerMetadata);

  seedTable(
    schema,
    "player_metadata",
    dbTableTemplates.player_metadata,
    playerMetadataString
  );
}

module.exports = processPlayerMetadata;
