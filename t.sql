-- Active: 1647102901345@@127.0.0.1@3306@pcm
SELECT ID,NUM_DPC,
(SELECT MATRICULE FROM `DEMANDEUR` AS D WHERE ID_DEMANDEUR = D.ID)as MATRICULE_DEM,
IF( ISNULL(ID_BENEFICIAIRE),'Lui-même',(SELECT LIEN_PARENTE FROM `BÉNÉFICIAIRE`AS B WHERE ID_BENEFICIAIRE = B.ID)) as LIEN_PARENTE_BEN,
STRUCTURE,ACT,STATU_DPC,
IF(ID_AGENT = 1,'true','false') as VALIDATION_AGENT,
IF(ISNULL(ID_CHEFREGION),'false','true') as VALIDATION_CHEFREGION,
IF(ISNULL(ID_DIRECTEUR),'false','true') as VALIDATION_DIRECTEUR
FROM `DPC`
WHERE ID_AGENT = 1 OR ISNULL(ID_AGENT)
ORDER BY ID;