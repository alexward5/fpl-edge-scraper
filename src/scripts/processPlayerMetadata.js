const createTable = require("./createTable");
const seedTable = require("./seedTable");
const cleanPlayerNames = require("../helpers/cleanPlayerNames");
const dbTableTemplates = require("../templates/dbtables.json");

async function processPlayerMetadata(playerMetadata, schema) {
  await createTable(
    schema,
    "player_metadata",
    dbTableTemplates.player_metadata
  );

  const playerMetadataString = cleanPlayerNames(playerMetadata);

  await seedTable(
    schema,
    "player_metadata",
    dbTableTemplates.player_metadata,
    playerMetadataString
  );
}

module.exports = processPlayerMetadata;
