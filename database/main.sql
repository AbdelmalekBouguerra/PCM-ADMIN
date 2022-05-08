SELECT  
    ID,
    (SELECT MATRICULE FROM `DEMANDEUR` AS D WHERE ID_DEMANDEUR = D.ID) as MATRICULE_DEM,
    IF( ISNULL(ID_BENEFICIAIRE),'Lui-même',(SELECT LIEN_PARENTE FROM `BÉNÉFICIAIRE` AS B WHERE ID_BENEFICIAIRE = B.ID)) as LIEN_PARENTE_BEN,
    STRUCTURE,ACT,STATU_DPC,
    IF(ID_AGENT1 = '1','true','false') as VALIDATION
FROM `DPC`
WHERE ID_AGENT1 = '1'
OR ISNULL(ID_AGENT1);




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
END;




