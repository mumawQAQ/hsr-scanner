@echo off
chcp 65001 >nul
setlocal

set "TOOLS_DIR=%~dp0"
set "REDIST_FILE=%TOOLS_DIR%\VC_redist.x64.exe"
set "PYTHON_DIR=%TOOLS_DIR%\python"
set "PYTHON_EXE=%PYTHON_DIR%\python.exe"
set "SCRIPT_DIR=%PYTHON_DIR%\Scripts"
set "REQUIREMENTS_FILE=%TOOLS_DIR%\requirements.txt"
set "PYPI_MIRROR=https://pypi.tuna.tsinghua.edu.cn/simple"


REM Check if Visual C++ Redistributable is installed (using a general check, adjust according to specific needs)
reg query "HKLM\SOFTWARE\Microsoft\VisualStudio\14.0\VC\Runtimes\x64" /f "Installed" | find "0x1"
if %errorlevel% == 0 (
    echo Visual C++ Redistributable is already installed.
) else (
    echo Visual C++ Redistributable is not installed.

    REM Check if the file exists
    if exist "%REDIST_FILE%" (
        echo Successfully found Visual C++ Redistributable.
        echo Installing Visual C++ Redistributable...

        REM Run the installer
        start /wait "" "%REDIST_FILE%" /install /quiet /norestart
        echo Installation complete.
    ) else (
        echo No Visual C++ Redistributable file found.
    )
)

REM Check if Python executable exists
if exist "%PYTHON_EXE%" (
    echo Python executable found at %PYTHON_EXE%
) else (
    echo Python executable not found at %PYTHON_EXE%
    endlocal
    exit /b 1
)

REM Set the PATH environment variable to include the Python directory
set "PATH=%PYTHON_DIR%;%SCRIPT_DIR%;%PATH%"

REM Upgrade pip
echo Upgrading pip...
"%PYTHON_EXE%" -m ensurepip

REM Check if the ensurepip command was successful
if %errorlevel% neq 0 (
    echo Failed to upgrade pip.
    endlocal
    exit /b 1
)

REM Check connectivity to the default PyPI CDN
echo Checking connectivity to the default PyPI CDN...
"%PYTHON_EXE%" -m pip install --no-deps pip==23.0.1
if %errorlevel% neq 0 (
    echo Could not connect to the default PyPI CDN. Falling back to mirror.
    set USE_MIRROR=1
) else (
    echo Connected to the default PyPI CDN successfully.
    set USE_MIRROR=0
)

REM Install required packages
if exist "%REQUIREMENTS_FILE%" (
    echo Installing required Python packages from %REQUIREMENTS_FILE%...
    if %USE_MIRROR%==1 (
        "%PYTHON_EXE%" -m pip install -r "%REQUIREMENTS_FILE%" -i "%PYPI_MIRROR%" --no-warn-script-location
    ) else (
        "%PYTHON_EXE%" -m pip install -r "%REQUIREMENTS_FILE%" --no-warn-script-location
    )

    REM Check if the pip install command was successful
    if %errorlevel% neq 0 (
        echo Failed to install required Python packages.
        endlocal
        exit /b 1
    )
) else (
    echo Requirements file not found at %REQUIREMENTS_FILE%
    endlocal
    exit /b 1
)

echo Python and required packages installed successfully.

endlocal
exit /b 0
