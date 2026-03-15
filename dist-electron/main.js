import { app, session, Menu, MenuItem, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
app.disableHardwareAcceleration();
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    }
  });
  win.on("ready-to-show", () => {
    win?.show();
  });
  if (VITE_DEV_SERVER_URL) {
    app.commandLine.appendSwitch("remote-debugging-port", "9222");
    app.commandLine.appendSwitch("remote-allow-origins", "*");
    win.loadURL(VITE_DEV_SERVER_URL);
  }
}
app.whenReady().then(() => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          [
            // inline стили/скрипты Vue, нужно для Vite dev режима
            // "default-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "default-src 'self'",
            "connect-src 'self' https://swapi-graphql.netlify.app",
            // API
            "img-src 'self' data: https:",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            // "script-src 'self'",
            "style-src 'self' 'unsafe-inline' 'unsafe-eval'"
            // "style-src 'self'",
          ].join("; ")
        ]
      }
    });
  });
  createWindow();
  const menu = new Menu();
  menu.append(new MenuItem({
    label: "DevTools",
    submenu: [{
      label: "Open DevTools",
      accelerator: "CmdOrCtrl+Shift+I",
      click: () => {
        win?.webContents.openDevTools({ mode: "detach" });
      }
    }]
  }));
  Menu.setApplicationMenu(menu);
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
export {
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
