// Input strings are formatted as understat_Aston_Villa.csv, understat_Crystal_Palace.csv, etc.
function parseTeamName(fileNameString) {
  return (
    fileNameString
      // Remove _understat prefix from file name
      .split("understat_")
      .splice(1, 1)
      .join()
      // Remove .csv ending from file name
      .split(".csv")
      .splice(0, 1)
      .join()
      // Replace underscores in file name with spaces
      .split("_")
      .join(" ")
  );
}

module.exports = parseTeamName;
