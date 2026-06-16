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
