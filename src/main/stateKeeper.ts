/**
 * see https://stackoverflow.com/questions/51328586/how-to-restore-default-window-size-in-an-electron-app
 * * */

// import { screen } from 'electron';
import settings from 'electron-settings';
import BrowserWindow = Electron.BrowserWindow;

interface WindowState {
  x: number | undefined;
  y: number | undefined;
  width: number;
  height: number;
  isMaximized?: boolean;
}

export const windowStateKeeper = async (windowName: string) => {
  let window: BrowserWindow;
  let windowState: WindowState;

  const setBounds = async () => {
    // Restore from appConfig
    if (await settings.has(`windowState.${windowName}`)) {
      windowState = await settings.get(`windowState.${windowName}`);
      return;
    }

    // const size = screen.getPrimaryDisplay().workAreaSize;

    // Default
    windowState = {
      x: undefined,
      y: undefined,
      width: 390,
      height: 800,
      // width: size.width / 2,
      // height: size.height / 2,
    };
  };

  const saveState = async () => {
    // bug: lots of save state events are called. they should be debounced
    if (!windowState.isMaximized) {
      windowState = window.getBounds();
    }
    windowState.isMaximized = window.isMaximized();
    await settings.set(`windowState.${windowName}`, windowState);
  };

  const track = async (win) => {
    window = win;
    ['resize', 'move', 'close'].forEach((event) => {
      win.on(event, saveState);
    });
  };

  await setBounds();

  return {
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    isMaximized: windowState.isMaximized,
    track,
  };
};
