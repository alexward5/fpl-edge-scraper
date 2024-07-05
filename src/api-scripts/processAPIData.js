// const FBRefTable = require("../classes/FBRefTable");
import FBRefTable from "../classes/FBRefTable.cjs";

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

export default processAPIData;
