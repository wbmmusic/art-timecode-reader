const { contextBridge, ipcRenderer } = require('electron')
const path = require('path')
const fs = require('fs')

// Try to read version from package.json, with fallback
let version = '0.0.5' // fallback version
try {
    const packagePath = path.join(__dirname, '../../../package.json')
    if (fs.existsSync(packagePath)) {
        version = JSON.parse(fs.readFileSync(packagePath, 'utf8')).version
    }
} catch (err) {
    console.warn('Could not read package.json version:', err)
}

contextBridge.exposeInMainWorld('electron', {
    invoke: (a, b) => ipcRenderer.invoke(a, b),
    send: (channel, args) => ipcRenderer.send(channel, args),
    receive: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
    removeListener: (channel) => ipcRenderer.removeAllListeners(channel),
    ver: () => version
})