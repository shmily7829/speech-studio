# Speech Studio · 演講練習室

個人 Toastmasters 英文口說練習網站，介面為繁體中文，適合 A2–B1 使用者。

## 功能

- Persuasive Influence Level 1／Level 2 的七個 Project，每個 Project 可有多篇講稿。
- 英文、中文與雙語閱讀；關鍵字背誦、字體調整與演講節奏提示。
- 裝置內建 TTS，預設美式聲音，支援語速／音高控制；可選聲音依裝置而異。
- 全文／分段計時與練習紀錄。
- UTF-8 TXT／Markdown 匯入、分段預覽、更新原稿、最近五份舊稿還原。
- 可還原的回收區、最後編輯時間（台北時間）。

## 講稿備份

`speeches/manifest.json` 列出三份實際講稿：領導演講，以及兩份 Ice Breaker 稿件。兩份同名稿以不同 ID 保存，避免互相覆蓋。測試稿未納入。

每篇資料夾包含：

- `english.txt`：英文正文。
- `bilingual.md`：可重新匯入網站的雙語稿；未提供的中譯留白。
- `speech.json`：完整段落、提示、舊稿與練習紀錄。

這些是匯出當時的快照。網站中的後續修改不會自動提交到 GitHub。

## 本機執行

需要 Node.js 22.13 或更新版本。

```sh
npm ci
npm run db:generate
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_familiar_blockbuster.sql
npm run dev -- --port 5173 --hostname 127.0.0.1
```

本機預覽登入入口：`http://127.0.0.1:5173/signin-with-chatgpt?return_to=/`。這使用預覽測試帳號，不代表已登入正式網站。

```sh
node scripts/check-import.mjs
npx tsc --noEmit
```

## 手機與跨裝置同步

`localhost`／`127.0.0.1` 僅供電腦本機預覽，手機無法藉此連到同一份資料。

目前網站使用伺服器端 Cloudflare D1 與 Sites 管理的 ChatGPT 登入，不能直接以 GitHub Pages 靜態託管。GitHub 儲存庫用來保存程式與講稿；要讓手機同步，仍需將網站與 D1 發布到支援的正式環境，並用同一帳號登入。

`.openai/hosting.json` 保留目前的私人 Sites 身分與 DB 綁定。這不是帳密。正式發布尚未完成，正式登入／跨裝置同步尚未驗證。

## 資料與權限

資料讀寫依伺服器提供的使用者身分隔離，並以 revision 檢查版本衝突。講稿內含個人經驗，儲存庫應保持私人。

不應提交 `node_modules`、`.wrangler`、`.sites-runtime`、`.env*`、資料庫檔案或任何存取權杖。此備份不含本機登入資料或原始 SQLite 資料庫。
