const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const db = require("electron-db");
// const { resolve } = require("path");
// const { version } = require("os");
const path = require("path");
const dbLocation = path.join(__dirname, "../data/");
const table_name = "conf";

// debug-mode
const d = false;

// main window
let mainWindow;

const createWindow = () => {
    if (d) console.log("createWindow");
    if (d) {
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
    } else {

        mainWindow = new BrowserWindow({
            width: 300,
            height: 500,
            nodeIntegration: false,
            webPreferences: {
                // preload は、レンダラープロセスが読み込まれる前に実行され、
                // レンダラーのグローバル（window や document 等）と Node.js 環境の両方にアクセスできる
                preload: path.join(__dirname, "preload.js"),
            },
        });
    }

    if (d) {
        console.log("invoke debug-log from createWindow")
        mainWindow.webContents.send("debug-log");

    }

    // const menu = Menu.buildFromTemplate([
    //     {
    //         label: app.name,
    //         submenu:[
    //             {
    //                 click: () => mainWindow.webContents.send("update-counter", 1),
    //                 label: "Increment",
    //             },
    //             {
    //                 click: () => mainWindow.webContents.send("update-counter", -1),
    //                 label: "Decrement",
    //             }
    //         ]
    //     }
    // ]);

    // Menu.setApplicationMenu(menu);

    // プロセス間通信
    // ipcMain.handle("ping", () => "pong");

    // main window に表示する url を指定する
    mainWindow.loadFile("index.html");

    // dev tool の起動
    if (d) mainWindow.webContents.openDevTools();

    // main window が閉じられた時の処理
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

const handleInitDb = async () => {
    const initDbData = () => {
        return new Promise((resolve, reject) => {
            if (db.valid(table_name, dbLocation)) {
                db.getAll(table_name, dbLocation, (succ, result) => {
                    // console.log(result);
                    if (succ) {
                        if (d) {
                            console.log("db.getAll: " + succ);
                            console.log(result.length); 
                        }
                        resolve(result);
                    } else {
                        // console.log(result);
                        if (d) {
                            console.log("db.getAll: " + succ);
                            console.log(result.length); 
                        }
                        reject(result);
                    }
                });
            }
        })
    }
    const ret = await initDbData();
    return ret;
}

// init db
const createDb = (tname) => {
    if (d) console.log("createDb");
    db.createTable(tname, dbLocation, (succ, msg) => {
        if (succ) {
            if (d) console.log(msg);
        } else {
            // if (d) console.log("An error has occured. " + msg);
        }
    });
}

// const handleSetTitle = (event, title) => {
//     if (d) console.log("handleSetTitle");
//     const webContents = event.sender;
//     const win = BrowserWindow.fromWebContents(webContents);
//     win.setTitle(title);
// }

const handleUpsert = (event, title, date) => {
    if (d) console.log("handleUpsert");
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
            if (d) {
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
                    if (d) {
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
                    if (d) {
                        console.log("update");
                        console.log("Success: " + succ);
                        console.log("Message: " + msg);
                    }
                });
            }
        });
    }
}

const handleDelete = (event, title) => {
    if (d) console.log("handleUpsert");

}

// 初期化完了時の処理
app.whenReady().then(() => {
    if (d) console.log("app.whenReady().then()");
    // ipcMain.on("set-title", handleSetTitle);
    ipcMain.on("upsert", handleUpsert);
    // ipcMain.on("counter-value", (_event, value) => {
    //     console.log(value);
    // });

    // 双方向通信
    // ipcMain.handle("load:syncTest", handleSyncApiTest);
    ipcMain.handle("load:initDb", handleInitDb);

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