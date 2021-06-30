const pool = require("../pg");

async function createTable(schema, tableName, columnTemplate) {
  try {
    const res = await pool.query(
      `
        CREATE TABLE IF NOT EXISTS "${schema}".${tableName} (
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

    console.log(`Successfully created "${schema}".${tableName}`);
    return res;
  } catch (err) {
    throw new Error(`Error creating "${schema}".${tableName}: ${err.message}`);
  }
}

module.exports = createTable;
