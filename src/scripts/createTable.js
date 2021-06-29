const pool = require("../pg");

function createTable(schema, tableName, columnTemplate) {
  pool.query(
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
  `,
    [],
    (err) => {
      if (err) {
        console.log(`Error creating "${schema}".${tableName}: ${err.message}`);
      } else {
        console.log(`Successfully created "${schema}".${tableName}`);
      }
    }
  );
}

module.exports = createTable;
