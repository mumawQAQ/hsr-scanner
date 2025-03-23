# Set the console output encoding to UTF-8 (optional, for Unicode support)
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$ToolsDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RedistFile = Join-Path $ToolsDir "VC_redist.x64.exe"
$PythonDir = Join-Path $ToolsDir "python"
$PythonExe = Join-Path $PythonDir "python.exe"
$ScriptDir = Join-Path $PythonDir "Scripts"
$RequirementsFile = Join-Path $ToolsDir "requirements.txt"
$FrontendProgressLogIdicator = "Frontend-Progress Log:"

$PyPiMirrors = @(
    "https://mirror.sjtu.edu.cn/pypi/web/simple",
    "https://pypi.org/simple",
    "https://pypi.tuna.tsinghua.edu.cn/simple",
    "https://mirrors.aliyun.com/pypi/simple"
)

# Hashtable to store response times
$mirrorResponseTimes = @{}

Write-Host "$FrontendProgressLogIdicator Checking PyPI mirrors latency to select the best one..."
# Loop through each mirror and measure response time using a HEAD request.
foreach ($mirror in $PyPiMirrors) {
    try {
        $sw = [System.Diagnostics.Stopwatch]::StartNew()
        Invoke-WebRequest -Uri $mirror -Method Head -TimeoutSec 5 | Out-Null
        $sw.Stop()
        $mirrorResponseTimes[$mirror] = $sw.ElapsedMilliseconds
        Write-Host "Mirror $mirror responded in $($sw.ElapsedMilliseconds) ms"
    }
    catch {
        Write-Host "Mirror $mirror failed to respond, assigning high latency."
        $mirrorResponseTimes[$mirror] = 9999
    }
}

# Reorder the mirrors by ascending response time.
$sortedMirrors = $mirrorResponseTimes.GetEnumerator() | Sort-Object Value | ForEach-Object { $_.Key }

Write-Host "Toolkit directory: $ToolsDir"

# Check and install VC++ redistributable
$vcInstalled = $false
try {
    $vs = Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\VisualStudio\14.0\VC\Runtimes\x64" -ErrorAction Stop
    if ($vs.Installed -eq 1 -or $vs.Installed -eq "0x1") {
        $vcInstalled = $true
    }
}
catch {
    $vcInstalled = $false
}

if (-not $vcInstalled) {
    if (Test-Path $RedistFile) {
        Write-Host "$FrontendProgressLogIdicator Installing VC++ redistributable..."
        $process = Start-Process -FilePath $RedistFile `
                                 -ArgumentList '/install','/quiet','/norestart' `
                                 -Wait -PassThru
        if ($process.ExitCode -eq 0) {
            Write-Host "$FrontendProgressLogIdicator VC++ redistributable installed successfully"
        }
        else {
            Write-Error "$FrontendProgressLogIdicator Failed to install VC++ redistributable, error code: $($process.ExitCode)"
            exit 1
        }
    }
    else {
        Write-Error "$FrontendProgressLogIdicator VC++ redistributable file does not exist at: $RedistFile"
        exit 1
    }
}
else {
    Write-Host "$FrontendProgressLogIdicator VC++ redistributable is already installed"
}

# Check if Python exists
if (-not (Test-Path $PythonExe)) {
    Write-Error "Python executable does not exist at $PythonExe. Please check your installation."
    exit 1
}

# Check if requirements.txt exists
if (-not (Test-Path $RequirementsFile)) {
    Write-Error "requirements.txt file does not exist at $RequirementsFile. Please check your setup."
    exit 1
}

# Update the environment PATH to include Python and its Scripts directory
$env:Path = "$PythonDir;$ScriptDir;" + $env:Path

# Update pip
Write-Host "$FrontendProgressLogIdicator Updating pip..."
Start-Process -FilePath $PythonExe `
              -ArgumentList '-m','pip','install','--upgrade','pip' `
              -NoNewWindow `
              -Wait

# Install Python dependencies
$installSuccess = $false
foreach ($mirror in $sortedMirrors) {
    Write-Host "$FrontendProgressLogIdicator Installing all Python dependencies using mirror: $mirror"
    $arguments = @('-m','pip','install','--upgrade','-r',$RequirementsFile,'-i',$mirror,'--no-warn-script-location')
    $process = Start-Process -FilePath $PythonExe `
                             -ArgumentList $arguments `
                             -NoNewWindow `
                             -Wait `
                             -PassThru
    if ($process.ExitCode -eq 0) {
        $installSuccess = $true
        break
    }
    else {
        Write-Host "$FrontendProgressLogIdicator Installation failed using mirror: $mirror. Trying the next mirror..."
    }
}

if (-not $installSuccess) {
    Write-Error "$FrontendProgressLogIdicator Failed to install Python dependencies using all specified mirrors."
    exit 1
}

Write-Host "$FrontendProgressLogIdicator Python dependencies installation completed successfully."
