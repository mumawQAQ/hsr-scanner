use std::os::windows::process::CommandExt;
use std::process::{Child, Command, Stdio};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use tauri::path::BaseDirectory;
use tauri::{AppHandle, Emitter, Manager, PhysicalPosition, WindowEvent};

static BACKEND_PROCESS_HANDLE: Mutex<Option<Child>> = Mutex::new(None);
static REQUIREMENTS_INSTALLED: Mutex<bool> = Mutex::new(false);
static SCREEN_ANNOTATOR_PROCESS_HANDLE: Mutex<Option<Child>> = Mutex::new(None);

fn resolve_path(app: AppHandle, path: &str) -> Result<String, String> {
    let resolved_path = app
        .path()
        .resolve(path, BaseDirectory::Resource)
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
fn check_asserts_update(app: AppHandle, download: bool) -> Result<String, String> {
    let python_path = resolve_path(app.clone(), "../tools/python/python")
        .expect("Failed to resolve python path");
    let main_script_path = resolve_path(app.clone(), "../backend/check_assert_update.py")
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
fn start_screen_annotator(app: AppHandle, display_only: bool, x: Vec<i32>, y: Vec<i32>, w: Vec<i32>, h: Vec<i32>) {
    std::thread::spawn({
        let app = app.clone();
        move || {
            let mut handle = SCREEN_ANNOTATOR_PROCESS_HANDLE.lock().unwrap();

            if handle.is_none() {
                let python_path = resolve_path(app.clone(), "../tools/python/python")
                    .expect("Failed to resolve python path");
                let main_script_path = resolve_path(app.clone(), "../backend/screen_annotator.py")
                    .expect("Failed to resolve main script path");

                let mut cmd = Command::new(python_path);
                cmd.arg("-u")
                    .arg(main_script_path);
                if display_only {
                    cmd.arg("--display_only");
                }
                for i in 0..x.len() {
                    cmd.arg("--x").arg(x[i].to_string());
                    cmd.arg("--y").arg(y[i].to_string());
                    cmd.arg("--w").arg(w[i].to_string());
                    cmd.arg("--h").arg(h[i].to_string());
                }

                cmd.creation_flags(0x08000000); // This prevents the creation of a console window on Windows.

                let mut child = cmd
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
                                .emit("screen-annotator-log", line)
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
                                .emit("screen-annotator-error", line)
                                .expect("failed to send stderr");
                        }
                    }
                });

                // Put child into the global handle
                *handle = Some(child);
                println!("Python process started.");

                // Drop the lock so other commands can access the handle if needed
                drop(handle);

                // Spawn a thread to wait on the child’s exit
                let exit_app = app.clone();
                std::thread::spawn(move || {
                    // Take the child out of the handle so we can wait on it
                    let mut handle_monitor = SCREEN_ANNOTATOR_PROCESS_HANDLE.lock().unwrap();
                    let child_process = handle_monitor.take();
                    drop(handle_monitor);

                    if let Some(mut child_process) = child_process {
                        match child_process.wait() {
                            Ok(status) => {
                                println!("Python process exited with status: {}", status);
                            }
                            Err(e) => {
                                eprintln!("Failed to wait on Python process: {}", e);
                            }
                        }
                        // Only after the process truly exits do we emit the "exit" event
                        exit_app.emit("screen-annotator-exit", ()).ok();
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
                let python_path = resolve_path(app.clone(), "../tools/python/python")
                    .expect("Failed to resolve python path");
                let main_script_path = resolve_path(app.clone(), "../backend/main.py")
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
                                .emit("backend-log", line)
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
                                .emit("backend-error", line.clone())
                                .expect("failed to send stderr");

                            if let Some(captures) = match_port.captures(&line) {
                                let port = captures.get(1).unwrap().as_str();
                                stderr_app
                                    .emit("backend-port", port)
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
fn post_backup(app: AppHandle) -> Result<String, String> {
    let bat_dir =
        resolve_path(app.clone(), "../tools").expect("Failed to resolve batch file directory");
    let bat_path = resolve_path(app.clone(), "../tools/post_update.bat")
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

#[tauri::command]
fn pre_backup(app: AppHandle) -> Result<String, String> {
    let bat_dir =
        resolve_path(app.clone(), "../tools").expect("Failed to resolve batch file directory");
    let bat_path = resolve_path(app.clone(), "../tools/pre_update.bat")
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
fn install_python_requirements(app: AppHandle) {
    std::thread::spawn({
        let app = app.clone();
        move || {
            let mut installed = REQUIREMENTS_INSTALLED.lock().unwrap();

            if !*installed {
                app.emit(
                    "requirements-status-log",
                    "Installing Python requirements...",
                )
                    .expect("Failed to send install start notification");

                let bat_dir = resolve_path(app.clone(), "../tools")
                    .expect("Failed to resolve batch file directory");
                let bat_path = resolve_path(app.clone(), "../tools/install.bat")
                    .expect("Failed to resolve batch file path");

                let mut child = Command::new("cmd")
                    .args(&["/C", &*bat_path])
                    .current_dir(bat_dir)
                    .creation_flags(0x08000000) // This prevents the creation of a console window on Windows.
                    .stdout(Stdio::piped())
                    .stderr(Stdio::piped())
                    .spawn()
                    .expect("Failed to start install script");

                app.emit(
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
                                .emit("requirements-install-log", line)
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
                                .emit("requirements-install-error", line)
                                .expect("failed to send stderr");
                        }
                    }
                });

                *installed = true;

                // Wait for the child process to finish in the background thread
                let status = child.wait().expect("Failed to wait on child");

                if status.success() {
                    app.emit("requirements-status-success", "success")
                        .expect("Failed to send success notification");
                } else {
                    app.emit("requirements-status-failure", "failure")
                        .expect("Failed to send failure notification");
                }
            } else {
                app.emit("requirements-status-success", "redundant")
                    .expect("Failed to send already installed notification");
            }
        }
    });
}

#[tauri::command]
fn set_window_on_top(app: AppHandle, on_top: bool) {
    let window = app.get_window("main").unwrap();
    window.set_always_on_top(on_top).expect("Failed to set window on top");
}

#[tauri::command]
fn set_window_size(app: AppHandle, width: u32, height: u32) {
    let window = app.get_window("main").unwrap();
    let size = tauri::LogicalSize::new(width as f64, height as f64);
    window.set_size(size).expect("Failed to set window size");
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(desktop)]
            let _ = app.handle().plugin(tauri_plugin_updater::Builder::new().build());
            let allow_logs_close = Arc::new(AtomicBool::new(false));
            let main = app.get_window("main").unwrap();
            let logs = app.get_window("logs").unwrap();

            logs.set_ignore_cursor_events(true).unwrap();
            
            if let Some(monitor) = logs.current_monitor().unwrap(){
                let monitor_size = monitor.size();
                let window_size = logs.outer_size().unwrap();

                let pos = PhysicalPosition::new(0, monitor_size.height as i32 - window_size.height as i32);
                logs.set_position(pos).unwrap();
            }

            let allow_logs_close_for_logs = allow_logs_close.clone();
            logs.on_window_event(move |event| match event {
                WindowEvent::CloseRequested { api, .. } => {
                    if !allow_logs_close_for_logs.load(Ordering::Relaxed) {
                        api.prevent_close();
                    }
                }
                _ => {}
            });

            let allow_logs_close_for_main = allow_logs_close.clone();
            let logs_for_main = logs.clone();
            main.on_window_event(move |event| match event {
                WindowEvent::CloseRequested { .. } => {
                    println!("Application is closing...");
                    kill_background_process().expect("Failed to kill the backend process");
                    allow_logs_close_for_main.store(true, Ordering::Relaxed);
                    logs_for_main.close().unwrap();
                }
                _ => {}
            });

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![check_asserts_update, start_screen_annotator,post_backup,pre_backup, start_backend, install_python_requirements,set_window_on_top,set_window_size])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
