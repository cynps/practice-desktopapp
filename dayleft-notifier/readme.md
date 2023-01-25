# readme

## アプリ概要
* タイトルと日付を入力して、予定まであと何日かを表示するだけのアプリ。
* 削除ボタンはあるが削除機能はないので、データベース（json ファイル）から直接削除する。
* データベースの読み取りは起動時のみなため、データベース変更後は再起動が必要。

## TODO
* テスト実行時は最低限問題なく動作する
* ビルドツールによるビルド後に cannot find module 'electron-db' の実行時エラー（アプリ起動時エラーのため、起動しない）が発生
* src ディレクトリで npm install -S 'electron-db' していないのが問題の可能性が高い
* しかし、install すると "path" argument must be one of type string.. が発生するので中断
    ```
    TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string. Received undefined
    at new NodeError (node:internal/errors:387:5)
    at validateString (node:internal/validators:121:11)
    at Object.join (node:path:429:7)
    at Object.<anonymous> (C:\Users\...\practice-desktopapp\dayleft-notifier\src\node_modules\electron-db\index.js:23:21)
    at Module._compile (node:internal/modules/cjs/loader:1141:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1196:10)
    at Module.load (node:internal/modules/cjs/loader:1011:32)
    at Module._load (node:internal/modules/cjs/loader:846:12)
    at f._load (node:electron/js2c/asar_bundle:2:13330)
    at Module.require (node:internal/modules/cjs/loader:1035:19)
    ```