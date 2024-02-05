## Property files

Some of these files are not checked into source countrol to protect the secrets to be exchanged between frontend and backend. In those cases they must be inserted in the root directory of both backend and frontend before starutp.

# backend:

# /props/auth_config.js

Raw text secrets for cookie and JWT creation are expected. Also set the token expiration times within this file:
cookieSecret: any string -- secret used to generate the cookies containing access tokens
jwtSecret: any string -- secret used to generate JSON web tokens which serve as access tokens
jwtAccessExpiration: number -- access token expiration -- in seconds, once expired a refresh token should be requested
jwtRefreshExpiration: number -- refresh token expiration -- in seconds, once expired a user will have to re-login

# environment variable

POKEDEX_API_PORT -

# /props/cors_config_origins.js

This is a string array of allowed origins hosting the frontend. If devloping locally, make sure it includes your localhost.

# frontend:

# .env & .env.{environment}

These are the Vite property files holding locations to the backend. .env and .env.local are checked into source countrol for examples. Any other
environment needs to be added to the root directory of frontend and include a command for running it in the scripts section of package.json.

Here are the properties which should be stored in the .env file:
VITE_POKE_API_URL = "https://pokeapi.co/api/v2/pokemon/"

Here are the environment-specific properties stored in .env.{environment}
VITE_ENV_HOST = "http://localhost"
VITE_POKEDEX_PORT = "7001"
VITE_FRONTEND_PROXY_PORT= "8080"
