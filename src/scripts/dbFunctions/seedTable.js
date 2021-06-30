const pool = require("../../pg");

async function seedTable(schema, tableName, columnTemplate, jsonString) {
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
