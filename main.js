const electron = require('electron');
const {app,BrowserWindow} = electron;
const path = require('path');
const glob = require('glob');

let win = null;

function singleInstance() {
    app.requestSingleInstanceLock();
    app.on('second-instance', (event) => {
        if (win) {
            win.isMinimized() && win.restore();
            win.focus();
        }
    })
}

function initApp(){
    singleInstance();

    function createMainWindow() {
        win = new BrowserWindow({
            width: 800,
            maxWidth:800,
            height: 600,
            maxHeight:600,
            frame:false,
            resizable: false,
            title: 'Music Player',
            icon: path.join(__dirname, 'assets/image/icon.png'),
            fullscreenable: false,
            maximizable:false,
            webPreferences: {
                nodeIntegration: true,
            }
        })
        win.loadURL(path.join('file://', __dirname, 'sections/index.html'));

        win.on('closed', () => {
            win = null;
        })
    }
    app.on('ready', createMainWindow);
    app.on('quit', () => {
        app.quit();
    })

    // require every js module in main-process folder
    glob.sync(path.join(__dirname, '/main-process/**/*.js')).forEach((item)=>{
        require(item);
    })
}

initApp();
