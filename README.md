# FPL Edge Scraper

This program creates the necessary schemas and tables used by the [FPL Edge API](https://github.com/alexward5/fpl-edge-api) and seeds the tables with data from Vaastav's [Fantasy-Premier-League](https://github.com/vaastav/Fantasy-Premier-League) data repository.

## Setup Instructions

Before running this program you will need to have either a local or remote database to connect to. Once you have a database, create a .env file in the root directory with the following values:

```
  dbhost=[YOUR_DB_HOST]
  dbport=[YOUR_DB_PORT]
  database=[YOUR_DB_NAME]
  dbuser=[YOUR_DB_USER]
  dbpassword=[YOUR_DB_PASSWORD]
```

Once you have a .env created with the necessary information for your database, open a terminal and install the required packages with `npm install`. After the packages have finished installing, run the program with `npm start`. A success message will be logged in the terminal for each schema and table that was created.
