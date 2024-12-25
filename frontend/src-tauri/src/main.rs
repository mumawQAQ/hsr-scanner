#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::os::windows::process::CommandExt;
use std::process::{Child, Command, Stdio};
use std::sync::Mutex;
use tauri::{AppHandle, Manager, WindowEvent};

// Use a mutex to manage singleton behavior
static BACKEND_PROCESS_HANDLE: Mutex<Option<Child>> = Mutex::new(None);
static SCREEN_ANNOTATOR_PROCESS_HANDLE: Mutex<Option<Child>> = Mutex::new(None);
static REQUIREMENTS_INSTALLED: Mutex<bool> = Mutex::new(false);

fn resolve_path(app: AppHandle, path: &str) -> Result<String, String> {
    let resolved_path = app
        .path_resolver()
        .resolve_resource(path)
        .expect("failed to resolve path");

    let path_str = resolved_path
        .into_os_string()
        .into_string()
        .expect("failed to convert path to string");

    if path_str.starts_with("\\\\?\\") {
        Ok(path_str[4..].to_string())
    } else {
        Ok(path_str)
    }
}
#[tauri::command]
fn pre_backup(app: AppHandle) -> Result<String, String> {
    let bat_dir =
        resolve_path(app.clone(), "../../tools").expect("Failed to resolve batch file directory");
    let bat_path = resolve_path(app.clone(), "../../tools/pre_update.bat")
        .expect("Failed to resolve batch file path");

    let output = Command::new("cmd")
        .args(&["/C", &*bat_path])
        .current_dir(bat_dir)
        .creation_flags(0x08000000)
        .output()
        .map_err(|e| format!("Failed to execute pre_update.bat: {}", e))?;

    if output.status.success() {
        println!("Pre-backup executed successfully.");
        Ok("Pre-backup executed successfully.".to_string())
    } else {
        println!(
            "Pre-backup failed with status: {} and stderr: {}",
            output.status,
            String::from_utf8_lossy(&output.stderr)
        );
        Err(format!(
            "Pre-backup failed with status: {} and stderr: {}",
            output.status,
            String::from_utf8_lossy(&output.stderr)
        ))
    }
}

#[tauri::command]
fn post_backup(app: AppHandle) -> Result<String, String> {
    let bat_dir =
        resolve_path(app.clone(), "../../tools").expect("Failed to resolve batch file directory");
    let bat_path = resolve_path(app.clone(), "../../tools/post_update.bat")
        .expect("Failed to resolve batch file path");

    let output = Command::new("cmd")
        .args(&["/C", &*bat_path])
        .current_dir(bat_dir)
        .creation_flags(0x08000000)
        .output()
        .map_err(|e| format!("Failed to execute pre_update.bat: {}", e))?;

    if output.status.success() {
        println!("Post-backup executed successfully.");
        Ok("Post-backup executed successfully.".to_string())
    } else {
        println!(
            "Post-backup failed with status: {} and stderr: {}",
            output.status,
            String::from_utf8_lossy(&output.stderr)
        );
        Err(format!(
            "Post-backup failed with status: {} and stderr: {}",
            output.status,
            String::from_utf8_lossy(&output.stderr)
        ))
    }
}

// #[tauri::command]
// fn start_screen_annotator(app: AppHandle, display_only:bool,x:Vec<i32>, y: Vec<i32>, w: Vec<i32>, h: Vec<i32>) {
//
// }
#[tauri::command]
fn start_screen_annotator(app: AppHandle) {
    std::thread::spawn({
        let app = app.clone();
        move || {
            let mut handle = SCREEN_ANNOTATOR_PROCESS_HANDLE.lock().unwrap();

            if handle.is_none() {
                let python_path = resolve_path(app.clone(), "../../tools/python/python")
                    .expect("Failed to resolve python path");
                let main_script_path = resolve_path(app.clone(), "../../backend/screen_annotator.py")
                    .expect("Failed to resolve main script path");

                let mut child = Command::new(python_path)
                    .arg("-u")
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
                            //TODO: remove this, this is will only print to console in debug mode
                            println!("{}", line);
                            stdout_app
                                .emit_all("screen-annotator-log", line)
                                .expect("failed to send stdout");
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
                            println!("{}", line);
                            stderr_app
                                .emit_all("screen-annotator-error", line)
                                .expect("failed to send stderr");
                        }
                    }
                });

                *handle = Some(child);
                println!("Python process started.");

                std::thread::spawn(move || {
                    // Lock and take the child process out of the handle
                    let mut handle_monitor = SCREEN_ANNOTATOR_PROCESS_HANDLE.lock().unwrap();

                    if let Some(mut child_process) = handle_monitor.take() {
                        // Release the lock before waiting to prevent deadlocks
                        drop(handle_monitor);

                        // Wait for the subprocess to exit
                        match child_process.wait() {
                            Ok(status) => {
                                println!("Python process exited with status: {}", status);
                            }
                            Err(e) => {
                                println!("Failed to wait on Python process: {}", e);
                            }
                        }
                    }
                });
            } else {
                println!("Python process is already running.");
            }
        }
    });
}

#[tauri::command]
fn start_backend(app: AppHandle) {
    std::thread::spawn({
        let app = app.clone();
        move || {
            let mut handle = BACKEND_PROCESS_HANDLE.lock().unwrap();

            if handle.is_none() {
                let python_path = resolve_path(app.clone(), "../../tools/python/python")
                    .expect("Failed to resolve python path");
                let main_script_path = resolve_path(app.clone(), "../../backend/main.py")
                    .expect("Failed to resolve main script path");

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
                            //TODO: remove this, this is will only print to console in debug mode
                            println!("{}", line);
                            stdout_app
                                .emit_all("backend-log", line)
                                .expect("failed to send stdout");
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
                            println!("{}", line);
                            stderr_app
                                .emit_all("backend-error", line.clone())
                                .expect("failed to send stderr");

                            if let Some(captures) = match_port.captures(&line) {
                                let port = captures.get(1).unwrap().as_str();
                                stderr_app
                                    .emit_all("backend-port", port)
                                    .expect("failed to send stderr");
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
                app.emit_all(
                    "requirements-status-log",
                    "Installing Python requirements...",
                )
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

                app.emit_all(
                    "requirements-status-log",
                    "Python requirements installation started.",
                )
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
                            stdout_app
                                .emit_all("requirements-install-log", line)
                                .expect("failed to send stdout");
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
                            stderr_app
                                .emit_all("requirements-install-error", line)
                                .expect("failed to send stderr");
                        }
                    }
                });

                *installed = true;

                // Wait for the child process to finish in the background thread
                let status = child.wait().expect("Failed to wait on child");

                if status.success() {
                    app.emit_all("requirements-status-success", "success")
                        .expect("Failed to send success notification");
                } else {
                    app.emit_all("requirements-status-failure", "failure")
                        .expect("Failed to send failure notification");
                }
            } else {
                app.emit_all("requirements-status-success", "redundant")
                    .expect("Failed to send already installed notification");
            }
        }
    });
}

#[tauri::command]
fn check_asserts_update(app: AppHandle, download: bool) -> Result<String, String> {
    let python_path = resolve_path(app.clone(), "../../tools/python/python")
        .expect("Failed to resolve python path");
    let main_script_path = resolve_path(app.clone(), "../../backend/check_assert_update.py")
        .expect("Failed to resolve script path");

    let mut cmd = Command::new(python_path);
    cmd.arg(&main_script_path);

    if download {
        cmd.arg("--download");
    }
    cmd.creation_flags(0x08000000); // This prevents the creation of a console window on Windows.

    // Execute the command and capture the output
    let output = cmd
        .output()
        .map_err(|e| format!("Failed to execute Python script: {}", e))?;

    if output.status.success() {
        let stdout = String::from_utf8_lossy(&output.stdout).to_string();
        println!("{}", stdout);
        Ok(stdout)
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr).to_string();
        println!("{}", stderr);
        Err(format!("Python script error: {}", stderr))
    }
}

#[tauri::command]
fn kill_background_process() -> Result<(), String> {
    let mut handle = SCREEN_ANNOTATOR_PROCESS_HANDLE.lock().unwrap();
    if let Some(child) = handle.as_mut() {
        child.kill().expect("Failed to kill the screen annotator process");
        child.wait().expect("Failed to wait on the screen annotator process");
        *handle = None;
        println!("Screen annotator process killed.");
    } else {
        println!("Screen annotator process is not running.");
    }

    let mut handle = BACKEND_PROCESS_HANDLE.lock().unwrap();
    if let Some(child) = handle.as_mut() {
        child.kill().expect("Failed to kill the backend process");
        child.wait().expect("Failed to wait on the backend process");
        *handle = None;
        println!("Python process killed.");
    } else {
        println!("Python process is not running.");
    }
    Ok(())
}

#[tauri::command]
fn set_always_on_top(window: tauri::Window, status: bool) -> Result<(), String> {
    window.set_always_on_top(status).map_err(|e| e.to_string())
}


#[tauri::command]
fn set_window_size(window: tauri::Window, status: bool) -> Result<(), String> {
    let size = if status {
        tauri::LogicalSize::new(450, 350)
    } else {
        tauri::LogicalSize::new(800, 600)
    };

    window.set_size(size).map_err(|e| e.to_string())?;
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            window.on_window_event(|event| match event {
                WindowEvent::CloseRequested { .. } => {
                    println!("Application is closing...");
                    kill_background_process().expect("Failed to kill the backend process");
                }
                _ => {}
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            install_python_requirements,
            start_backend,
            set_always_on_top,
            set_window_size,
            pre_backup,
            post_backup,
            kill_background_process,
            check_asserts_update,
            start_screen_annotator
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
