const csvtojson = require("csvtojson");

async function csvToJSON(filePath) {
  const parsedJSON = await csvtojson()
    .fromFile(filePath)
    .then((json) => json)
    .catch((err) => {
      throw new Error(
        `Error converting CSV at ${filePath} to JSON: ${err.message}`
      );
    });

  return parsedJSON;
}

module.exports = csvToJSON;
