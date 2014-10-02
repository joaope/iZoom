@echo off
setlocal enabledelayedexpansion

REM Extract version number from manifest
for /F "delims=: tokens=1,2" %%g in (manifest.json) DO (
    set version_text=%%g
    
    if "!version_text:~5,7!" == "version" (
        set untrimmed_version=%%h
        set version=!untrimmed_version:~2,-2!
    )
)

REM Build package's filename using version number
set _PACKAGE="iZoom-!version!.zip"

REM Do packaging to zip file
echo Packing to !_PACKAGE!...
"%~dp0tools\7za.exe" a -tzip "!_PACKAGE!" _locales\ media\ scripts\ stylesheets\ background.html izoom.js manifest.json options.html popup.html
