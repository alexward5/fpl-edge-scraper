const csvToJSON = require("../helpers/csvToJSON.cjs");
const createSchema = require("../dbFunctions/createSchema.cjs");
const processPlayerMetadata = require("./processPlayerMetadata.cjs");
const processPlayerSeasonStats = require("./processPlayerSeasonStats.cjs");
const processGwStats = require("./processGwStats.cjs");
const processTeamMetadata = require("./processTeamMetadata.cjs");
const processTeamUnderstatData = require("./processTeamUnderstatData.cjs");

async function processCSVData(season) {
    const playerMetadata = await csvToJSON(`./Fantasy-Premier-League/data/${season}/player_idlist.csv`);
    const teamMetadata = await csvToJSON(`./Fantasy-Premier-League/data/${season}/teams.csv`);

    try {
        // Create schema with name specified in index.js
        await createSchema(season);
        // One function for each db table we want to create and seed
        await processPlayerMetadata(playerMetadata, season);
        await processPlayerSeasonStats(playerMetadata, season);
        await processGwStats(season);
        await processTeamMetadata(teamMetadata, season);
        await processTeamUnderstatData(teamMetadata, season);
    } catch (err) {
        console.error(err);
    } finally {
        console.log("Finished processing historical data");
    }
}

module.exports.default = processCSVData;
