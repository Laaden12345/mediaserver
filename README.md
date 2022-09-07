# Media server (WIP)
A Plex-like media server. Currently only user management is present.

## Running
Requires docker compose 3.7+ and node 17+

Add .env to server/ folder with the following information:  
PORT=\<backend port>  
PGPORT=\<postgres port>  
PGUSER=\<postgres user>  
PGNAME=\<database name>  
PGPASSWORD=\<password for user>  
TOKEN_KEY=\<jwt secret>

`docker compose up --build` to build and run
`npm install` in server folder to install dependencies for local development
