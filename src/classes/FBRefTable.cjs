const fetch = require("node-fetch");
var JSSoup = require("jssoup").default;

class FBRefTable {
    constructor(tableURL, tableIndex) {
        this.tableURL = tableURL;
        this.tableIndex = tableIndex;
    }

    async getTableJSON() {
        const tableRowsJSON = [];

        try {
            const res = await fetch(this.tableURL);
            const rawHTML = await res.text();
            const soup = new JSSoup(rawHTML);

            const table = soup.findAll("table")[this.tableIndex];
            const tableRows = table.find("tbody").findAll("tr");

            tableRows.forEach((tableRow) => {
                const rowJSON = {};

                // Add data from head cell to rowJSON
                const headCell = tableRow.find("th");
                const headCellDataStat = headCell.attrs["data-stat"];
                const headCellDataLink = headCell.find("a");
                if (headCellDataLink) {
                    rowJSON[headCellDataStat] = headCellDataLink.text;
                    rowJSON[`${headCellDataStat}_url`] = `https://fbref.com${headCellDataLink.attrs.href}`;
                } else {
                    rowJSON[headCellDataStat] = headCell.text;
                }

                // Add data from data cells to rowJSON
                const tableCells = tableRow.findAll("td");
                tableCells.forEach((tableCell) => {
                    const tableCellDataStat = tableCell.attrs["data-stat"];
                    const tableCellDataLink = tableCell.find("a");
                    if (tableCellDataLink) {
                        rowJSON[tableCellDataStat] = tableCellDataLink.text;
                        rowJSON[`${tableCellDataStat}_url`] = `https://fbref.com${tableCellDataLink.attrs.href}`;
                    } else {
                        rowJSON[tableCellDataStat] = tableCell.text;
                    }
                });

                tableRowsJSON.push(rowJSON);
            });
        } catch (err) {
            throw new Error(`Unable to create JSON from table ${this.tableURL}[${this.tableIndex}]: ${err.message}`);
        }

        return tableRowsJSON;
    }
}

module.exports = FBRefTable;
