# Vroom

Web stuff built by me.

## Setup

### Server

`cd server && npm i && cp .env.example .env`

Modify `.env` to match your setup. You'll need a PostgreSQL server.

Development: `npm start`

Production: `npm run build && npm start:prod`

### Web

`cd web && npm i`

Development: `npm start`

Production: `REACT_APP_API_URL="http://YOUR_URL_HERE:PORT" npm run build && serve -s build`
