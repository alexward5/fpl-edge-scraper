const createTable = require("./dbFunctions/createTable");
const seedTable = require("./dbFunctions/seedTable");
const csvToJSON = require("../helpers/csvToJSON");
const cleanPlayerNames = require("../helpers/cleanPlayerNames");
const dbTableTemplates = require("../templates/dbtables.json");

async function processGWStats(playerMetadata, schema) {
  const i = 1;

  await createTable(schema, `gw${i}`, dbTableTemplates.gameweek);

  const gameweekStats = await csvToJSON(
    `./Fantasy-Premier-League/data/${schema}/gws/gw${i}.csv`
  );

  // Replace 'xP' with 'xp' so it can be used in column name
  const gameweekStatsString = cleanPlayerNames(gameweekStats).replace(
    /xP/g,
    "xp"
  );

  await seedTable(
    schema,
    `gw${i}`,
    dbTableTemplates.gameweek,
    gameweekStatsString
  );
}

module.exports = processGWStats;
