import { app, session, Menu, MenuItem, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
app.commandLine.appendSwitch("remote-debugging-port", "9222");
app.commandLine.appendSwitch("remote-allow-origins", "*");
app.disableHardwareAcceleration();
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
const logFile = path.join(app.getPath("userData"), "debug.log");
const log = (msg) => {
  const line = `[${(/* @__PURE__ */ new Date()).toISOString()}] ${msg}
`;
  fs.appendFileSync(logFile, line);
  console.log(line);
};
let win;
function createWindow() {
  log("createWindow() вызван");
  log(`VITE_DEV_SERVER_URL: ${VITE_DEV_SERVER_URL}`);
  log(`RENDERER_DIST: ${RENDERER_DIST}`);
  const indexPath = path.join(RENDERER_DIST, "index.html");
  log(`index.html существует: ${fs.existsSync(indexPath)}`);
  log(`Содержимое dist: ${fs.readdirSync(RENDERER_DIST).join(", ")}`);
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: "#fc6",
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    }
  });
  win.webContents.on("dom-ready", () => {
    log("dom-ready сработал");
  });
  win.webContents.on("did-fail-load", (event, errorCode, errorDescription, url) => {
    log(`did-fail-load: ${errorCode} | ${errorDescription} | url: ${url}`);
  });
  win.webContents.on("did-finish-load", async () => {
    log("did-finish-load — страница загружена");
    await new Promise((resolve) => setTimeout(resolve, 5e3));
    const bodyHTML = await win?.webContents.executeJavaScript(
      "document.body.innerHTML.substring(0, 500)"
    );
    log(`body HTML: ${bodyHTML}`);
    const styles = await win?.webContents.executeJavaScript(`
  const body = document.body;
  const computed = getComputedStyle(body);
  JSON.stringify({
    background: computed.backgroundColor,
    color: computed.color,
    appHeight: document.getElementById('app')?.offsetHeight,
    appWidth: document.getElementById('app')?.offsetWidth,
    appDisplay: getComputedStyle(document.getElementById('app')).display,
    appVisibility: getComputedStyle(document.getElementById('app')).visibility,
    appOpacity: getComputedStyle(document.getElementById('app')).opacity,
  })
`);
    log(`Стили: ${styles}`);
    const title = await win?.webContents.executeJavaScript("document.title");
    log(`Заголовок страницы: ${title}`);
  });
  win.webContents.on("console-message", (event, level, message, line, sourceId) => {
    log(`[CONSOLE][${level}] ${message} (${sourceId}:${line})`);
  });
  win.on("ready-to-show", () => {
    log("ready-to-show");
    win?.show();
  });
  win.webContents.session.webRequest.onCompleted((details) => {
    if (details.statusCode >= 400 || details.statusCode === 0) {
      log(`[NETWORK ERROR] ${details.statusCode} | ${details.url}`);
    } else {
      log(`[NETWORK OK] ${details.statusCode} | ${details.url}`);
    }
  });
  win.webContents.session.webRequest.onErrorOccurred((details) => {
    log(`[NETWORK FAILED] ${details.error} | ${details.url}`);
  });
  if (VITE_DEV_SERVER_URL) {
    log(`Открываем dev-сервер: ${VITE_DEV_SERVER_URL}`);
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    log(`Открываем файл: ${indexPath}`);
    win.loadFile(indexPath).catch((err) => {
      log(`Ошибка loadFile: ${err}`);
    });
  }
}
app.whenReady().then(() => {
  log("app ready");
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
            // ← твой API
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
