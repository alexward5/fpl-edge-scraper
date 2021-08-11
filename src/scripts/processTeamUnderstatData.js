const fs = require("fs");
const csvToJSON = require("../helpers/csvToJSON");
const createTable = require("./dbFunctions/createTable");
const seedTable = require("./dbFunctions/seedTable");
const dbTableTemplates = require("../templates/dbtables.json");

const escapeQuotes = require("../helpers/escapeQuotes");

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
    .filter((fileName) => fileName.includes("understat"));

  // Aggregate all understat CSV data into one array with one index per team
  const teamUnderstatDataArr = await Promise.all(
    teamUnderstatFiles.map(async (teamUnderstatFile) =>
      csvToJSON(
        `./Fantasy-Premier-League/data/${season}/understat/${teamUnderstatFile}`
      )
    )
  );

  // Flatten the understat data array into a one dimensional array
  // Each element in the array is an object with a single team's understat data for the season
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
