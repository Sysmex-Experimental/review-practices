# Javascript -----> Typescript 変換

## ここからはブランチ準備
``` PS C:\DevelopRoom\GitHub\Kioh-Cna-Sandbox> git branch -a
* main
  remotes/origin/main
PS C:\DevelopRoom\GitHub\Kioh-Cna-Sandbox> git checkout -b refactoring main
Switched to a new branch 'refactoring'
PS C:\DevelopRoom\GitHub\Kioh-Cna-Sandbox> git branch -a
  main
* refactoring
  remotes/origin/main
PS C:\DevelopRoom\GitHub\Kioh-Cna-Sandbox> git status
On branch refactoring
nothing to commit, working tree clean
PS C:\DevelopRoom\GitHub\Kioh-Cna-Sandbox> mkdir Kioh-Refactor-Cal


    ディレクトリ: C:\DevelopRoom\GitHub\Kioh-Cna-Sandbox


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        2022/05/21     22:15                Kioh-Refactor-Cal


PS C:\DevelopRoom\GitHub\Kioh-Cna-Sandbox> git push origin
fatal: The current branch refactoring has no upstream branch. 
To push the current branch and set the remote as upstream, use

    git push --set-upstream origin refactoring

PS C:\DevelopRoom\GitHub\Kioh-Cna-Sandbox> 

```
## ここまではブランチ準備

---
---

## ここからはJS→TS変換

### Typescript本家を参考
https://www.typescriptlang.org/

1.  .gitignoreファイルを準備する  
    https://www.toptal.com/developers/gitignore
    サイトからテンプレート生成ができます。

    それから、Giboを使ってみたら、便利かも
    https://github.com/simonwhitaker/gibo  

2.  package.jsonを準備する
    ```
    npm init -y
    ```

3.  typescriptを準備する
    ```
    PS C:\DevelopRoom\GitHub\Kioh-Cna-Sandbox\Kioh-Refactor-Cal> npm install typescript --save-dev

    added 1 package, and audited 2 packages in 1s

    found 0 vulnerabilities
    ```

4.  typescriptのインストール成否を確認する
    ```
    PS C:\DevelopRoom\GitHub\Kioh-Cna-Sandbox\Kioh-Refactor-Cal> npx tsc --version
      Version 4.6.4
    ```

5.  tsconfig.json 生成
    ```
    npx tsc --init
    tips:そもそもnpxは何？
      npm はnode package manager、つまりパッケージの管理ツールです。
      npx はnode package executer、つまりパッケージの実行を行うツールです。
    ★tsconfig.jsonのオプション変更
    https://zenn.dev/chida/articles/bdbcd59c90e2e1
    ```

6.  js->ts->エラー箇所修正
    鰓を見ながら直していく......


7.  tsconfig.json の設定に従って TypeScript から JavaScript への変換を行う
    コンパイル実行
    npx tsc

8.  html
    js参照を変更する

---

# Trouble Shooting
> How To Set Up a New TypeScript Project  
https://www.digitalocean.com/community/tutorials/typescript-new-project


> this  問題  
https://www.valentinog.com/blog/this/

> Bootstrap 問題  
未解決

> null問題
 (method) Document.getElementById(elementId: string): HTMLElement | null  
 Returns a reference to the first object with the specified value of the ID attribute.  
 @param elementId — String that specifies the ID value.  
 オブジェクトは 'null' である可能性があります。ts(2531)  
 
  1.  change it to also possibly be null 
      const myElement: HTMLElement | null = document.getElementById('my-id');
  2.  use Optional Chaining  
      https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining
  3.  use non-null assertion operator
      https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator
  4.  turn strict off. (in your tsconfig.json file)

> Export 問題
  1.  Object.defineProperty(exports, "__esModule", { value: true });
        tsconfig.json から "module":"commonjs",を削除   
  2.  Uncaught SyntaxError: Unexpected token export
        type module を追加   
        ```<script src="../dist/main.js" type="module"></script>```
 

# Terminology

>npm  
  node.js のパッケージマネージャーで、モジュールというかパッケージというか JavaScriptの便利ライブラリのインストールをコマンドで行えるもの。

>node_modules  
  カレントディレクトリ配下にあり、カレントディレクトリにインストールされるモジュールの中身が配置されるフォルダ。

>package.json  
  カレントディレクトリ配置されるファイル。package.jsonにはインストールするモジュールを記入することができる。

>package-lock.json  
  カレントディレクトリ配置されるファイル。package.jsonでインストール指定されたモジュールがインストールされるときにそのモジュールが使用している別のモジュールなどの完全なバージョンが記載されているファイル。このファイルは、node_modules の中に入っているモジュールすべてが記載されている。
