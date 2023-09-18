CREATE DATABASE userdb

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    name VARCHAR(255),
    urlimage VARCHAR(255),
	follows INTEGER[] DEFAULT '{}',
	liked_videos INTEGER[] DEFAULT '{}'
);

CREATE TABLE videos (
	id_video SERIAL PRIMARY KEY,
	url VARCHAR(255) NOT NULL,
	title VARCHAR(255) NOT NULL,
	date DATE DEFAULT CURRENT_DATE,
	published BOOLEAN DEFAULT false,
	id int,
	FOREIGN KEY (id) REFERENCES users(id)
);