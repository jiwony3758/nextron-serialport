import React from 'react';
import { ipcRenderer } from 'electron';

import SerialPortConnector from './serialport-connector';
import SerialPortLogger from './serialport-logger';

const SerialPortContainer: React.FC = () => {

  return (
    <div>
      <h1>Serial Port Communication</h1>
      <SerialPortConnector />
      <SerialPortLogger />
    </div>
  );
};

export default SerialPortContainer;