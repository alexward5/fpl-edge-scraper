const fetch = require("node-fetch");
const JSSoup = require("jssoup").default;
const teamNameMapping = require("../mappings/team_names.json");

async function getFplData() {
    // Get player data from FPL API
    const response = await fetch(
        "https://fantasy.premierleague.com/api/bootstrap-static/"
    );
    const body = await response.json();
    const fplTeamData = body.teams;
    const fplPlayerData = body.elements;

    return {
        fplTeamData,
        fplPlayerData,
    };
}

async function getFBRefTeamUrls() {
    // Scrape fb-ref team URLs
    const res = await fetch(
        "https://fbref.com/en/comps/9/Premier-League-Stats"
    );
    const rawHTML = await res.text();
    const soup = new JSSoup(rawHTML);

    const teamURLs = [];

    const tableRows = soup.find("table").find("tbody").findAll("tr");

    tableRows.forEach((teamRow) => {
        const dataCols = teamRow.findAll("td");
        dataCols.forEach((dataCol) => {
            const dataStat = dataCol.attrs["data-stat"];
            if (dataStat === "squad") {
                teamURLs.push(
                    `https://fbref.com${dataCol.find("a").attrs.href}`
                );
            }
        });
    });

    return teamURLs;
}

async function processAPIData() {
    try {
        const { fplPlayerData, fplTeamData } = await getFplData();
        console.log(fplPlayerData.length);
        const fbRefTeamURLs = await getFBRefTeamUrls();

        // Find the FBRef URL for each team
        const teamData = fplTeamData.map((fplTeamDataObj) => {
            const fplTeamName = fplTeamDataObj.name;
            const teamNameMapObj = teamNameMapping.find(
                (teamNameObj) => teamNameObj.fplName === fplTeamName
            );
            const teamURL = fbRefTeamURLs.find((url) =>
                url.includes(teamNameMapObj.fbRefURLName)
            );
            if (!teamURL) {
                throw new Error(
                    `Error: No FBRef team URL match found for ${fplTeamDataObj.name}`
                );
            }
            return {
                ...fplTeamDataObj,
                fb_ref_url: teamURL,
            };
        });

        console.log(teamData);
    } catch (err) {
        console.error(err);
    } finally {
        console.log("Finished processing API data");
    }
}

module.exports = processAPIData;
