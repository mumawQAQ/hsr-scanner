@echo off
chcp 65001 >nul
setlocal

set "TOOLS_DIR=%~dp0"
set "REDIST_FILE=%TOOLS_DIR%\VC_redist.x64.exe"
set "PYTHON_DIR=%TOOLS_DIR%\python"
set "PYTHON_EXE=%PYTHON_DIR%\python.exe"
set "SCRIPT_DIR=%PYTHON_DIR%\Scripts"
set "REQUIREMENTS_FILE=%TOOLS_DIR%\requirements.txt"
set "PYPI_TSINGHUA_MIRROR=https://pypi.tuna.tsinghua.edu.cn/simple"
set "PYPI_SJTU_MIRROR=https://mirror.sjtu.edu.cn/pypi/web/simple"

echo toolkit dir is %TOOLS_DIR%

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

REM Check if the requirements file exists
if not exist "%REQUIREMENTS_FILE%" (
    echo Requirements file not found at %REQUIREMENTS_FILE%
    endlocal
    exit /b 1
)


REM Set the PATH environment variable to include the Python directory
set "PATH=%PYTHON_DIR%;%SCRIPT_DIR%;%PATH%"



REM Install required packages
echo Using PyPI mirror for installation.
"%PYTHON_EXE%" -m pip install -r "%REQUIREMENTS_FILE%" -i "%PYPI_TSINGHUA_MIRROR%" --no-warn-script-location --no-cache-dir

REM Check if the pip install command was successful
if %errorlevel% neq 0 (
    echo Failed to install required Python packages from tsinghua mirror
    echo Trying sjtu mirror...
    "%PYTHON_EXE%" -m pip install -r "%REQUIREMENTS_FILE%" -i "%PYPI_SJTU_MIRROR%" --no-warn-script-location --no-cache-dir
    if %errorlevel% neq 0 (
        echo Failed to install required Python packages from sjtu mirror.
        endlocal
        exit /b 1
    )
)

echo Python and required packages installed successfully.

endlocal
exit /b 0
