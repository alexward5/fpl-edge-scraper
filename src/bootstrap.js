const express = require("express");
const cors = require("cors");
const axios = require("axios").default;

const app = express();
const port = 3000;

app.use(cors());

app.get("/bootstrap", (req, res) => {
  axios
    .get("https://fantasy.premierleague.com/api/bootstrap-static/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36",
      },
    })
    .then((response) => {
      // handle success
      const { elements } = response.data;
      console.log("elements", elements);
      res.send("success");
    })
    .catch((err) => {
      // handle error
      console.log("Error fetching bootstrap", err);
      res.send("error");
    });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
