import { app, BrowserWindow, session, Menu, MenuItem } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

// Отключить аппаратное ускорение
app.disableHardwareAcceleration()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Путь к собранному рендереру
process.env.APP_ROOT = path.join(__dirname, '..')
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

let win: BrowserWindow | null

function createWindow() {

  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  win.on('ready-to-show', () => {
    win?.show()
  })

  if (VITE_DEV_SERVER_URL) {
    // DevTools из браузера
    app.commandLine.appendSwitch('remote-debugging-port', '9222')
    app.commandLine.appendSwitch('remote-allow-origins', '*')

    // В режиме разработки открываем dev-сервер
    win.loadURL(VITE_DEV_SERVER_URL)
  }
}

app.whenReady().then(() => {
  // Разрешаем запросы к внешнему GraphQL API
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          [
            // inline стили/скрипты Vue, нужно для Vite dev режима
            // "default-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "default-src 'self'",
            "connect-src 'self' https://swapi-graphql.netlify.app", // API
            "img-src 'self' data: https:",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            // "script-src 'self'",
            "style-src 'self' 'unsafe-inline' 'unsafe-eval'",
            // "style-src 'self'",
          ].join('; ')
        ]
      }
    })
  })

  createWindow()

  // Добавляем пункт меню для открытия DevTools, не всегда работает
  const menu = new Menu()
  menu.append(new MenuItem({
    label: 'DevTools',
    submenu: [{
      label: 'Open DevTools',
      accelerator: 'CmdOrCtrl+Shift+I',
      click: () => {
        win?.webContents.openDevTools({ mode: 'detach' })
      }
    }]
  }))
  Menu.setApplicationMenu(menu)

})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
