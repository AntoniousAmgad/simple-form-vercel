# Simple Form

A minimal static site with a sign-up form (First name, Last name, Email).

Deploy: This can be deployed to Vercel as a static project using the Vercel CLI or by connecting the repository in the Vercel dashboard.

Commands:

```powershell
# initialize and push (example)
git init
git branch -M main
git add .
git commit -m "Initial commit: add simple form"
# if you have GitHub CLI and are authenticated
gh repo create simple-form-vercel --public --source=. --remote=origin --push
# deploy with Vercel CLI
vercel --prod --confirm
```

Google Sheets integration:

- See `google-apps-script/Code.gs` for a sample Apps Script `doPost` handler.
- Follow `google-apps-script/README.md` to deploy the script as a Web App and copy the URL.
- Paste the web app URL into `index.html` by replacing `YOUR_SCRIPT_ID` in `SCRIPT_URL`.
