DROP ALL OBJECTS;

CREATE TABLE BROWSERACTIVITYDATA (
    URL VARCHAR(2048) PRIMARY KEY,
    TITLE VARCHAR(2048),
    START_TIME TIMESTAMP,
    END_TIME TIMESTAMP,
    LAST_ACCESSED TIMESTAMP,
    TIMES_ACCESSED INT
);