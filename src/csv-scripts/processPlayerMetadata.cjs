const createTable = require("../dbFunctions/createTable.cjs");
const seedTable = require("../dbFunctions/seedTable.cjs");
const escapeQuotes = require("../helpers/escapeQuotes.cjs");
// const dbTableTemplates = require("../templates/db-column-template.json");
const dbTableTemplates = require("../templates/db_column_template.json");

const tableName = "player_metadata";

async function processPlayerMetadata(playerMetadata, season) {
    await createTable(season, tableName, dbTableTemplates[tableName]);

    const playerMetadataString = escapeQuotes(playerMetadata);

    await seedTable(season, tableName, dbTableTemplates[tableName], playerMetadataString);
}

module.exports = processPlayerMetadata;
