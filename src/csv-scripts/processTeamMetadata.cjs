const createTable = require("../dbFunctions/createTable.cjs");
const seedTable = require("../dbFunctions/seedTable.cjs");
const dbTableTemplates = require("../templates/db_column_template.json");

const tableName = "team_metadata";

async function processTeamMetadata(teamMetadata, season) {
    await createTable(season, tableName, dbTableTemplates[tableName]);

    const teamMetadataString = JSON.stringify(teamMetadata);

    await seedTable(season, tableName, dbTableTemplates[tableName], teamMetadataString);
}

module.exports = processTeamMetadata;
