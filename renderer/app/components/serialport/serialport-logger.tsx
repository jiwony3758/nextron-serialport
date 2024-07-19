'use client'

import React, { useEffect, useState } from 'react';

const SerialPortLogger: React.FC = () => {
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    const handleData = (_event: Electron.IpcRendererEvent, data: string) => {
      setLog((prevLog) => [...prevLog, `Data received: ${data}`]);
    };

    window.ipc.on('serialport-data', handleData);

  }, []);

  return (
    <div>
      <h2>Logs</h2>
      <pre>{log.join('\n')}</pre>
    </div>
  );
};

export default SerialPortLogger;