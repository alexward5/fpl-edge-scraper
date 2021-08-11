const createTable = require("./dbFunctions/createTable");
const seedTable = require("./dbFunctions/seedTable");
const cleanPlayerNames = require("../helpers/cleanPlayerNames");
const dbTableTemplates = require("../templates/dbtables.json");

async function processPlayerMetadata(playerMetadata, season) {
  await createTable(
    season,
    "player_metadata",
    dbTableTemplates.player_metadata
  );

  const playerMetadataString = cleanPlayerNames(playerMetadata);

  await seedTable(
    season,
    "player_metadata",
    dbTableTemplates.player_metadata,
    playerMetadataString
  );
}

module.exports = processPlayerMetadata;
