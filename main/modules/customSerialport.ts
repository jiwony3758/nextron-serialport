import { SerialPort, ReadlineParser } from 'serialport';

export interface ICustomSerialPort {
    connect(portPath: string, baudRate?: number): Promise<string>;
    disconnect(): Promise<string>;
    transmit(data: string): void;
    receive(callback: (data: string) => void): void;
}

export class CustomSerialPort implements ICustomSerialPort {
    private port: SerialPort | null = null;
    private parser: ReadlineParser | null = null;

    async connect(path: string, baudRate: number = 115200): Promise<string> {
        return new Promise((resolve, reject) => {
            this.port = new SerialPort({ path, baudRate });
            this.parser = this.port.pipe(new ReadlineParser())

            this.port.on('error', (err) => {
                reject(`Error: ${err.message}`);
            });
        });
    }

    async disconnect(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (this.port && this.port.isOpen) {
                this.port.close((err) => {
                    if (err) {
                        reject(`Error closing port: ${err.message}`);
                    } else {
                        resolve('Port closed');
                    }
                });
            } else {
                resolve('Port is not open');
            }
        });
    }

    transmit(data: string): void {
        if (this.port && this.port.isOpen) {
            this.port.write(data, (err) => {
                if (err) {
                    console.log(`Error writing data: ${err.message}`);
                }
            });
        } else {
            console.log('Port is not open');
        }
    }

    receive(callback: (data: string) => void): void {
        if (this.parser) {
            this.parser.on('data', callback);
        } else {
            console.log('Port is not open or parser is not initialized');
        }
    }
}