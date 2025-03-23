# This script backs up excluded files before the update, handling spaces in the path safely.

# Get the directory where this script is located.
$ScriptDir = $PSScriptRoot

Write-Host "Starting pre-update backup..."

# Define directories using Resolve-Path for absolute paths.
try {
    $AppDir = (Join-Path -Path $ScriptDir -ChildPath ".." | Resolve-Path).Path
} catch {
    Write-Host "Failed to resolve the application directory."
    exit 1
}

try {
    $BackupParent = (Join-Path -Path $ScriptDir -ChildPath "..\.." | Resolve-Path).Path
} catch {
    Write-Host "Failed to resolve the backup parent directory."
    exit 1
}
$BackupDir = Join-Path -Path $BackupParent -ChildPath "update_backup"

# Create the backup directory if it doesn't exist.
if (-not (Test-Path -LiteralPath $BackupDir)) {
    Write-Host "Creating backup directory: $BackupDir"
    try {
        New-Item -ItemType Directory -Path $BackupDir -Force -ErrorAction Stop | Out-Null
    }
    catch {
        Write-Host "Failed to create backup directory: $BackupDir"
        exit 1
    }
}

# List of files to backup (relative to the application directory).
$FilesToBackup = @(
    "backend\app\assets\database\scanner.db"
)

foreach ($relativeFile in $FilesToBackup) {
    # Construct the full source file path.
    $SourceFile = Join-Path -Path $AppDir -ChildPath $relativeFile

    # Construct the destination file path (only the file name is used in the backup folder).
    $FileName  = Split-Path -Path $relativeFile -Leaf
    $DestFile  = Join-Path -Path $BackupDir -ChildPath $FileName

    if (Test-Path -LiteralPath $SourceFile) {
        Write-Host "Backing up $relativeFile..."
        try {
            Copy-Item -Path $SourceFile -Destination $DestFile -Force -ErrorAction Stop
            Write-Host "Successfully backed up $relativeFile"
        }
        catch {
            Write-Host "Failed to backup $relativeFile"
            exit 1
        }
    }
    else {
        Write-Host "File not found: $relativeFile, skipping."
    }
}

Write-Host "Pre-update backup completed successfully."
exit 0
