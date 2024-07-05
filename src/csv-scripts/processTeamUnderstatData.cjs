const fs = require("fs");
const escapeQuotes = require("../helpers/escapeQuotes.cjs");
const csvToJSON = require("../helpers/csvToJSON.cjs");
const parseTeamName = require("../helpers/parseTeamName.cjs");
const checkContainsAll = require("../helpers/checkContainsAll.cjs");
const createTable = require("../dbFunctions/createTable.cjs");
const seedTable = require("../dbFunctions/seedTable.cjs");
const dbTableTemplates = require("../templates/db_column_template.json");

const tableName = "team_understat_data";

async function processTeamUnderstatData(teamMetadata, season) {
    await createTable(season, tableName, dbTableTemplates[tableName]);

    // Here we create an array with one index per understat file,
    // formatted as 'understat_Arsenal.csv', 'understat_Brighton.csv', etc.
    const teamUnderstatFiles = fs
        .readdirSync(`./Fantasy-Premier-League/data/${season}/understat`)
        .filter((fileName) => fileName.includes("understat"))
        .filter((fileName) => !fileName.includes("player"))
        // Filter out teams that we don't have metadata for (some extra teams have understat data for unknown reason)
        .filter((fileName) => {
            const teamName = parseTeamName(fileName);
            return teamMetadata.find((teamMetadataObj) => checkContainsAll(teamName, teamMetadataObj.name));
        });

    // Aggregate all understat CSV data into one array with one index per team
    const teamUnderstatDataArr = await Promise.all(
        teamUnderstatFiles.map(async (teamUnderstatFile) => {
            // Team id is missing in team understat CSVs, so find it in metadata and add it to understat data object
            const teamName = parseTeamName(teamUnderstatFile);
            const foundTeam = teamMetadata.find((teamDataObj) => checkContainsAll(teamName, teamDataObj.name));

            if (!foundTeam) {
                throw new Error(
                    `Error processing understat data for ${teamName} - unable to find team name match in metadata`
                );
            }

            const teamUnderstatData = await csvToJSON(
                `./Fantasy-Premier-League/data/${season}/understat/${teamUnderstatFile}`
            );

            // Understat gameweek data is ordered by date, so index 0 in the teamUnderstatDataArr corresponds with gw1
            // Therefore we can use index + 1 to add the gameweek number to each object in our array
            return teamUnderstatData.map((teamUnderstatDataObj, index) => ({
                // Create unique id formatted as <team_id>-<gameweek>
                id: `${foundTeam.id}-${index + 1}`,
                team_id: foundTeam.id,
                gameweek: index + 1,
                ...teamUnderstatDataObj,
            }));
        })
    );

    // Flatten the understat data array into a one dimensional array
    // Each element in the array is an object with a single team's understat data for a single week
    const mergedTeams = [].concat(...teamUnderstatDataArr);

    const cleanedArr = escapeQuotes(mergedTeams).toLowerCase();

    await seedTable(season, tableName, dbTableTemplates[tableName], cleanedArr);
}

module.exports = processTeamUnderstatData;
