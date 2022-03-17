/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import cp from 'child_process';
import { app, BrowserWindow, ipcMain, session, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { windowStateKeeper } from './stateKeeper';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  // if (isDevelopment) {
  //   await installExtensions();
  // }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const EXTRARESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'extraResources')
    : path.join(__dirname, '../../extraResources');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };
  const getExtraResourcesPath = (...paths: string[]): string => {
    return path.join(EXTRARESOURCES_PATH, ...paths);
  };
  // 保存窗口位置大小信息
  const mainWindowStateKeeper = await windowStateKeeper('main');

  mainWindow = new BrowserWindow({
    show: false,
    x: mainWindowStateKeeper.x,
    y: mainWindowStateKeeper.y,
    width: mainWindowStateKeeper.width,
    height: mainWindowStateKeeper.height,
    minWidth: 300,
    frame: false,
    transparent: true,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      // preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  // mainWindowStateKeeper track 加载窗口位置大小信息
  await mainWindowStateKeeper.track(mainWindow);

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ipcMain.on('toggleDevTools', () => {
    mainWindow?.webContents.toggleDevTools();
  });
  ipcMain.on('setAlwaysOnTop', async (_event, flag: boolean) => {
    if (flag) {
      mainWindow?.setVisibleOnAllWorkspaces(true, {
        visibleOnFullScreen: true,
      });
      mainWindow?.setAlwaysOnTop(true, 'screen-saver', 1);
    } else {
      mainWindow?.setAlwaysOnTop(false);
    }
  });
  ipcMain.on('closeApp', async () => {
    if (process.platform !== 'darwin') {
      app.quit();
    } else {
      app.exit();
    }
  });
  ipcMain.on('getSystemFonts', async () => {
    const systemFontsScriptPath = getExtraResourcesPath('fontlist/getSystemFonts.js')
    let fonts = [];
    const forked = cp.fork(systemFontsScriptPath);
    forked.on('message', function (message) {
      fonts = message
      mainWindow?.webContents.send('getSystemFontsCb', fonts);
    });
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // 防止 bilibili referer 403
  const filter = {
    urls: ['*://*.bilibili.com/*', '*://*.hdslb.com/*'],
  };
  session.defaultSession.webRequest.onBeforeSendHeaders(
    filter,
    (details, cb) => {
      details.requestHeaders.referer = 'https://www.bilibili.com';
      const data = { requestHeaders: details.requestHeaders };
      cb(data);
    }
  );

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
