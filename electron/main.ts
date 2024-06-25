import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { app, BrowserWindow, desktopCapturer, ipcMain } from 'electron';

import { FloatingWindowMessage } from '../types.ts';

import store from './store.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..');

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

let win: BrowserWindow | null;
let floatingWin: BrowserWindow | null;

function createMainWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 1000,
    // autoHideMenuBar: true,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  });

  ipcMain.handle('capture-screen', async () => {
    const sources = await desktopCapturer.getSources({
      types: ['window'],
      thumbnailSize: { width: 1920, height: 1080 },
    });

    // Filter to find a specific window, e.g., by its name
    const specificWindow = sources.find(source => source.name.includes('Honkai: Star Rail'));

    if (specificWindow) {
      return specificWindow.thumbnail;
    } else {
      return null; // Handle case where no matching window is found
    }
  });

  ipcMain.handle('store-get', async (_, key) => {
    return store.get(key);
  });

  ipcMain.handle('store-set', async (_, key, value) => {
    return store.set(key, value);
  });

  ipcMain.handle('close-floating-window', async () => {
    floatingWin?.close();
    floatingWin = null;
  });

  ipcMain.handle('open-floating-window', async () => {
    if (floatingWin) {
      floatingWin.show();
    } else {
      createFloatingWindow();
    }
  });

  ipcMain.on('message-to-floating-window', (_, message: FloatingWindowMessage) => {
    if (floatingWin) {
      floatingWin.webContents.send('main-process-message', message);
    }
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  win.on('closed', () => {
    // make sure to close the floating window when the main window is closed
    floatingWin?.close();
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }
}

function createFloatingWindow() {
  floatingWin = new BrowserWindow({
    width: 450,
    height: 350,
    frame: false,
    transparent: true,
    alwaysOnTop: true,

    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  });

  floatingWin.setAlwaysOnTop(true, 'screen-saver', 1);

  if (VITE_DEV_SERVER_URL) {
    floatingWin.loadURL(`${VITE_DEV_SERVER_URL}/floating.html`);
  } else {
    floatingWin.loadFile(path.join(RENDERER_DIST, 'floating.html'));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

app.whenReady().then(createMainWindow);
