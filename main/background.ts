import path from 'path'
import { app, BrowserWindow, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import { CustomSerialPort } from './modules/customSerialport'
import { SerialPort } from 'serialport'

const isProd = process.env.NODE_ENV === 'production'

const serialPort = new CustomSerialPort();
let mainWindow: BrowserWindow;

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()

  mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (isProd) {
    await mainWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/`)
    mainWindow.webContents.openDevTools()
  }

  setInterval(() => {
    SerialPort.list().then(ports => {
      mainWindow.webContents.send('serialPort-list', ports)
    })
  }, 200)
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})


ipcMain.handle('serialport-connect', async (
  _event, 
  { 
    portPath, 
    baudrate
  }: {
    portPath: string,
    baudrate: number
}) => {
  try {
    console.log(portPath)
    const message = await serialPort.connect(portPath, baudrate);
    mainWindow.webContents.send('serialport-connect', "MESSAGE:"+message);
    return "MESSAGE:"+message;
  } catch (error) {
    return "ERROR:"+error;
  }
})


ipcMain.handle('serialport-disconnect', async () => {
  try {
    const message = await serialPort.disconnect();
    mainWindow.webContents.send('serialport-disconnected', message);
    return message;
  } catch (error) {
    return error;
  }
});

ipcMain.on('serialport-transmit', (_event, data: string) => {
  serialPort.transmit(data);
});

ipcMain.on('serialport-receive', (_event) => {
  serialPort.receive((data) => {
    if (mainWindow) {
      mainWindow.webContents.send('serialport-data', data);
    }
  });
});