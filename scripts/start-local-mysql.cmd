@echo off
set MYSQL_BIN=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe
set MYSQL_BASE=C:\PROGRA~1\MySQL\MYSQLS~1.0
set MYSQL_DATA=F:\Projects\next_js_3\.local-mysql\data

start "next_js_3 local mysql" /min "%MYSQL_BIN%" --no-defaults --basedir=%MYSQL_BASE% --datadir=%MYSQL_DATA% --port=3307 --bind-address=127.0.0.1 --mysqlx=0
echo Local MySQL starting on 127.0.0.1:3307
