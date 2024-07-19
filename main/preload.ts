import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

const handler = {
  send(channel: string, value: unknown) {
    ipcRenderer.send(channel, value)
  },
  invoke: async (channel, data) => {
    console.log("data: ", data)
    return await ipcRenderer.invoke(channel, data)
  },
  on(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args)
    ipcRenderer.on(channel, subscription)

    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  },
  onSerialPortList: (callback) => {
    if (callback) {
      ipcRenderer.on('serialPort-list', callback)
    } else {
      ipcRenderer.removeAllListeners('serialPort-list')
    }
    
  },
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
}

contextBridge.exposeInMainWorld('ipc', handler)

export type IpcHandler = typeof handler
