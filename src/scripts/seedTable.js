const pool = require("../pg");

function seedTable(schema, tableName, columnTemplate, jsonString) {
  pool.query(
    `
    INSERT INTO "${schema}".${tableName}(
      ${columnTemplate.columns.map((column) => column.column_name).join()}
    )
    SELECT *
    FROM json_to_recordset('${jsonString}') AS x(
      ${columnTemplate.columns
        .map((column) => `${column.column_name} ${column.column_type}`)
        .join()}
    )
    ON CONFLICT DO NOTHING
  `,
    [],
    (err) => {
      if (err) {
        throw new Error(
          `Error seeding "${schema}".${tableName}: ${err.message}`
        );
      } else {
        console.log(`Successfully seeded "${schema}".${tableName}`);
      }
    }
  );
}

module.exports = seedTable;
