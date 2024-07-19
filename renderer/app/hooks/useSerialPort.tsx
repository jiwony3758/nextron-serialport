'use client'

import { useState, useEffect } from 'react';
import { PortInfo } from '@serialport/bindings-interface'

interface UseSerialPort {
  isConnected: boolean;
  portPath: string;
  baudrate: number;
  connect: (port: PortInfo, baud: number) => void;
  disconnect: () => void;
}

const useSerialPort = (): UseSerialPort => {
  const [isConnected, setIsConnected] = useState(false);
  const [portPath, setPortPath] = useState('');
  const [baudrate, setBaudrate] = useState(9600);

  const connect = async (port: PortInfo, baud: number) => {
    try {
      const message = await window.ipc.invoke('serialport-connect', { portPath: port.path, baudrate: baud });
      setPortPath(port.path);
      setBaudrate(baud);
      console.log(message);
      setIsConnected(true);
    }catch(e){
      console.log(e)
    }
  };

  const disconnect = async () => {
    const message = await window.ipc.invoke('serialport-disconnect', {});
    console.log(message);
    setIsConnected(false);
  };

  useEffect(() => {
    const handleConnect = (_event: Electron.IpcRendererEvent, message: string) => {
      console.log(message);
      setIsConnected(true);
    };

    const handleDisconnect = (_event: Electron.IpcRendererEvent, message: string) => {
      console.log(message);
      setIsConnected(false);
    };

    window.ipc.on('serialport-connected', handleConnect);
    window.ipc.on('serialport-disconnected', handleDisconnect);
  }, []);

  return { isConnected, portPath, baudrate, connect, disconnect };
};

export default useSerialPort;