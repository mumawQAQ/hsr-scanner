# pre_update.ps1
# This script backs up excluded files before the update.

# Get the directory where this script is located.
$ScriptDir = $PSScriptRoot

# Define directories:
# - The application directory is the parent of the script directory.
# - The backup directory is two levels up from the script directory, then "update_backup".
try {
    $AppDir = (Resolve-Path (Join-Path $ScriptDir "..")).Path
} catch {
    Write-Host "Failed to resolve the application directory."
    exit 1
}

try {
    $BackupParent = (Resolve-Path (Join-Path $ScriptDir "..\..")).Path
} catch {
    Write-Host "Failed to resolve the backup parent directory."
    exit 1
}
$BackupDir = Join-Path $BackupParent "update_backup"

Write-Host "Starting pre-update backup..."

# Create the backup directory if it doesn't exist.
if (-not (Test-Path $BackupDir)) {
    Write-Host "Creating backup directory: $BackupDir"
    try {
        New-Item -ItemType Directory -Path $BackupDir -Force -ErrorAction Stop | Out-Null
    } catch {
        Write-Host "Failed to create backup directory: $BackupDir"
        exit 1
    }
}

# List of files to backup (relative to the application directory).
$FilesToBackup = @("backend\app\assets\database\scanner.db")

foreach ($relativeFile in $FilesToBackup) {
    # Construct the full source file path.
    $SourceFile = Join-Path $AppDir $relativeFile

    # Construct the destination file path.
    # (Only the file name is used in the backup folder.)
    $DestFile = Join-Path $BackupDir (Split-Path $relativeFile -Leaf)
    
    if (Test-Path $SourceFile) {
        Write-Host "Backing up $relativeFile..."
        try {
            Copy-Item -Path $SourceFile -Destination $DestFile -Force -ErrorAction Stop
            Write-Host "Successfully backed up $relativeFile"
        } catch {
            Write-Host "Failed to backup $relativeFile"
            exit 1
        }
    } else {
        Write-Host "File not found: $relativeFile, skipping."
    }
}

Write-Host "Pre-update backup completed successfully."
exit 0
