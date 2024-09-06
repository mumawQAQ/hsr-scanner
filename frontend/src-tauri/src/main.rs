#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::os::windows::process::CommandExt;
use std::process::{Child, Command, Stdio};
use std::sync::Mutex;
use tauri::{AppHandle, Manager};

// Use a mutex to manage singleton behavior
static BACKEND_PROCESS_HANDLE: Mutex<Option<Child>> = Mutex::new(None);
static REQUIREMENTS_INSTALLED: Mutex<bool> = Mutex::new(false);

fn resolve_path(app: AppHandle, path: &str) -> Result<String, String> {
    let resolved_path = app.path_resolver()
        .resolve_resource(path)
        .expect("failed to resolve path");

    let path_str = resolved_path.into_os_string().into_string()
        .expect("failed to convert path to string");

    if path_str.starts_with("\\\\?\\") {
        Ok(path_str[4..].to_string())
    } else {
        Ok(path_str)
    }
}

#[tauri::command]
fn start_backend(app: AppHandle) {
    std::thread::spawn({
        let app = app.clone();
        move || {
            let mut handle = BACKEND_PROCESS_HANDLE.lock().unwrap();

            if handle.is_none() {
                let python_path = resolve_path(app.clone(), "../../tools/python/python").expect("Failed to resolve python path");
                let main_script_path = resolve_path(app.clone(), "../../backend/main.py").expect("Failed to resolve main script path");

                let mut child = Command::new(python_path)
                    .arg(main_script_path)
                    .creation_flags(0x08000000) // This prevents the creation of a console window on Windows.
                    .stdout(Stdio::piped())
                    .stderr(Stdio::piped())
                    .spawn()
                    .expect("Failed to start python process");

                let stdout = child.stdout.take().unwrap();
                let stderr = child.stderr.take().unwrap();

                // Handle stdout
                let stdout_reader = std::io::BufReader::new(stdout);
                // copy app handle to move into closure
                let stdout_app = app.clone();
                std::thread::spawn(move || {
                    use std::io::{BufRead, BufReader};
                    let reader = BufReader::new(stdout_reader);
                    for line in reader.lines() {
                        if let Ok(line) = line {
                            stdout_app.emit_all("backend-log", line).expect("failed to send stdout");
                        }
                    }
                });

                let stderr_reader = std::io::BufReader::new(stderr);
                // copy app handle to move into closure
                let stderr_app = app.clone();
                let match_port = regex::Regex::new(r"Uvicorn running on http://\S+:(\d+)").unwrap();
                std::thread::spawn(move || {
                    use std::io::{BufRead, BufReader};
                    let reader = BufReader::new(stderr_reader);
                    for line in reader.lines() {
                        if let Ok(line) = line {
                            if let Some(captures) = match_port.captures(&line) {
                                let port = captures.get(1).unwrap().as_str();
                                stderr_app.emit_all("backend-port", port).expect("failed to send stderr");
                            }
                        }
                    }
                });

                *handle = Some(child);
                println!("Python process started.");
            } else {
                println!("Python process is already running.");
            }
        }
    });
}


#[tauri::command]
fn install_python_requirements(app: AppHandle) {
    std::thread::spawn({
        let app = app.clone();
        move || {
            let mut installed = REQUIREMENTS_INSTALLED.lock().unwrap();

            if !*installed {
                app.emit_all("requirements-status-log", "Installing Python requirements...")
                    .expect("Failed to send install start notification");

                let bat_dir = resolve_path(app.clone(), "../../tools")
                    .expect("Failed to resolve batch file directory");
                let bat_path = resolve_path(app.clone(), "../../tools/install.bat")
                    .expect("Failed to resolve batch file path");

                let mut child = Command::new("cmd")
                    .args(&["/C", &*bat_path])
                    .current_dir(bat_dir)
                    .creation_flags(0x08000000) // This prevents the creation of a console window on Windows.
                    .stdout(Stdio::piped())
                    .stderr(Stdio::piped())
                    .spawn()
                    .expect("Failed to start install script");

                app.emit_all("requirements-status-log", "Python requirements installation started.")
                    .expect("Failed to send installation started notification");

                let stdout = child.stdout.take().unwrap();
                let stderr = child.stderr.take().unwrap();

                // Handle stdout
                let stdout_reader = std::io::BufReader::new(stdout);
                // copy app handle to move into closure
                let stdout_app = app.clone();
                std::thread::spawn(move || {
                    use std::io::{BufRead, BufReader};
                    let reader = BufReader::new(stdout_reader);
                    for line in reader.lines() {
                        if let Ok(line) = line {
                            stdout_app.emit_all("requirements-install-log", line).expect("failed to send stdout");
                        }
                    }
                });

                // copy app handle to move into closure
                let stderr_app = app.clone();
                let stderr_reader = std::io::BufReader::new(stderr);
                std::thread::spawn(move || {
                    use std::io::{BufRead, BufReader};
                    let reader = BufReader::new(stderr_reader);
                    for line in reader.lines() {
                        if let Ok(line) = line {
                            stderr_app.emit_all("requirements-install-error", line).expect("failed to send stderr");
                        }
                    }
                });

                *installed = true;

                // Wait for the child process to finish in the background thread
                let status = child.wait().expect("Failed to wait on child");

                if status.success() {
                    app.emit_all("requirements-status-success", "Python requirements installed successfully.")
                        .expect("Failed to send success notification");
                } else {
                    app.emit_all("requirements-status-failure", "Python requirements installation failed.")
                        .expect("Failed to send failure notification");
                }
            } else {
                app.emit_all("requirements-status-log", "Python requirements are already installed.")
                    .expect("Failed to send already installed notification");
            }
        }
    });
}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start_backend])
        .invoke_handler(tauri::generate_handler![install_python_requirements])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


