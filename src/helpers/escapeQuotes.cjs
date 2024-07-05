function escapeQuotes(playerDataString) {
  return JSON.stringify(playerDataString).replace(/'/g, "''");
}

module.exports = escapeQuotes;
