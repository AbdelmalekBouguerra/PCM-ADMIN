Converting excel to csv using :
    https://www.zamzar.com/uploadComplete.php?session=2932e37cd0addb8e33775b1f2088b28&tcs=Z81
implement csv to mysql :
    LOAD DATA LOCAL INFILE  
    'c:/temp/some-file.csv'
    INTO TABLE your_awesome_table  
    FIELDS TERMINATED BY ',' 
    ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
    IGNORE 1 ROWS
    (field_1,field_2 , field_3);
reset id to 1 : 
    SET  @num := 0;
    UPDATE MEDECINS_CONVENTIONNES SET id = @num := (@num+1);
    ALTER TABLE MEDECINS_CONVENTIONNES AUTO_INCREMENT =1;
    
