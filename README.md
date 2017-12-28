# luftdaten-data

Extract data from Luftdaten archive.
add 1 day from archive into table as_measurement

  cd projects/SCAPE604/luftdaten-data
  node index luftdaten-data-archive 2017-12-23

Create for every new sensor or sensor location a foi record with no duplicates for new dates/not changed foi data.

   select insert_foi_datetime();  //todo: integrated in previous node script 
   
check latest processed date :
	select max(avg_datetime) from as_gridcell_avg   

Calculate grid cell values per 5 minut cycle. Repeat next sql's for every hour of that day

next step:

- gridcell Luftdaten Stuttgart.sql
- gridcell Luftdaten Sofia.sql
- gridcell Luftdaten Euro.sql


