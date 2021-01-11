@echo off

setlocal enableDelayedExpansion

cd "%~dp0"

set "WIDTH=1024"
set "PROCESSED_FILES_FILE=.processedFiles"
set i=0
set "filesToBeProcessed="

for /f "delims= tokens=*" %%a in (%PROCESSED_FILES_FILE%) do (
	set "processedFiles=%%a"
)

for /r %%a in (*.jpg) do (
	set "filesToBeProcessed=!filesToBeProcessed!, %%a"
)

@rem very janky, causes misfires when sequence of array string changes, too bad
if "!filesToBeProcessed!" equ "!processedFiles!" (
	exit /b
)

for /r %%a in (*.jpg) do (
	set "fileName=%%~nxa"
	set "backupFileName=%%~nxa.bak"
	
	if not exist "!backupFileName!" (
		ren "!fileName!" "!backupFileName!"
	)

	echo Backing up: "!fileName!" to "!backupFileName!"

	set /a i+=1
)

for /r %%a in (*.jpg.bak) do (
	set "backupfileName=%%~nxa"
	set "fileName=%%~na"
	
	if exist "!fileName!" (
		del "!fileName!"
	)

	echo Scaling: "!backupFileName!" to "!fileName!" @ %WIDTH%px width

	gm convert "!backupFileName!" -resize %WIDTH% -quality 100 "!fileName!"
)

echo !filesToBeProcessed!

echo !filesToBeProcessed!>%PROCESSED_FILES_FILE%