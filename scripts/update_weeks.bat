@echo off
echo Running weeks.json update script...
node %~dp0\update_weeks_json.js
echo.
echo Press any key to exit
pause > nul 