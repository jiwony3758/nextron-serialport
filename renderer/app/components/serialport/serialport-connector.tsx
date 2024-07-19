'use client'

import React, { useState, useEffect } from 'react';
import { PortInfo } from '@serialport/bindings-interface'

import useSerialPort from '../../hooks/useSerialPort';


const SerialPortConnector: React.FC = () => {
  const [ports, setPorts] = useState([]);
  const [selectedPort, setSelectedPort] = useState<PortInfo>();
  const [inputBaudrate, setInputBaudrate] = useState(9600);
  const { isConnected, portPath, baudrate, connect, disconnect } = useSerialPort();

  const handleChange = (event) => {
    setSelectedPort(event.target.value);
  };

  const handleConnect = () => {
    connect(selectedPort, inputBaudrate);
  };

  const handleDisconnect = () => {
    disconnect();
  };

  useEffect(() => {
    const handlePorts = (event, newPorts) => {
      
      if (newPorts.length > 0) {
        setPorts(newPorts);
        setSelectedPort(newPorts[0]); // 포트가 인식되면 자동 선택
        
      } else {
        const noPort = {
          path: "No Port selected",
          friendlyName: "No Port selected"
        }
        setPorts([noPort])
        setSelectedPort(newPorts[0]);
      }
    };

    window.ipc.onSerialPortList(handlePorts);

    return () => {
      window.ipc.onSerialPortList(null); // cleanup
    };
  }, [selectedPort]);

  return (
    <div>
      <select value={selectedPort as any} onChange={handleChange}>
        {ports.map((port) => (
          <option key={port.path} value={port.path}>
            {port.friendlyName}
          </option>
        ))}
      </select>
      <input
        type="number"
        value={inputBaudrate}
        onChange={(e) => setInputBaudrate(Number(e.target.value))}
        placeholder="Enter baud rate"
      />
      {isConnected ? (
        <div>
          <p>Connected to {portPath} at {baudrate} baud</p>
          <button onClick={handleDisconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={handleConnect}>Connect</button>
      )}
    </div>
  );
};

export default SerialPortConnector;