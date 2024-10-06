@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

set "TOOLS_DIR=%~dp0"
set "REDIST_FILE=%TOOLS_DIR%VC_redist.x64.exe"
set "PYTHON_DIR=%TOOLS_DIR%python"
set "PYTHON_EXE=%PYTHON_DIR%\python.exe"
set "SCRIPT_DIR=%PYTHON_DIR%\Scripts"
set "REQUIREMENTS_FILE=%TOOLS_DIR%requirements.txt"
set "PYPI_MIRRORS=https://pypi.org/simple https://mirror.sjtu.edu.cn/pypi/web/simple https://pypi.tuna.tsinghua.edu.cn/simple https://mirrors.aliyun.com/pypi/simple"

echo Toolkit directory: %TOOLS_DIR%

REM Check and install Visual C++ Redistributable
reg query "HKLM\SOFTWARE\Microsoft\VisualStudio\14.0\VC\Runtimes\x64" /v Installed 2>nul | find "0x1" >nul
if !errorlevel! neq 0 (
    if exist "!REDIST_FILE!" (
        echo Installing Visual C++ Redistributable...
        start /wait "" "!REDIST_FILE!" /install /quiet /norestart
        if !errorlevel! equ 0 (echo Installation complete.) else (echo Installation failed.)
    ) else (
        echo Visual C++ Redistributable file not found.
    )
) else (
    echo Visual C++ Redistributable is already installed.
)

REM Check Python executable
if not exist "!PYTHON_EXE!" (
    echo Python executable not found at !PYTHON_EXE!
    exit /b 1
)

REM Check requirements file
if not exist "!REQUIREMENTS_FILE!" (
    echo Requirements file not found at !REQUIREMENTS_FILE!
    exit /b 1
)

REM Set PATH
set "PATH=%PYTHON_DIR%;%SCRIPT_DIR%;%PATH%"

REM Install required packages
echo Installing required packages...
for %%m in (%PYPI_MIRRORS%) do (
    echo Trying mirror: %%m
    "!PYTHON_EXE!" -m pip install -r "!REQUIREMENTS_FILE!" -i %%m --no-warn-script-location --no-cache-dir
    if !errorlevel! equ 0 (
        echo Packages installed successfully using %%m
        goto :success
    ) else (
        echo Failed to install packages using %%m, trying next mirror...
    )
)

echo Failed to install required Python packages from all mirrors.
exit /b 1

:success
echo Python environment setup completed successfully.
exit /b 0