# Cloud Computing HW2

HTTP web service for weather forecasts. Includes these routes:

`(GET) /historical/` - Gets all the dates with recorded temperatures

`(GET) /historical/{date}` - Gets the high and low temperatures for the given date

`(POST) /historical/` - Adds or updates the temperature values for the given date

`(DELETE) /historical/{date}` - Deletes the entry for the given date

`(GET) /forecast/{date}` - Gives the predicted weather of the next seven days starting from the given date

`(GET) /documentation` - Shows the Swagger documentation page

## Installation

1. This project is written in [Node.js](https://nodejs.org/en/). In order to run it, you must install Node.
2. Pull the repository and run the command `npm install` to update the dependencies.
3. Run the command `npm start` to start the server.

## Dependencies

This project uses several dependencies that can be found in [package.json](package.json)
