# luftdaten-data

Extract data from Luftdaten archive.
add 1 day from archive into table as_measurement

  node index luftdaten-data-archive 2017-10-02

Create for every new sensor or sensor location a foi record with no duplicates for new dates/not changed foi data.

   select insert_foi_datetime();  //todo: integrated in previous node script 
   
check latest processed date :
	select max(avg_datetime) from as_gridcell_avg   

Calculate grid cell values per 5 minut cycle. Repeat next sql's for every hour of that day

select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 00:00:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 00:05:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 00:10:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 00:15:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 00:20:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 00:25:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 00:30:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 00:35:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 00:40:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 00:45:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 00:50:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 00:55:00+02');   

select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 01:00:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 01:05:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 01:10:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 01:15:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 01:20:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 01:25:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 01:30:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 01:35:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 01:40:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 01:45:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 01:50:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 01:55:00+02');   

select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 02:00:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 02:05:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 02:10:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 02:15:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 02:20:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 02:25:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 02:30:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 02:35:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 02:40:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 02:45:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 02:50:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 02:55:00+02');   

select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 03:00:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 03:05:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 03:10:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 03:15:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 03:20:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 03:25:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 03:30:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 03:35:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 03:40:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 03:45:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 03:50:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 03:55:00+02');   

select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 04:00:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 04:05:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 04:10:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 04:15:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 04:20:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 04:25:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 04:30:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 04:35:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 04:40:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 04:45:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 04:50:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 04:55:00+02');   

select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 05:00:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 05:05:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 05:10:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 05:15:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 05:20:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 05:25:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 05:30:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 05:35:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 05:40:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 05:45:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 05:50:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 05:55:00+02');   

select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 06:00:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 06:05:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 06:10:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 06:15:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 06:20:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 06:25:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 06:30:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 06:35:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 06:40:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 06:45:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 06:50:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 06:55:00+02');   

select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 07:00:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 07:05:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 07:10:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 07:15:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 07:20:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 07:25:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 07:30:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 07:35:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 07:40:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 07:45:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 07:50:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 07:55:00+02');   

select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 08:00:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 08:05:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 08:10:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 08:15:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 08:20:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 08:25:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 08:30:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 08:35:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 08:40:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 08:45:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 08:50:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 08:55:00+02');   

select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 09:00:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 09:05:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 09:10:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 09:15:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 09:20:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 09:25:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 09:30:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 09:35:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 09:40:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 09:45:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 09:50:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 09:55:00+02');   

select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 10:00:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 10:05:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 10:10:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 10:15:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 10:20:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 10:25:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 10:30:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 10:35:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 10:40:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 10:45:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 10:50:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 10:55:00+02');   

select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 11:00:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 11:05:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 11:10:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 11:15:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 11:20:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 11:25:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 11:30:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 11:35:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 11:40:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 11:45:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 11:50:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 11:55:00+02');   

select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 12:00:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 12:05:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 12:10:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 12:15:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 12:20:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 12:25:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 12:30:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 12:35:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 12:40:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 12:45:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 12:50:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 12:55:00+02');  

select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 13:00:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 13:05:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 13:10:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 13:15:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 13:20:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 13:25:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 13:30:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 13:35:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 13:40:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 13:45:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 13:50:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 13:55:00+02');   

select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 14:00:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 14:05:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 14:10:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 14:15:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 14:20:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 14:25:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 14:30:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 14:35:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 14:40:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 14:45:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 14:50:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 14:55:00+02');   

select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 15:00:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 15:05:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 15:10:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 15:15:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 15:20:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 15:25:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 15:30:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 15:35:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 15:40:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 15:45:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 15:50:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 15:55:00+02');  

select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 16:00:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 16:05:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 16:10:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 16:15:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 16:20:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 16:25:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 16:30:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 16:35:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 16:40:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 16:45:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 16:50:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 16:55:00+02');   

select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 17:00:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 17:05:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 17:10:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 17:15:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 17:20:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 17:25:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 17:30:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 17:35:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 17:40:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 17:45:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 17:50:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 17:55:00+02');   

select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 18:00:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 18:05:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 18:10:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 18:15:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 18:20:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 18:25:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 18:30:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 18:35:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 18:40:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 18:45:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 18:50:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 18:55:00+02');  

select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 19:00:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 19:05:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 19:10:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 19:15:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 19:20:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 19:25:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 19:30:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 19:35:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 19:40:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 19:45:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 19:50:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 19:55:00+02');   

select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 20:00:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 20:05:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 20:10:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 20:15:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 20:20:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 20:25:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 20:30:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 20:35:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 20:40:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 20:45:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 20:50:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 20:55:00+02');   

select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 21:00:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 21:05:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 21:10:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 21:15:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 21:20:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 21:25:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 21:30:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 21:35:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 21:40:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 21:45:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 21:50:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 21:55:00+02');   

select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 22:00:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 22:05:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 22:10:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 22:15:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 22:20:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 22:25:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 22:30:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 22:35:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 22:40:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 22:45:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 22:50:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 22:55:00+02');   

select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 23:00:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 23:05:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 23:10:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 23:15:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 23:20:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 23:25:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 23:30:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 23:35:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 23:40:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 23:45:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 23:50:00+02');
select as_insert_gridcell_avg('LDEUR20170901:1','2017-10-02 23:55:00+02');   
