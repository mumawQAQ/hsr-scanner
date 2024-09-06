#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

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
    let mut handle = BACKEND_PROCESS_HANDLE.lock().unwrap();

    if handle.is_none() {
        let python_path = resolve_path(app.clone(), "../../tools/python/python")
            .expect("failed to resolve python path");
        let main_script_path = resolve_path(app.clone(), "../../backend/main.py")
            .expect("failed to resolve main script path");

        println!("Starting backend process...");
        // Start the Python process if not already running
        let mut child = Command::new(python_path)
            .arg(main_script_path)
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
            .expect("failed to start python process");

        println!("Python process started.");

        // Clone stdout and stderr to capture output
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
    } else {
        println!("Python process is already running.");
    }
}

#[tauri::command]
fn install_python_requirements(app: AppHandle) {
    let mut installed = REQUIREMENTS_INSTALLED.lock().unwrap();

    if !*installed {
        app.emit_all("requirements-status-log", "Installing Python requirements...").expect("failed to send stdout");

        let bat_dir = resolve_path(app.clone(), "../../tools")
            .expect("failed to resolve bat dir");
        let bat_path = resolve_path(app.clone(), "../../tools/install.bat")
            .expect("failed to resolve bat path");

        let mut child = Command::new("cmd")
            .args(&["/C", &*bat_path])
            .current_dir(bat_dir)
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
            .expect("failed to start install script");

        app.emit_all("requirements-status-log", "Python requirements installation started.").expect("failed to send stdout");

        // Clone stdout and stderr to capture output
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

        let stderr_reader = std::io::BufReader::new(stderr);
        // copy app handle to move into closure
        let stderr_app = app.clone();
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

        // Wait for the child process to finish
        let status = child.wait().expect("failed to wait on child");

        if status.success() {
            app.emit_all("requirements-status-log", "Python requirements installed successfully.").expect("failed to send stdout");
        } else {
            app.emit_all("requirements-status-log", "Python requirements installation failed.").expect("failed to send stdout");
        }
    } else {
        app.emit_all("requirements-status-log", "Python requirements are already installed.").expect("failed to send stdout");
    }
}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start_backend])
        .invoke_handler(tauri::generate_handler![install_python_requirements])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


