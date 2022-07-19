# fcc-backend-projects
5 Microservices API projects within freecodecamp's Backend Development and APIs certification

## Timestamp Microservice
https://replit.com/@aerasmo/project-timestamp

- Returns the unix and utc of the date supplied in the api parameters
- Handles dates that can be successfully parsed by new Date(date_string)
- A request to `/api/1451001600000` returns `{ unix: 1451001600000, utc: "Fri, 25 Dec 2015 00:00:00 GMT" }`

## Headerparser Microservice
https://replit.com/@aerasmo/project-headerparser

- Returns a JSON object corressponding to the current devices / ip address / language / software used on the request
- Accessed using `/api/whoami`

## URL Shortener 
https://replit.com/@aerasmo/project-urlshortener

- Submit a url and the service generates a shorturl for that url `POST /api/shorturl` 
- Example response `{ original_url : 'https://freeCodeCamp.org', short_url : 1}`
- Redirect to the main url using the route `GET /api/shorturl/1`

## Exercise Tracker
https://replit.com/@aerasmo/project-exercisetracker
- Creation of new user `POST /api/users`
- Create a new exercise for the user using forms and post request `POST /api/users/:_id/exercises`
- View the logs of added exercise for a specific user `GET /api/users/:id/logs`
- Ability to limit exercise logs response using query parameters `GET /api/users/:id/logs?from=2015-12-25&limit=2`

## File Metadata Microservice
https://replit.com/@aerasmo/project-filemetadata
- Allows viewing metadata of the submitted files `POST /api/fileanalyse`
- returns a JSON object with the file `name`, `type` and `size` in bytes 
