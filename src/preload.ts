import { contextBridge, ipcRenderer } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import type { ElectronAPI } from './types';

// Try to read version from package.json, with fallback
let version = '0.0.5'; // fallback version
try {
    const packagePath = path.join(__dirname, '../../../package.json');
    if (fs.existsSync(packagePath)) {
        version = JSON.parse(fs.readFileSync(packagePath, 'utf8')).version;
    }
} catch (err) {
    console.warn('Could not read package.json version:', err);
}

const electronAPI: ElectronAPI = {
    invoke: (a: string, b?: any) => ipcRenderer.invoke(a, b),
    send: (channel: string, args?: any) => ipcRenderer.send(channel, args),
    receive: (channel: string, func: (...args: any[]) => void) =>
        ipcRenderer.on(channel, (event, ...args) => func(...args)),
    removeListener: (channel: string) => ipcRenderer.removeAllListeners(channel),
    ver: () => version
};

contextBridge.exposeInMainWorld('electron', electronAPI);