CREATE TABLE IF NOT EXISTS accounts (
    user_id serial PRIMARY KEY,
	username VARCHAR ( 50 ) UNIQUE NOT NULL,
	password VARCHAR ( 255 ) NOT NULL,
	email VARCHAR ( 255 ) UNIQUE NOT NULL,
    scopes VARCHAR ( 255 )
	created_on TIMESTAMP NOT NULL,
    last_login TIMESTAMP
);