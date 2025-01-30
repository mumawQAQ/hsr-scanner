@echo off
SETLOCAL ENABLEEXTENSIONS ENABLEDELAYEDEXPANSION

REM pre_update.bat
REM This script backs up excluded files before the update.

REM Define variables
SET "SCRIPT_DIR=%~dp0"
SET "APP_DIR=%SCRIPT_DIR%..\\"
SET "BACKUP_DIR=%SCRIPT_DIR%..\..\\update_backup"

REM Normalize paths
SET "APP_DIR=!APP_DIR:\=\\!"
SET "BACKUP_DIR=!BACKUP_DIR:\=\\!"

echo Starting pre-update backup...

REM Create backup directory if it doesn't exist
if not exist "!BACKUP_DIR!" (
    mkdir "!BACKUP_DIR!"
    if !ERRORLEVEL! neq 0 (
        echo Failed to create backup directory: !BACKUP_DIR!
        exit /b 1
    )
)

REM List of files to backup
SET "FILES_TO_BACKUP=backend\app\assets\database\scanner.db"

REM Backup each file
for %%F in (%FILES_TO_BACKUP%) do (
    SET "SOURCE_FILE=!APP_DIR!%%F"
    SET "DEST_FILE=!BACKUP_DIR!\\%%~nxF"

    if exist "!SOURCE_FILE!" (
        echo Backing up %%F...
        copy /Y "!SOURCE_FILE!" "!DEST_FILE!" >nul
        if !ERRORLEVEL! neq 0 (
            echo Failed to backup %%F
            exit /b 1
        ) else (
            echo Successfully backed up %%F
        )
    ) else (
        echo File not found: %%F, skipping.
    )
)

echo Pre-update backup completed successfully.
exit /b 0