# Church Member Registration (Static frontend + Google Sheets backend)

This project is a small, free-to-host web app for church staff to collect and manage member information using Google Sheets as the data store.

Features
- Responsive, accessible member registration form
- Saves submissions to a Google Sheet via a Google Apps Script Web App
- Simple validation, loading state, and success/error messages

Files
- `index.html` — Frontend form
- `styles.css` — Simple responsive styles
- `app.js` — Form handling and Fetch integration
- `google-apps-script.gs` — Apps Script backend to append rows to the sheet
- `sheet_template.csv` — Example sheet layout

Setup
1. Create a Google Sheet. Rename the first sheet to `Members`.
2. In the Sheet, open `Extensions → Apps Script` and create a new script.
3. Replace the default `Code.gs` with the contents of `google-apps-script.gs` from this repo.
4. Deploy the script as a Web App: `Deploy → New deployment → Web app`.
   - Execute as: `Me`
   - Who has access: `Anyone` (or `Anyone with link`) — note: if you need authentication, see security notes below.
5. Copy the Web App URL and paste it into `app.js` replacing the `GAS_URL` placeholder.
6. Test by opening `index.html` locally or hosting on GitHub Pages.

Using a standalone script and sheet ID
------------------------------------
If you created the Apps Script as a standalone project (not bound to the Sheet), set the `SHEET_ID` variable at the top of `google-apps-script.gs` to the ID from your Google Sheet URL:

```
https://docs.google.com/spreadsheets/d/<THIS_IS_THE_SHEET_ID>/edit
```

Paste that ID into `google-apps-script.gs` in the `SHEET_ID` variable and re-deploy the web app.

Opening the Sheet to view submissions
------------------------------------
After submissions succeed, open the Google Sheet in your browser (the same Sheet you provided by ID or bound to the script). The `Members` sheet/tab will contain rows of submissions with a `Timestamp` column on the left.

Deploying frontend
- GitHub Pages: create a repository, push the files, enable GitHub Pages from `main` branch.
- Netlify/Vercel: drag-and-drop the folder or connect the repository.

Google Sheet example columns
Timestamp, First Name, Last Name, Phone, Email, Address, Birthday, Notes

Security and notes
- For anonymous submission from a static site, the Apps Script web app must allow `Anyone` access. This means the endpoint is publicly writable. Keep the sheet shared only with church leaders.
- To reduce spam or abuse consider:
  - Adding a simple CAPTCHA-like question (e.g., math question) before submission.
  - Use Google Identity for authenticated users (extra work).
  - Periodically review and clean submissions in the Google Sheet.

Local CORS proxy (for development)
---------------------------------
If you run into CORS issues while developing locally (browser blocks requests to the Apps Script), you can run a small proxy that adds CORS headers:

1. Install dependencies and start the proxy:

```bash
npm install
npm start
```

2. Change the `GAS_URL` in `app.js` while developing to point to the proxy URL:

```
// example
const GAS_URL = 'http://localhost:8080/proxy/macros/s/YOUR_SCRIPT_ID/exec';
```

This proxy is for local development only — don't use it in production.

Deploying a shareable proxy (production)
---------------------------------------
If you want the form to work from any device via a shareable URL, deploy a lightweight proxy that adds CORS headers and forwards requests to your Apps Script. Two easy options:

- Vercel (recommended): create an `api/proxy.js` serverless function (example in this repo under `/api/proxy.js`) and deploy the repo to Vercel. After deployment, set `GAS_URL` in `app.js` to the function URL, for example:

```
const GAS_URL = 'https://your-deployment.vercel.app/api/proxy/macros/s/YOUR_SCRIPT_ID/exec'
```

- Netlify: add a serverless function that proxies `/proxy/*` to `https://script.google.com` and deploy the site. Use the function URL in `app.js` similarly.

Both options will return CORS headers allowing the form to POST from any origin. Deploying the proxy to Vercel or Netlify gives you a public URL you can share with anyone.

Extending the app
- Add edit/delete flows: implement Apps Script functions that verify a secret token before performing destructive actions.
- Add member photos: use Google Drive to store images and save links in the sheet.
