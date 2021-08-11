const pool = require("../../pg");

async function createTable(season, tableName, columnTemplate) {
  try {
    const res = await pool.query(
      `
        CREATE TABLE IF NOT EXISTS "${season}".${tableName} (
          ${columnTemplate.columns
            .map(
              (column) =>
                `${column.column_name} ${column.column_type} ${
                  column.primary_key ? "PRIMARY KEY" : ""
                }`
            )
            .join()}
        );
      `
    );

    console.log(`Successfully created "${season}".${tableName}`);
    return res;
  } catch (err) {
    throw new Error(`Error creating "${season}".${tableName}: ${err.message}`);
  }
}

module.exports = createTable;