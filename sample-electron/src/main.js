const { app, BrowserWindow } = require("electron");
const path = require("path");

// main window
let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // preload は、レンダラープロセスが読み込まれる前に実行され、
            // レンダラーのグローバル（window や document 等）と Node.js 環境の両方にアクセスできる
            preload: path.join(__dirname, "preload.js"),
        },
    });

    // main window に表示する url を指定する
    mainWindow.loadFile("index.html");

    // dev tool の起動
    // mainWindow.webContents.openDevTools();

    // main window が閉じられた時の処理
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

// 初期化完了時の処理
app.whenReady().then(() => {
    createWindow();

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