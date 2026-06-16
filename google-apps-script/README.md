Google Apps Script deployment steps

1. Create a Google Spreadsheet to receive submissions. Note the spreadsheet ID from the URL (the long ID between `/d/` and `/edit`).

2. Open Google Apps Script at https://script.google.com/ and create a new project.

3. Replace the default `Code.gs` content with the code in `Code.gs` in this folder, and replace `SPREADSHEET_ID` with your spreadsheet ID.

4. Save the project, then choose **Deploy > New deployment**.
   - Select **Web app**.
   - For **Execute as:** choose `Me`.
   - For **Who has access:** choose `Anyone, even anonymous`.
     - If you choose `Anyone`, the browser may still require a Google login and submissions will fail with a 401.
     - The site must have `Anyone, even anonymous` for anonymous visitors to submit successfully.

5. Deploy and copy the Web app URL (it looks like `https://script.google.com/macros/s/DEPLOY_ID/exec`).

6. Update `index.html` in the project: replace `YOUR_SCRIPT_ID` in `SCRIPT_URL` with the deployed web app ID or paste the full web app URL.

7. Save and redeploy your static site (Vercel will pick up changes on push).

Notes on CORS and responses:
- If the browser blocks the JSON POST due to CORS, the front-end falls back to a `no-cors` FormData POST which sends the data but returns an opaque response (no success body).
- For best results, deploy the Apps Script web app with access `Anyone, even anonymous` and test a JSON POST — if you encounter CORS issues, use the fallback flow or consider using a small server/proxy.
