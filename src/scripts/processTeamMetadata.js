const createTable = require("./dbFunctions/createTable");
const seedTable = require("./dbFunctions/seedTable");
const csvToJSON = require("../helpers/csvToJSON");
const dbTableTemplates = require("../templates/dbtables.json");

async function processTeamMetadata(season) {
  await createTable(season, "team_metadata", dbTableTemplates.team_metadata);

  const teamMetadata = await csvToJSON(
    `./Fantasy-Premier-League/data/${season}/teams.csv`
  );

  const teamMetadataString = JSON.stringify(teamMetadata);

  await seedTable(
    season,
    "team_metadata",
    dbTableTemplates.team_metadata,
    teamMetadataString
  );
}

module.exports = processTeamMetadata;
