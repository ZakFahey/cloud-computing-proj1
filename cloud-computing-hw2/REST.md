`(GET) /historical/` - Gets all the dates with recorded temperatures

`(GET) /historical/{date}` - Gets the high and low temperatures for the given date

`(POST) /historical/` - Adds or updates the temperature values for the given date. Returns the date.

`(DELETE) /historical/{date}` - Deletes the entry for the given date. Returns the entry.

`(GET) /forecast/{date}` - Gives the predicted weather of the next seven days starting from the given date

`(GET) /forecast/external` - Gives the predicted weather of the next seven days starting from the current date using the openweathermap.org API. Used for the extra credit in HW3.

`(GET) /documentation` - Shows the Swagger documentation page
