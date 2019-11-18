
@echo off
powershell -Command "Start-Process cmd -ArgumentList '/k node C:\nodejs\aut-server\server.js'"
@echo on