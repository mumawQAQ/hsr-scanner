@echo off
SETLOCAL ENABLEEXTENSIONS ENABLEDELAYEDEXPANSION

REM post_update_restore.bat
REM This script restores backed-up files after the update.

REM Define variables
SET "SCRIPT_DIR=%~dp0"
SET "APP_DIR=%SCRIPT_DIR%..\"
SET "BACKUP_DIR=%SCRIPT_DIR%\..\..\..\update_backup"

REM Normalize paths
SET "APP_DIR=!APP_DIR:\=\\!"
SET "BACKUP_DIR=!BACKUP_DIR:\=\\!"

echo Starting post-update restore...

REM Check if backup directory exists
if not exist "!BACKUP_DIR!" (
    echo Backup directory does not exist: !BACKUP_DIR!
    echo Cannot restore files.
    exit /b 1
)

REM List of files to restore
SET "FILES_TO_RESTORE=backend\app\assets\database\scanner.db"

REM Restore each file
for %%F in (%FILES_TO_RESTORE%) do (
    SET "DEST_FILE=!APP_DIR!%%F"
    SET "SOURCE_FILE=!BACKUP_DIR!\%%~nxF"

    REM Ensure destination directory exists
    SET "DEST_DIR=!DEST_FILE!\.."
    if not exist "!DEST_DIR!" (
        echo Creating directory !DEST_DIR!
        mkdir "!DEST_DIR!"
        if !ERRORLEVEL! neq 0 (
            echo Failed to create directory: !DEST_DIR!
            exit /b 1
        )
    )

    if exist "!SOURCE_FILE!" (
        echo Restoring %%F...
        copy /Y "!SOURCE_FILE!" "!DEST_FILE!" >nul
        if !ERRORLEVEL! neq 0 (
            echo Failed to restore %%F
            exit /b 1
        ) else (
            del /Q "!SOURCE_FILE!"
            echo Successfully restored %%F
        )
    ) else (
        echo Backup file not found: !SOURCE_FILE!, skipping.
    )
)


echo Post-update restore completed successfully.

REM Delete the backup folder
echo Deleting backup folder...
rmdir /S /Q "!BACKUP_DIR!"
if !ERRORLEVEL! neq 0 (
    echo Failed to delete backup folder: !BACKUP_DIR!
    exit /b 1
) else (
    echo Successfully deleted backup folder.
)

echo Post-update restore and cleanup completed successfully.
exit /b 0