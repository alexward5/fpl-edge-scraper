const createTable = require("./dbFunctions/createTable");
const seedTable = require("./dbFunctions/seedTable");
const csvToJSON = require("../helpers/csvToJSON");
const cleanPlayerNames = require("../helpers/cleanPlayerNames");
const dbTableTemplates = require("../templates/dbtables.json");

async function processGWStats(schema, gameweek) {
  await createTable(schema, `${gameweek}`, dbTableTemplates.gameweek);

  const gameweekStats = await csvToJSON(
    `./Fantasy-Premier-League/data/${schema}/gws/${gameweek}.csv`
  );

  // Replace 'xP' with 'xp' so it can be used in db column name
  const gameweekStatsString = cleanPlayerNames(gameweekStats).replace(
    /xP/g,
    "xp"
  );

  await seedTable(
    schema,
    `${gameweek}`,
    dbTableTemplates.gameweek,
    gameweekStatsString
  );
}

module.exports = processGWStats;
