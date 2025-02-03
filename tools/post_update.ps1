# post_update_restore.ps1
# This script restores backed-up files after the update.

# Use the directory of the script as the starting point.
$ScriptDir   = $PSScriptRoot

# Define directories based on the script location.
$AppDir      = (Join-Path $ScriptDir "..") | Resolve-Path -Relative
$BackupDir   = (Join-Path $ScriptDir "..\..\update_backup") | Resolve-Path -Relative

Write-Host "Starting post-update restore..."

# Check if the backup directory exists.
if (-not (Test-Path $BackupDir)) {
    Write-Host "Backup directory does not exist: $BackupDir"
    Write-Host "Cannot restore files."
    exit 1
}

# Define the list of files to restore.
# (You can add additional relative paths to this array if needed.)
$FilesToRestore = @("backend\app\assets\database\scanner.db")

foreach ($relativeFile in $FilesToRestore) {
    # Compute the destination file path by combining the app directory with the relative file path.
    $destFile = Join-Path $AppDir $relativeFile

    # Compute the source file path.
    # The batch file used the file name (without path) from the backup directory.
    $fileName   = [System.IO.Path]::GetFileName($relativeFile)
    $sourceFile = Join-Path $BackupDir $fileName

    # Ensure the destination directory exists.
    $destDir = Split-Path $destFile
    if (-not (Test-Path $destDir)) {
        Write-Host "Creating directory $destDir"
        try {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        catch {
            Write-Host "Failed to create directory: $destDir"
            exit 1
        }
    }

    if (Test-Path $sourceFile) {
        Write-Host "Restoring $relativeFile..."
        try {
            # Copy the file from backup to destination, overwriting if necessary.
            Copy-Item -Path $sourceFile -Destination $destFile -Force -ErrorAction Stop

            # Delete the source file after successful copy.
            Remove-Item $sourceFile -Force -ErrorAction Stop

            Write-Host "Successfully restored $relativeFile"
        }
        catch {
            Write-Host "Failed to restore $relativeFile"
            exit 1
        }
    }
    else {
        Write-Host "Backup file not found: $sourceFile, skipping."
    }
}

Write-Host "Post-update restore completed successfully."

# Delete the backup folder.
Write-Host "Deleting backup folder..."
try {
    Remove-Item -Path $BackupDir -Recurse -Force -ErrorAction Stop
    Write-Host "Successfully deleted backup folder."
}
catch {
    Write-Host "Failed to delete backup folder: $BackupDir"
    exit 1
}

Write-Host "Post-update restore and cleanup completed successfully."
exit 0
