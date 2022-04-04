const fetch = require("node-fetch");

async function getFPLData() {
    // Get data from FPL API
    const response = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/");
    const body = await response.json();
    const fplTeamData = body.teams;
    const fplPlayerData = body.elements;

    return {
        fplTeamData,
        fplPlayerData,
    };
}

module.exports = getFPLData;
