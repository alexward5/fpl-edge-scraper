const pool = require("../../pg");

async function seedTable(schema, tableName, columnTemplate, jsonString) {
  // Remove serial primary key from column template if it exists, as it will be added automatically
  if (columnTemplate.columns[0].column_type === "serial") {
    columnTemplate.columns.shift();
  }

  try {
    const res = await pool.query(
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
      `
    );

    console.log(`Successfully seeded "${schema}".${tableName}`);
    return res;
  } catch (err) {
    throw new Error(`Error seeding "${schema}".${tableName}: ${err.message}`);
  }
}

module.exports = seedTable;
