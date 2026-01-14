import { app, BrowserWindow, ipcMain, protocol } from 'electron';
import { join, normalize } from 'node:path';
import { fork, ChildProcess } from 'node:child_process';
import { autoUpdater } from 'electron-updater';
import windowStateKeeper from 'electron-window-state';

// Declare Vite environment variables
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string;

let win: BrowserWindow | null = null;

// SECOND INSTANCE
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) app.quit()
else {
    app.on('second-instance', () => {
        // Someone tried to run a second instance, we should focus our window.
        if (win) {
            if (win.isMinimized()) win.restore()
            win.focus()
        }
    })
}
// END SECOND INSTANCE

const aspect = 4.5
const minHeight = 100

const artNet = fork(join(__dirname, 'artNetTcReader.js'), { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] })
artNet.stdout?.pipe(process.stdout)
artNet.stderr?.pipe(process.stdout)

const createWindow = () => {
    // Load the previous window state with fallback to defaults
    const mainWindowState = windowStateKeeper({
        defaultWidth: minHeight * aspect,
        defaultHeight: minHeight,
    });

    // Create the browser window.
    win = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        height: mainWindowState.height,
        width: mainWindowState.width,
        minHeight: minHeight,
        minWidth: minHeight * aspect,
        autoHideMenuBar: true,
        show: false,
        title: 'ArtTimecode Gen v' + app.getVersion(),
        frame: false,
        hasShadow: false,
        icon: join(__dirname, 'icon.ico'),
        webPreferences: {
            preload: join(__dirname, 'preload.js'),
            sandbox: false
        }
    })

    // Let the window state manager track the window's size and position
    mainWindowState.manage(win);

    // In development, MAIN_WINDOW_VITE_DEV_SERVER_URL is provided by @electron-forge/plugin-vite
    // In production, MAIN_WINDOW_VITE_NAME is provided
    const startUrl = MAIN_WINDOW_VITE_DEV_SERVER_URL || `file://${join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)}`;

    win.loadURL(startUrl);
    win.setAspectRatio(aspect)
    // Emitted when the window is closed.
    win.on('closed', () => app.quit())
    win.on('ready-to-show', () => win?.show())
}

app.on('ready', () => {

    protocol.registerFileProtocol('atom', (request, callback) => {
        const url = request.url.substring(6)
        callback({ path: normalize(`${__dirname}/${url}`) })
    })

    artNet.on('message', (msg: any) => {
        switch (msg.cmd) {
            case 'time':
                try {
                    win?.webContents.send('time', msg.clock)
                } catch (error) {
                    console.error('Error sending time:', error);
                }
                break;

            default:
                break;
        }
    });
    artNet.on('error', (err: Error) => { console.log(err); })
    artNet.on('close', (code: number | null) => { console.log('CLOSED', code); })

    ipcMain.on('reactIsReady', () => {
        if (app.isPackaged) {
            autoUpdater.on('error', (err: Error) => win?.webContents.send('updater', err))
            autoUpdater.on('checking-for-update', () => win?.webContents.send('updater', "checking-for-update"))
            autoUpdater.on('update-available', (info: any) => win?.webContents.send('updater', 'update-available', info))
            autoUpdater.on('update-not-available', (info: any) => win?.webContents.send('updater', 'update-not-available', info))
            autoUpdater.on('download-progress', (info: any) => win?.webContents.send('updater', 'download-progress', info))
            autoUpdater.on('update-downloaded', (info: any) => win?.webContents.send('updater', 'update-downloaded', info))
            ipcMain.on('installUpdate', () => autoUpdater.quitAndInstall())

            setTimeout(() => autoUpdater.checkForUpdates(), 3000);
            setInterval(() => autoUpdater.checkForUpdates(), 1000 * 60 * 60);
        }
    })

    ipcMain.on('close', () => app.quit())
    ipcMain.on('min', () => win?.minimize())

    createWindow()

    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
})

app.on('will-quit', () => artNet.kill('SIGKILL'))
// Quit when all windows are closed.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})