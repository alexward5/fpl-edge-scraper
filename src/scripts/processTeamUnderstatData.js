const fs = require("fs");
const escapeQuotes = require("../helpers/escapeQuotes");
const csvToJSON = require("../helpers/csvToJSON");
const parseTeamName = require("../helpers/parseTeamName");
const checkContainsAll = require("../helpers/checkContainsAll");
const createTable = require("./dbFunctions/createTable");
const seedTable = require("./dbFunctions/seedTable");
const dbTableTemplates = require("../templates/dbtables.json");

async function processTeamUnderstatData(teamMetadata, season) {
  await createTable(
    season,
    "team_understat_data",
    dbTableTemplates.team_understat_data
  );

  // Here we create an array with one index per understat file,
  // formatted as 'understat_Arsenal.csv', 'understat_Brighton.csv', etc.
  const teamUnderstatFiles = fs
    .readdirSync(`./Fantasy-Premier-League/data/${season}/understat`)
    .filter((fileName) => fileName.includes("understat"))
    .filter((fileName) => !fileName.includes("player"))
    // Filter out teams that we don't have metadata for (some extra teams have understat data for unknown reason)
    .filter((fileName) => {
      const teamName = parseTeamName(fileName);
      return teamMetadata.find((teamMetadataObj) =>
        checkContainsAll(teamName, teamMetadataObj.name)
      );
    });

  // Aggregate all understat CSV data into one array with one index per team
  const teamUnderstatDataArr = await Promise.all(
    teamUnderstatFiles.map(async (teamUnderstatFile) => {
      // Team id is missing in team understat CSVs, so find it in metadata and add it to understat data object
      const teamName = parseTeamName(teamUnderstatFile);
      const foundTeam = teamMetadata.find((teamDataObj) =>
        checkContainsAll(teamName, teamDataObj.name)
      );

      if (!foundTeam) {
        throw new Error(
          `Error processing understat data for ${teamName} - unable to find team name match in metadata`
        );
      }

      const teamUnderstatData = await csvToJSON(
        `./Fantasy-Premier-League/data/${season}/understat/${teamUnderstatFile}`
      );

      // Understat data is ordered by date, so we can get the gameweek number using index + 1
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

  await seedTable(
    season,
    "team_understat_data",
    dbTableTemplates.team_understat_data,
    cleanedArr
  );
}

module.exports = processTeamUnderstatData;
