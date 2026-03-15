import { app, BrowserWindow, session, Menu, MenuItem } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

app.commandLine.appendSwitch('remote-debugging-port', '9222')
app.commandLine.appendSwitch('remote-allow-origins', '*')
app.disableHardwareAcceleration()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Путь к собранному рендереру
process.env.APP_ROOT = path.join(__dirname, '..')
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

// Лог-файл рядом с приложением
const logFile = path.join(app.getPath('userData'), 'debug.log')
const log = (msg: string) => {
  const line = `[${new Date().toISOString()}] ${msg}\n`
  fs.appendFileSync(logFile, line)
  console.log(line)
}

let win: BrowserWindow | null

function createWindow() {
  log('createWindow() вызван')
  log(`VITE_DEV_SERVER_URL: ${VITE_DEV_SERVER_URL}`)
  log(`RENDERER_DIST: ${RENDERER_DIST}`)

  const indexPath = path.join(RENDERER_DIST, 'index.html')
  log(`index.html существует: ${fs.existsSync(indexPath)}`)
  log(`Содержимое dist: ${fs.readdirSync(RENDERER_DIST).join(', ')}`)

  win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#fc6',
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Принудительно открываем DevTools
  win.webContents.on('dom-ready', () => {
    log('dom-ready сработал')
    // win?.webContents.openDevTools({ mode: 'detach' }) // detach = отдельное окно
    // win?.webContents.openDevTools({ mode: 'undocked' }) // undocked вместо detach
    // win?.focus()
  })

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription, url) => {
    log(`did-fail-load: ${errorCode} | ${errorDescription} | url: ${url}`)
  })

  win.webContents.on('did-finish-load', async () => {
    log('did-finish-load — страница загружена')

  // Перехватываем все JS ошибки рендерера
  // await win?.webContents.executeJavaScript(`
  //   window.onerror = function(msg, src, line, col, err) {
  //     require('electron').ipcRenderer.send('renderer-error',
  //       JSON.stringify({ msg, src, line, col, stack: err?.stack })
  //     );
  //   };
  //   window.onunhandledrejection = function(e) {
  //     require('electron').ipcRenderer.send('renderer-error',
  //       JSON.stringify({ msg: e.reason?.message, stack: e.reason?.stack })
  //     );
  //   };
  // `)

  // Ждём 3 секунды чтобы Vue успел отрендериться
  await new Promise(resolve => setTimeout(resolve, 5000))

  // Получаем реальное содержимое страницы
  const bodyHTML = await win?.webContents.executeJavaScript(
    'document.body.innerHTML.substring(0, 500)'
  )
  log(`body HTML: ${bodyHTML}`)

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
`)
log(`Стили: ${styles}`)

  // Получаем все ошибки из консоли
  const title = await win?.webContents.executeJavaScript('document.title')
  log(`Заголовок страницы: ${title}`)
  })

  // Слушаем ошибки от рендерера
  win.webContents.on('console-message', (event, level, message, line, sourceId) => {
    log(`[CONSOLE][${level}] ${message} (${sourceId}:${line})`)
  })

  win.on('ready-to-show', () => {
    log('ready-to-show')
    win?.show()
  })

  // Перехватываем все сетевые запросы
  win.webContents.session.webRequest.onCompleted((details) => {
    if (details.statusCode >= 400 || details.statusCode === 0) {
      log(`[NETWORK ERROR] ${details.statusCode} | ${details.url}`)
    } else {
      log(`[NETWORK OK] ${details.statusCode} | ${details.url}`)
    }
  })

  win.webContents.session.webRequest.onErrorOccurred((details) => {
    log(`[NETWORK FAILED] ${details.error} | ${details.url}`)
  })

  if (VITE_DEV_SERVER_URL) {
    log(`Открываем dev-сервер: ${VITE_DEV_SERVER_URL}`)
    // В режиме разработки открываем dev-сервер
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    log(`Открываем файл: ${indexPath}`)
    win.loadFile(indexPath).catch(err => {
      log(`Ошибка loadFile: ${err}`)
    })
  }

  // win.webContents.openDevTools()
}

app.whenReady().then(() => {
  log('app ready')

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
            "connect-src 'self' https://swapi-graphql.netlify.app", // ← твой API
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

  // Добавляем пункт меню для открытия DevTools
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
