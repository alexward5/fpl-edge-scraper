const fs = require("fs");
const createTable = require("../dbFunctions/createTable.cjs");
const seedTable = require("../dbFunctions/seedTable.cjs");
const csvToJSON = require("../helpers/csvToJSON.cjs");
const escapeQuotes = require("../helpers/escapeQuotes.cjs");
const dbTableTemplates = require("../templates/db_column_template.json");

const tableName = "player_gameweek_data";

async function processGWStats(season) {
    await createTable(season, tableName, dbTableTemplates[tableName]);

    // Here we create an array with one index per gameweek file, formatted as 'gw1.csv', 'gw2.csv', etc.
    const gameweekFiles = fs
        .readdirSync(`./Fantasy-Premier-League/data/${season}/gws`)
        .filter((fileName) => fileName.includes("gw"));

    // Aggregate all gameweek CSV data into one array with one index per gameweek
    const gameweeksArr = await Promise.all(
        gameweekFiles.map(async (gameweekFile) =>
            csvToJSON(`./Fantasy-Premier-League/data/${season}/gws/${gameweekFile}`)
        )
    );

    // Flatten the gameweeks array into a one dimensional array
    // Each element in the array is an object with the data for a single player in a single gameweek
    const mergedGameweeks = [].concat(...gameweeksArr);

    // Add unique id formatted as <element number>-<gameweek/round number> to each player gameweek object in our array
    // This id is used as the primary key in our gameweek data table
    const gameweekStatsString = escapeQuotes(
        mergedGameweeks.map((playerData) => ({
            ...playerData,
            id: `${playerData.element}-${playerData.round}`,
        }))
    ).toLowerCase();

    await seedTable(season, tableName, dbTableTemplates[tableName], gameweekStatsString);
}

module.exports = processGWStats;
