const FBRefTable = require("../classes/FBRefTable");

async function processAPIData() {
    try {
        const table = new FBRefTable("https://fbref.com/en/comps/9/Premier-League-Stats", 0);
        const tableJSON = await table.getTableJSON();
        console.log(tableJSON);
    } catch (err) {
        console.error(err);
    } finally {
        console.log("Finished processing API data");
    }
}

module.exports = processAPIData;
