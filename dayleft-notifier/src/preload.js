// Node.js のすべての API が preload 処理で利用可能
// Chrome の拡張機能と同じサンドボックスを持っている
// window.addEventListener("DOMContentLoaded", () => {
//     // DOM 要素のテキストを変更する
//     const replaceText = (selector, text) => {
//         const element = document.getElementById(selector);
//         if (element) {
//             element.textContent = text;
//         }
//     };

//     for (const dependency of ["chrome", "node", "electron"]) {
//         // HTML 内の文言を差し替える
//         replaceText(`${dependency}-version`, process.versions[dependency]);
//     }
// });

// initialize db 
// const db = require('electron-db');

// process.once('loaded', () => {
//     // global.ipcRenderer = electron.ipcRenderer;
//     // global.app = electron.remote.app;
//     global.Datastore = require('nedb');
// });

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    // ping: () => ipcRenderer.invoke("ping"),
    // setTitle: (title) => ipcRenderer.send("set-title", title),
    upsert: (title, date) => ipcRenderer.send("upsert", title, date),
    // onUpdateCounter: (callback) => ipcRenderer.on("update-counter", callback),
    delete: (title) => ipcRenderer.send("delete", title),
    // onDebugLog: (callback) => ipcRenderer.send("debug-log", callback),
    initDb: () => ipcRenderer.invoke("load:initDb"),

});

// window.addEventListener("DOMContentLoaded", () => {
//     const counter = document.getElementById("message");
//     ipcRenderer.on("update-counter", (_event, value) => {
//         const oldValue = Number(counter.innerHTML);
//         const newValue = oldValue + value;
//         counter.innerHTML = newValue;
//     });
// });
