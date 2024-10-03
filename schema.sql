CREATE TABLE players (
    id SERIAL ,
    gameid INT,
    name VARCHAR(256),
    cardsinhand INT[],
    FOREIGN KEY (gameid) REFERENCES games(id),
    PRIMARY KEY (id)
    
);


CREATE TABLE decks (
    id SERIAL ,
    gameid INT,
    name VARCHAR(256),
    cardsindeck INT[],
    FOREIGN KEY (gameid) REFERENCES games(id),
    PRIMARY KEY (id)
);



CREATE TABLE games
(
 id SERIAL ,
 gametype VARCHAR(100),
 gamecode VARCHAR(256),
 cardsinplay INT [],
 PRIMARY KEY (id)
);


INSERT INTO games (gametype , gamecode, cardsinplay ) VALUES ('Apples', 'Test', ARRAY[1,2,3,4,5,6,7,8,9,10],);