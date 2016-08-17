const electron = require('electron');
import {app, BrowserWindow, Menu, ipcMain} from 'electron';
import env from './env';
var path = require("path");
console.log(". = %s", path.resolve("./"));

let win;
let regressionWindow;

if (env.name !== 'production') {
    var userDataPath = app.getPath('userData');
    app.setPath('userData', userDataPath + ' (' + env.name + ')');
}

function createWindow() {
    electron.crashReporter.start({
        productName: 'Desktop-Digitizer',
        companyName: 'ORNL',
        submitURL: 'http://hyperion.ornl.gov:8080/crashreportserver/crsServlet/new',
        autoSubmit: true
    });
    // setImmediate(function () {process.crash();});

    win = new BrowserWindow({width: 1200, height: 1000});
    win.loadURL(`file://${__dirname}/app.html`);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //BUILD APPLICATION MENU

    const template = [
        {
            label:'File',
            submenu:[
                {
                    label:'Load Image',
                    click: function(){
                        win.webContents.send('loadNewImage');
                    }
                },
                {
                    label:'Export JSON',
                    click: function () {
                        win.webContents.send('exportJSON');
                    }
                },
                {
                    label:'Import JSON',
                    click: function () {
                        win.webContents.send('importJSON');
                    }
                },
                {
                    label:'Close',
                    role: 'close',
                    accelerator: 'CmdOrCtrl+Q'
                }
            ]
        },
        {
            label:'Axes',
            submenu:[
                {
                    label:'Calibrate Axes',
                    click: function () {
                        win.webContents.send('editAlignment');
                    }
                },
                {
                    label:'Remove Grid',
                    click: function () {
                        win.webContents.send('removeGrid');
                    }
                },
                {
                    label:'Transformation Equations',
                    click: function () {
                        win.webContents.send('transformationEquations');
                    }
                }
            ]
        },
        {
            label:'Data',
            submenu:[
                {
                    label:'Acquire Data',
                    click: function () {
                        win.webContents.send('acquireData');
                    }
                },
                {
                    label:'Manage Data Sets',
                    click: function () {
                        win.webContents.send('manageDataSets');
                    }
                }
            ]
        },
        {
            label:'Measure',
            submenu:[
                {
                    label:'Distances',
                    click: function () {
                        win.webContents.send('measureDistance');
                    }
                },
                {
                    label:'Angles',
                    click: function () {
                        win.webContents.send('measureAngles');
                    }
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click (item, focusedWindow) {
                        if (focusedWindow) focusedWindow.reload()
                    }
                },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                    click (item, focusedWindow) {
                        if (focusedWindow) focusedWindow.webContents.toggleDevTools()
                    }
                },
                {
                    label:'Zoom In',
                    accelerator:'CmdOrCtrl+=',
                    click: function(){
                        win.webContents.send('zoomIn');
                    }
                },
                {
                    label:'Zoom Out',
                    accelerator:'CmdOrCtrl+-',
                    click: function(){
                        win.webContents.send('zoomOut');
                    }
                },
                {
                    label:'Actual Size',
                    accelerator:'CmdOrCtrl+a',
                    click: function(){
                        win.webContents.send('actualSize');
                    }
                },
                {
                    label:'Fit',
                    accelerator:'CmdOrCtrl+f',
                    click: function(){
                        win.webContents.send('fit');
                    }
                },
                {
                    label:'Extend Crosshair',
                    type: 'checkbox',
                    click: function(){
                        win.webContents.send('extendCrosshair');
                    }
                },
                {
                    label:'Crosshair Zoom Settings',
                    click: function(){
                        win.webContents.send('crosshairZoomSettings');
                    }
                }
            ]
        }
    ];

    if (process.platform === 'darwin') {
        const name = app.getName();
        template.unshift({
            label: name,
            submenu: [
                {
                    role: 'about'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'hide'
                },
                {
                    role: 'hideothers'
                },
                {
                    role: 'unhide'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'quit'
                }
            ]
        })

    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    if(process.platform === 'darwin'){
        if (env.name !== 'production') {
            console.log('Running in development');
            win.webContents.openDevTools();
        } else {
            console.log('Running in production');
            template[5].submenu.splice(1,1);
        }
    }else{
        if (env.name !== 'production'){
            console.log('Running in development');
            win.webContents.openDevTools();
        } else {
            template[4].submenu.splice(1,1);
        }
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    win.on('closed', () => {
        regressionWindow.destroy();
        regressionWindow = null;
        win = null;
    });

    regressionWindow = new BrowserWindow({
        width:1000,
        height:800,
        show:false,
        resizeable: false
    });

    regressionWindow.loadURL(`file://${__dirname}/regression.html`);

    ipcMain.on('showRegression', function(event, originalPoints, efficiencyPoints){

        regressionWindow.loadURL(`file://${__dirname}/regression.html`);
        regressionWindow.webContents.on('did-finish-load', function() {
            regressionWindow.webContents.send('data', originalPoints, efficiencyPoints);
            regressionWindow.show();
        });
    });

    regressionWindow.on('close', function(ev){
        ev.preventDefault();
        regressionWindow.hide();
        win.webContents.send('makeMainWindowVisible');
    });


    ipcMain.on('closeRegressionWindow', function(){
        regressionWindow.hide();
        // regressionWindow = null;
        win.webContents.send('makeMainWindowVisible');
    });

    ipcMain.on('removeRegWinMenu', function(){
        regressionWindow.setMenu(null);
    });

}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
