import { unlink, writeFile } from 'fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'util';

import { app, BrowserWindow, desktopCapturer, dialog, ipcMain } from 'electron';

import store from './store.ts';

import { RatingTemplate, RatingTemplateStore } from '@/type/types.ts';

const writeFileAsync = promisify(writeFile);
const unlinkAsync = promisify(unlink);

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

function createMainWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 1000,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  });

  win.setAlwaysOnTop(true, 'screen-saver', 1);

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

  ipcMain.handle('store-delete-rating-template', async (_, templateId) => {
    try {
      const templates = store.get('ratingTemplates', {});
      if (!templates[templateId]) {
        return { success: false, message: '没有找到遗器模板' };
      }

      delete templates[templateId];
      store.set('ratingTemplates', templates);
      return { success: true, message: '遗器模板删除成功' };
    } catch (error) {
      console.error('Error deleting template:', error);
      return { success: false, message: error instanceof Error ? error.message : '删除模板时，储存未知错误' };
    }
  });

  ipcMain.handle('store-update-add-rating-template', async (_, templateId, template) => {
    try {
      store.set(`ratingTemplates.${templateId}`, template);
      return { success: true, message: '遗器模板添加成功' };
    } catch (error) {
      console.error('Error updating template:', error);
      return { success: false, message: error instanceof Error ? error.message : '添加模板时，储存未知错误' };
    }
  });

  ipcMain.handle('store-delete-rating-rule', async (_, templateId, ruleId) => {
    try {
      const templates = store.get('ratingTemplates', {} as RatingTemplateStore);
      if (!templates[templateId]) {
        return { success: false, message: '没有找到遗器模板' };
      }

      const currentTemplate = templates[templateId] as RatingTemplate;

      if (!currentTemplate.rules[ruleId]) {
        return { success: false, message: '没有找到规则' };
      }

      delete templates[templateId].rules[ruleId];
      store.set('ratingTemplates', templates);
      return { success: true, message: '规则删除成功' };
    } catch (error) {
      console.error('Error deleting rule:', error);
      return { success: false, message: error instanceof Error ? error.message : '删除规则时，储存未知错误' };
    }
  });

  ipcMain.handle('store-update-add-rating-rule', async (_, templateId, ruleId, rule) => {
    try {
      // need to make sure the template exists
      const templates = store.get(`ratingTemplates.${templateId}`);
      if (!templates) {
        return { success: false, message: '没有找到遗器模板' };
      }

      store.set(`ratingTemplates.${templateId}.rules.${ruleId}`, rule);
      return { success: true, message: '规则添加成功' };
    } catch (error) {
      console.error('Error updating rule:', error);
      return { success: false, message: error instanceof Error ? error.message : '添加规则时，储存未知错误' };
    }
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
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

// Change the window size when the user click a button in Scan Panel.
ipcMain.on('change-window-mode', (_, isLightMode) => {
  if (isLightMode) {
    win?.setSize(600, 400); // 轻量模式尺寸
  } else {
    win?.setSize(1200, 1000); // 全尺寸模式
  }
});

ipcMain.on('export-relic-rules-template', async (_, data: RatingTemplate) => {
  try {
    // Serialize data to JSON
    const jsonContent = JSON.stringify(data);

    // Temporary file path
    const tempPath = app.getPath('temp') + '/data.json';

    // Write to a temporary file
    await writeFileAsync(tempPath, jsonContent, 'utf-8');

    win?.minimize(); // Minimize the window

    // Show save dialog to the user
    const { filePath } = await dialog.showSaveDialog({
      title: '保存遗器规则模板',
      defaultPath: 'relic_config.json',
      buttonLabel: 'Save',
      filters: [{ name: 'JSON Files', extensions: ['json'] }],
    });

    if (filePath) {
      // Move temporary file to user-selected location
      await writeFileAsync(filePath, jsonContent, 'utf-8');
      return 'File saved successfully!';
    } else {
      // User cancelled the save
      await unlinkAsync(tempPath); // Clean up temporary file
      return 'File save cancelled.';
    }
  } catch (error) {
    console.error('Failed to save the file:', error);
    return 'Error saving file.';
  }
});
