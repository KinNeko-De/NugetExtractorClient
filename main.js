// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const ipcMain = require('electron').ipcMain
const path = require('path')
const ProgressBar = require('electron-progressbar');
const messages = require('./node/static_codegen/blub_pb');
const services = require('./node/static_codegen/blub_grpc_pb')
const grpc = require('grpc');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  mainWindow.openDevTools();

  
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()


  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

ipcMain.on('selectPackages', function (event, arg) {
  const { dialog } = require('electron')
  
  var fileOptions = 
					{
						filters: [
						{ name: 'HoneyPackages', extensions: ['nupkg'] }
            ],
						properties: [
						'multiSelections',
            'openFile'
            ]
          }

  dialog.showOpenDialog(fileOptions, selectPackagesFinished)
})

// causes deadlocks when an error appear
async function selectPackagesFinished (filenames) {
  var webContents = mainWindow.webContents
  webContents.send('selectionFinished', filenames)

  // var client = new services.BlubberClient('localhost:50051', grpc.credentials.createInsecure());

  // var request = new messages.GiveMeABlubRequest();
  // request.setNameofclient('KinNeko');
  // var call = client.giveMeABlub(request)

  var packagesProgressBar = new ProgressBar({
    indeterminate: false,
    text: 'Really fast',
    title: 'Really fast',
    maxValue: filenames.length,
    browserWindow: {
      webPreferences: {
        nodeIntegration: true
      }
    }
  });

  packagesProgressBar
  .on('completed', function() {
    packagesProgressBar.detail = 'Upgrading completed.';
  })
  .on('aborted', function(value) {
    console.info(`aborted... ${value}`);
  })
  .on('progress', function(value) {
  });

  for (var actualPackage = 0; actualPackage < filenames.length; actualPackage++) {
    var package = filenames[actualPackage];
    packagesProgressBar.detail = `Upgrading Package (${filenames[actualPackage]}) out of ${packagesProgressBar.getOptions().maxValue} Packages`;

    var files = Math.floor(Math.random() * (500 - 200 + 1) ) + 200;

    var packageProgressBar = new ProgressBar({
      indeterminate: false,
      text: `Files of package ${package.replace(/^.*[\\\/]/, '')}`,
      title: 'Processing files..',
      maxValue: files,
      browserWindow: {
        webPreferences: {
          nodeIntegration: true
        }
      }
    });

    var position = packageProgressBar._window.getPosition()
    packageProgressBar._window.setPosition(position[0], position[1] + 200)
  
    packageProgressBar
    .on('completed', function() {
      packageProgressBar.detail = 'Upgrading completed.';
    })
    .on('aborted', function(value) {
      console.info(`aborted... ${value}`);
    })
    .on('progress', function(value) {
      packageProgressBar.detail = `Upgrading File ${value} out of ${packageProgressBar.getOptions().maxValue} Files`;
    });

    for (let f = 0; f < files; f++) {
      await sleep(10);

      packageProgressBar.value += 1;
    }

    if(!packagesProgressBar.isCompleted()){
      packagesProgressBar.value += 1;
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
