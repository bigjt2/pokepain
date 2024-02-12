## Property files

Some of these files are not checked into source countrol to protect the secrets to be exchanged between frontend and backend. In those cases they must be inserted in the root directory of both backend and frontend before starutp.

# backend:

Include the following files in a directory named 'props'.

# /props/auth_config.js

Raw text secrets for cookie and JWT creation are expected. Also set the token expiration times within this file:
cookieSecret: any string -- secret used to generate the cookies containing access tokens
jwtSecret: any string -- secret used to generate JSON web tokens which serve as access tokens
jwtAccessExpiration: number -- access token expiration -- in seconds, once expired a refresh token should be requested
jwtRefreshExpiration: number -- refresh token expiration -- in seconds, once expired a user will have to re-login

# /props/cors_config_origins.js

This is a string array of allowed origins hosting the frontend. If devloping locally, make sure it includes your localhost.

Set the following environment variables in the OS where this is running.

# environment variables

POKEDEX_API_PORT - the port where the pokedex backend server will be lisening.
POKEDEX_MONGO_HOST - hostname of mongo db instance where pokedex database is to be located.
POKEDEX_MONGO_PORT - port where mongo db is listening
POKEDEX_MONGO_NAME - database name for collections used by the backend

# frontend:

# .env & .env.{environment}

These are the Vite property files holding locations to the backend. .env and .env.local are checked into source countrol for examples. Any other
environment needs to be added to the root directory of frontend and include a command for running it in the scripts section of package.json.

Here are the properties which should be stored in the .env file:
VITE_POKE_API_URL = "https://pokeapi.co/api/v2/pokemon/" -- the full URL of the online Poke API.

Here are the environment-specific properties stored in .env.{environment}

VITE_POKEDEX_HOST = "http://localhost" - host URL where backend (pokedex NodeJS service) will be running
VITE_POKEDEX_PORT = "7001" - host port where backend will be running
--the below are also both used in the frontend for the proxy address
VITE_FRONTEND_HOST = "http://localhost" - host URL where frontend (UI React app) will be running
VITE_FRONTEND_PORT= "8080" - host port where frontend will be running.
