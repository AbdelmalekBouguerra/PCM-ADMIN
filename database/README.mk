Converting excel to csv using :
    https://www.zamzar.com/uploadComplete.php?session=2932e37cd0addb8e33775b1f2088b28&tcs=Z81
implement csv to mysql :
    LOAD DATA LOCAL INFILE  
    'C:\Users\Abdelmalek\Downloads\Digitalisation_traite.csv'
    INTO TABLE act
    FIELDS TERMINATED BY ';' 
    ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
    IGNORE 1 ROWS
    (code,designat, field_3);
reset id to 1 : 
    SET  @num := 0;
    UPDATE MEDECINS_CONVENTIONNES SET id = @num := (@num+1);
    ALTER TABLE MEDECINS_CONVENTIONNES AUTO_INCREMENT =1;
    
