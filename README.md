## Property files

These files are not checked into source countrol to protect the secrets to be exchanged between frontend and backend. They must be inserted in the root directory of both backend and frontend before starutp.

# backend:

# /props/auth_config.js

Raw text secrets for cookie and JWT creation are expected. Also set the token expiration times within this file:
cookieSecret: any string -- secret used to generate the cookies containing access tokens
jwtSecret: any string -- secret used to generate JSON web tokens which serve as access tokens
jwtAccessExpiration: number -- access token expiration -- in seconds, once expired a refresh token should be requested
jwtRefreshExpiration: number -- refresh token expiration -- in seconds, once expired a user will have to re-login

# /props/cors_config_origins.js

This is a string array of allowed origins hosting the frontend. If devloping locally, make sure it includes your localhost.

# frontend:

# .env

bcrypt-encrypted string for API key provided to backend for authentication is expected in the '.env' file stored in frontend's root. Here are the other properties which should
be stored in the .env file:
VITE_POKE_API_URL = "https://pokeapi.co/api/v2/pokemon/"
VITE_POKEDEX_API_HOST = "http://localhost"
VITE_POKEDEX_API_PORT = "8001"
