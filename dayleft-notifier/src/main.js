const { app, BrowserWindow, ipcMain } = require("electron");
const db = require("electron-db");
// const { version } = require("os");
const path = require("path");
const dbLocation = path.join(__dirname, "../data/");
const version_debug = true;
const table_name = "conf";

// main window
let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1100,
        height: 1200,
        nodeIntegration: false,
        webPreferences: {
            // preload は、レンダラープロセスが読み込まれる前に実行され、
            // レンダラーのグローバル（window や document 等）と Node.js 環境の両方にアクセスできる
            preload: path.join(__dirname, "preload.js"),
        },
    });

    // プロセス間通信
    ipcMain.handle("ping", () => "pong");

    // main window に表示する url を指定する
    mainWindow.loadFile("index.html");

    // dev tool の起動
    mainWindow.webContents.openDevTools();

    // main window が閉じられた時の処理
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

// init db
const createDb = (tname) => {
    db.createTable(tname, dbLocation, (succ, msg) => {
        if (succ) {
            if (version_debug) console.log(msg);
        } else {
            if (version_debug) console.log("An error has occured. " + msg);
        }
    });
}

const handleSetTitle = (event, title) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.setTitle(title);
}

const handleUpsert = (event, title, date) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    // win.setTitle(title);
    // console.log(win);

    tname = table_name;
    where = {
        title: title
    };
    if (db.valid(tname, dbLocation)) {
        db.getRows(tname, dbLocation, where, (succ, result) => {
            if (version_debug) {
                console.log("Success: " + succ);
                console.log(result);
            }

            if (result.length === 0) {
                // insert (count = 0)
                set = {
                    title: title,
                    date: date
                };
                db.insertTableContent(tname, dbLocation, set, (succ, msg) => {
                    if (version_debug) {
                        console.log("insert");
                        console.log("Success: " + succ);
                        console.log("Message: " + msg);
                    }
                });

            } else {
                // update (count > 0)
                set = {
                    date: date
                };
                db.updateRow(tname, dbLocation, where, set, (succ, msg) => {
                    if (version_debug) {
                        console.log("update");
                        console.log("Success: " + succ);
                        console.log("Message: " + msg);
                    }
                });
            }
        });
    }
}

// 初期化完了時の処理
app.whenReady().then(() => {
    ipcMain.on("set-title", handleSetTitle);
    ipcMain.on("upsert", handleUpsert);
    createWindow();
    createDb(table_name);

    // when app activated
    app.on("activate", () => {
        // main window が消えている場合は再度作成
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// すべてのウィンドウが閉じたときの処理
app.on("window-all-closed", () => {
    // quit app except mac OS
    if (process.platform !== "darwin") {
        app.quit();
    } 
});