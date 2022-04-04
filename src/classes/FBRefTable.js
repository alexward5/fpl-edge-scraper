const fetch = require("node-fetch");
const JSSoup = require("jssoup").default;

class FBRefTable {
    constructor(tableUrl, tableIndex) {
        this.tableUrl = tableUrl;
        this.tableIndex = tableIndex;
        this.tableJSON = this.getTableJSON();
    }

    async getTableJSON() {
        const res = await fetch(
            "https://fbref.com/en/squads/b8fd03ef/2020-2021/Manchester-City-Stats"
        );
        const rawHTML = await res.text();
        const soup = new JSSoup(rawHTML);

        const table = soup.findAll("table")[this.tableIndex];
        const tableRows = table.find("tbody").findAll("tr");

        const tableRowsJSON = [];

        tableRows.forEach((teamRow) => {
            const headCell = teamRow.find("th");
            const headCellDataStat = headCell.attrs["data-stat"];
            const headCellDataLink = headCell.find("a");
            if (headCellDataLink) {
                tableRowsJSON.push({
                    [headCellDataStat]: headCellDataLink.text,
                });
            } else {
                tableRowsJSON.push({
                    headCellDataStat: headCell.text,
                });
            }
        });

        console.log(tableRowsJSON);
    }
}

module.exports = FBRefTable;
