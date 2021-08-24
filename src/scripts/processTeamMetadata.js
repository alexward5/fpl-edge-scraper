const createTable = require("./dbFunctions/createTable");
const seedTable = require("./dbFunctions/seedTable");
const dbTableTemplates = require("../templates/db-column-template.json");

const tableName = "team_metadata";

async function processTeamMetadata(teamMetadata, season) {
  await createTable(season, tableName, dbTableTemplates[tableName]);

  const teamMetadataString = JSON.stringify(teamMetadata);

  await seedTable(
    season,
    tableName,
    dbTableTemplates[tableName],
    teamMetadataString
  );
}

module.exports = processTeamMetadata;
