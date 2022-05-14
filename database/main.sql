SELECT
    ID,
    (
        SELECT
            MATRICULE
        FROM
            `DEMANDEUR` AS D
        WHERE
            ID_DEMANDEUR = D.ID
    ) as MATRICULE_DEM,
    IF(
        ISNULL(ID_BENEFICIAIRE),
        'Lui-même',(
            SELECT
                LIEN_PARENTE
            FROM
                `BÉNÉFICIAIRE` AS B
            WHERE
                ID_BENEFICIAIRE = B.ID
        )
    ) as LIEN_PARENTE_BEN,
    STRUCTURE,
    ACT,
    STATU_DPC,
    IF(ID_AGENT1 = '1', 'true', 'false') as VALIDATION
FROM
    `DPC`
WHERE
    ID_AGENT1 = '1'
    OR ISNULL(ID_AGENT1);

use pcm;

CREATE TABLE ACT(
    ID int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    CODE VARCHAR(2000),
    NUM int NOT NULL,
    D É SIGNATION VARCHAR(2000),
    MONTANT_GLOBAL_TTC VARCHAR(2000),
    TTC_80 VARCHAR(2000),
    TTC_20 VARCHAR(2000)
) DEFAULT CHARSET UTF8;

-- restarting id to 0

SET @num: = 0;

UPDATE MEDECINS_CONVENTIONNES SET id = @num: = (@num + 1);

ALTER TABLE MEDECINS_CONVENTIONNES AUTO_INCREMENT = 1;

SELECT ACT.CODE,ACT.DÉSIGNATION,STP.STRUCTURES FROM ACT, STRUCTURES_TIERS_PAYANT as STP
WHERE SUBSTRING(ACT.CODE,6,4) = STP.CODE;

SELECT *,SUBSTRING(ACT.CODE,6,4) FROM `ACT`;

-- mysql --local-infile=1 -u root -p1

-- LOAD DATA LOCAL INFILE '/home/abdelmalek/projects/PCM-ADMIN/database/csv/acts.csv' INTO TABLE ACT FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 ROWS (
--     CODE,
--     NUM,
--     D É SIGNATION,
--     MONTANT_GLOBAL_TTC,
--     TTC_80,
--     TTC_20
-- );