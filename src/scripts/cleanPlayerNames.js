function cleanPlayerNames(playerDataString) {
  return JSON.stringify(playerDataString).replace(/'/g, "''");
}

module.exports = cleanPlayerNames;
