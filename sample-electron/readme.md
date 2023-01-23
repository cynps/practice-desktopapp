# readme

## 参考 URL
* https://ics.media/entry/7298/

## installation
* プロジェクトフォルダの初期化
    ```
    # cd /## foo bar ##/
    # mkdir sample-electron 
    # npm init -y
    # npm install -D electron
    ```
* コーディング
    * ./src フォルダを作成し、以下のファイルを新規作成、格納
        * index.html
        * main.js
        * preload.js
        * package.json
* 実行
    ```
    # cd /## foo bar ##/sample-electron
    # npx electron ./src
    ```
* デスクトップアプリとしてパッケージ化
    ```
    # cd /## foo bar ##/sample-electron
    # // windows os app
    # npx electron-packager src app --platform=win32 --arch=x64 --overwrite
    # // mac os app
    # npx electron-packager src app --platform=darwin --arch=x64 --overwrite
    ```

## notice
* npm で electron をグローバルインストール（-g オプション）しない
* コマンドは npm script に書く
    * package.json の "scripts": {} 内
    * 実行コマンドは npm run コマンド名
