import { app, BrowserWindow, Menu, shell, nativeTheme, ipcMain, session } from "electron";
import path from "node:path";

const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const PROD_URL = "https://guideitsol.in";
const isDev = !!VITE_DEV_SERVER_URL;

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 680,
    title: "GUIDESOFT - Learn Real Technology",
    icon: path.join(__dirname, "../public/favicon.png"),
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 16, y: 16 },
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#0f172a" : "#ffffff",
    show: false,
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  const menuTemplate: Electron.MenuItemConstructorOptions[] = [
    {
      label: "GUIDESOFT",
      submenu: [
        { label: "About GUIDESOFT", role: "about" },
        { type: "separator" },
        { label: "Preferences", accelerator: "CmdOrCtrl+,", enabled: false },
        { type: "separator" },
        { label: "Quit", role: "quit" },
      ],
    },
    {
      label: "View",
      submenu: [
        { label: "Home", accelerator: "CmdOrCtrl+Shift+H", click: () => mainWindow?.loadURL(VITE_DEV_SERVER_URL || PROD_URL) },
        { label: "Courses", accelerator: "CmdOrCtrl+Shift+C", click: () => mainWindow?.loadURL(`${VITE_DEV_SERVER_URL || PROD_URL}/courses`) },
        { label: "Live Batches", accelerator: "CmdOrCtrl+Shift+L", click: () => mainWindow?.loadURL(`${VITE_DEV_SERVER_URL || PROD_URL}/live-batches`) },
        { type: "separator" },
        { label: "Reload", role: "reload" },
        { label: "Force Reload", role: "forceReload" },
        { type: "separator" },
        { label: "Toggle Full Screen", role: "togglefullscreen" },
        { label: "Toggle DevTools", role: "toggleDevTools" },
      ],
    },
    {
      label: "Window",
      submenu: [
        { label: "Minimize", role: "minimize" },
        { label: "Zoom", role: "zoom" },
        { type: "separator" },
        { label: "Bring All to Front", role: "unarchive" },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));

  mainWindow.loadURL(VITE_DEV_SERVER_URL || PROD_URL);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("get-theme", () => nativeTheme.shouldUseDarkColors ? "dark" : "light");
