// Node.js のすべての API が preload 処理で利用可能
// Chrome の拡張機能と同じサンドボックスを持っている
window.addEventListener("DOMContentLoaded", () => {
    // DOM 要素のテキストを変更する
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) {
            element.textContent = text;
        }
    };

    for (const dependency of ["chrome", "node", "electron"]) {
        // HTML 内の文言を差し替える
        replaceText(`${dependency}-version`, process.versions[dependency]);
    }
});