const createTable = require("./dbFunctions/createTable");
const seedTable = require("./dbFunctions/seedTable");
const dbTableTemplates = require("../templates/dbtables.json");

async function processTeamMetadata(teamMetadata, season) {
  await createTable(season, "team_metadata", dbTableTemplates.team_metadata);

  const teamMetadataString = JSON.stringify(teamMetadata);

  await seedTable(
    season,
    "team_metadata",
    dbTableTemplates.team_metadata,
    teamMetadataString
  );
}

module.exports = processTeamMetadata;
