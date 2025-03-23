# This script restores backed-up files after the update.

# Use the directory of the script as the starting point (absolute path).
$ScriptDir = $PSScriptRoot

# Define directories based on the script location.
# Use Resolve-Path without -Relative to ensure they are absolute paths, even if spaces exist.
$AppDir    = (Join-Path -Path $ScriptDir -ChildPath ".." | Resolve-Path).Path
$BackupDir = (Join-Path -Path $ScriptDir -ChildPath "..\..\update_backup" | Resolve-Path).Path

Write-Host "Starting post-update restore..."

# Check if the backup directory exists.
if (-not (Test-Path -LiteralPath $BackupDir)) {
    Write-Host "Backup directory does not exist: $BackupDir"
    Write-Host "Cannot restore files."
    exit 1
}

# Define the list of files to restore.
# (Add additional relative paths to this array if needed.)
$FilesToRestore = @("backend\app\assets\database\scanner.db")

foreach ($relativeFile in $FilesToRestore) {
    # Compute the destination file path by combining the app directory with the relative file path.
    $destFile = Join-Path -Path $AppDir -ChildPath $relativeFile

    # Extract the base filename (scanner.db, etc.).
    $fileName   = [System.IO.Path]::GetFileName($relativeFile)

    # Compute the source path in the backup folder (just the filename itself goes in $BackupDir).
    $sourceFile = Join-Path -Path $BackupDir -ChildPath $fileName

    # Ensure the destination directory exists.
    $destDir = Split-Path -Path $destFile
    if (-not (Test-Path -LiteralPath $destDir)) {
        Write-Host "Creating directory $destDir"
        try {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        catch {
            Write-Host "Failed to create directory: $destDir"
            exit 1
        }
    }

    if (Test-Path -LiteralPath $sourceFile) {
        Write-Host "Restoring $relativeFile..."
        try {
            # Copy the file from backup to destination, overwriting if necessary.
            Copy-Item -Path $sourceFile -Destination $destFile -Force -ErrorAction Stop

            # Delete the source file after successful copy.
            Remove-Item -LiteralPath $sourceFile -Force -ErrorAction Stop

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
