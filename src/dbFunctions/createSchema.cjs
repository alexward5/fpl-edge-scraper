const pool = require("../pg.cjs");

async function createSchema(season) {
    try {
        const res = await pool.query(`CREATE SCHEMA IF NOT EXISTS "${season}"`);

        console.log(`Successfully created schema "${season}"`);
        return res;
    } catch (err) {
        throw new Error(`Error creating schema "${season}": ${err.message}`);
    }
}

module.exports = createSchema;
