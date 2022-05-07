CREATE TABLE MÉDECINE_TRAVAIL(  
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    Actes VARCHAR(255),
    Structures VARCHAR(2000),
    ADRESSE VARCHAR(2000),
    TEL VARCHAR(255)
) DEFAULT CHARSET UTF8;

LOAD DATA LOCAL INFILE  
    '/home/abdelmalek/projects/PCM-ADMIN/database/csv/medecin_travail.csv'
    INTO TABLE MÉDECINE_TRAVAIL  
    FIELDS TERMINATED BY ',' 
    ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
    IGNORE 1 ROWS
    (Actes,Structures,ADRESSE,TEL);