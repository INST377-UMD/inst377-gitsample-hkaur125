# Campus Event Finder
By: Harlene Kaur

## Project Description
Campus Event Finder is a web application that allows users to search for nearby campus and local events using the Eventbrite API. 
Users can save events they are interested in and manage a personal list of saved events, which is stored in a database.


## Target Browsers
This application is designed to run on modern desktop and mobile browsers, including:
- Google Chrome (desktop & Android)
- Safari (iOS and macOS)


## Developer Manual
The Developer Manual is included below for future developers.


## Intended Audience
This document is intended for developers who are familiar with web development concepts (Node.js, APIs, databases) but have no prior knowledge of this project.


## Developer Installation

Node.js and Express are required for this application to run.

Install Node.js from https://nodejs.org and verify the installation by running:
node -v
Install all required dependencies by running the following command in the project directory:
npm install

Create a `.env` file in the project root with the following values(must make your own):

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
EVENTBRITE_TOKEN=your_eventbrite_api_token
PORT=3000

---

## Running Locally

To run the application locally, enter:
node server.js

If successful, the server will start on port 3000.

Open a browser and navigate to:
http://localhost:3000

To stop the server, press **CTRL + C** in the terminal.

---

## Testing

This project does not include automated tests. All functionality is tested manually through the browser.

---

###Server API Endpoints

**GET `/api/events`** – Fetches events from the Eventbrite API.
**GET `/api/saved-events`** – Retrieves saved events from the database.
**POST `/api/saved-events`** – Saves an event to the database.
**DELETE `/api/saved-events/:id`** – Deletes a saved event by ID.

---

## Known Issues and Future Development

Some events may have missing venue details.
No user authentication is implemented.
Future improvements may include user accounts, better filtering, and automated testing.








