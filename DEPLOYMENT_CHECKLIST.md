# 📋 Vercel Deployment Checklist

Use this checklist to deploy your Gem Tracker API to Vercel step by step.

## ✅ Pre-Deployment Checklist

- [x] Environment variables documented (`.env.example` created)
- [x] Vercel configuration file created (`vercel.json`)
- [x] Deployment guide created (`DEPLOYMENT_GUIDE.md`)
- [x] Changes committed to Git
- [ ] Changes pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] MongoDB connection string obtained
- [ ] JWT secret generated

---

## 🚀 Deployment Steps

### Step 1: Push to GitHub

```bash
git push origin main
```

**Status:** ⬜ Not started | ⏳ In progress | ✅ Complete

---

### Step 2: Set Up MongoDB Atlas

1. [ ] Go to https://www.mongodb.com/cloud/atlas
2. [ ] Create/Login to your account
3. [ ] Create a new cluster (FREE tier is available)
4. [ ] Create a database user:
   - Username: `gemtracker_user` (or your choice)
   - Password: (generate a strong password)
   - **Save these credentials securely!**
5. [ ] Configure network access:
   - Click "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"
6. [ ] Get connection string:
   - Click "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/gem-tracker`
   - **Replace `<password>` with your actual password**

**MongoDB Connection String:**

```
mongodb+srv://[username]:[password]@[cluster].mongodb.net/gem-tracker
```

**Status:** ⬜ Not started | ⏳ In progress | ✅ Complete

---

### Step 3: Generate JWT Secret

Run this command in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output - this is your JWT secret.

**JWT Secret:** `____________________________________`

**Status:** ⬜ Not started | ⏳ In progress | ✅ Complete

---

### Step 4: Deploy to Vercel

1. [ ] Go to https://vercel.com/dashboard
2. [ ] Click "Add New" → "Project"
3. [ ] If first time: Authorize Vercel to access GitHub
4. [ ] Search and select your repository: `projects_tracker_frontend`
5. [ ] Click "Import"
6. [ ] Configure project:
   - Project Name: `gem-tracker-api`
   - Framework Preset: **Other**
   - Root Directory: `./` (default)
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Install Command: `npm install`

7. [ ] Add Environment Variables (click "Environment Variables"):

   **Copy and paste these one by one:**

   ```
   Name: MONGO_URI
   Value: [Your MongoDB connection string from Step 2]
   Environment: Production
   ```

   ```
   Name: JWT_SECRET
   Value: [Your JWT secret from Step 3]
   Environment: Production
   ```

   ```
   Name: NODE_ENV
   Value: production
   Environment: Production
   ```

   ```
   Name: PUBLIC_URL
   Value: [Leave empty for now - will add after deployment]
   Environment: Production
   ```

8. [ ] Click "Deploy"
9. [ ] Wait for deployment (1-2 minutes)
10. [ ] Copy your deployment URL (e.g., `https://gem-tracker-api-xyz.vercel.app`)

**Deployment URL:** `____________________________________`

**Status:** ⬜ Not started | ⏳ In progress | ✅ Complete

---

### Step 5: Update PUBLIC_URL

1. [ ] In Vercel dashboard, go to your project
2. [ ] Click "Settings" → "Environment Variables"
3. [ ] Find `PUBLIC_URL` (or add it if not there)
4. [ ] Set value to your deployment URL
5. [ ] Click "Save"
6. [ ] Go to "Deployments" tab
7. [ ] Click "..." on the latest deployment → "Redeploy"

**Status:** ⬜ Not started | ⏳ In progress | ✅ Complete

---

### Step 6: Test Your Deployment

1. [ ] Visit your deployment URL in browser
   - Should see: "Gem Tracker API is running..."

2. [ ] Test API endpoint:

   ```
   https://[your-url].vercel.app/api/auth/login
   ```

   - Should return error about missing credentials (this is expected)

3. [ ] Check deployment logs in Vercel if any issues

**Status:** ⬜ Not started | ⏳ In progress | ✅ Complete

---

## 🎉 Post-Deployment

### Update Frontend (if applicable)

Update your frontend's environment variable:

```env
VITE_API_BASE_URL=https://[your-deployment-url].vercel.app/api
```

### Enable Automatic Deployments

✅ Already configured! Every push to `main` branch will automatically deploy.

---

## 📝 Important Information to Save

**GitHub Repository:** https://github.com/Sandaru-Shashinda/projects_tracker_frontend

**MongoDB Atlas:**

- Cluster Name: **\*\*\*\***\_\_\_**\*\*\*\***
- Username: **\*\*\*\***\_\_\_**\*\*\*\***
- Password: **\*\*\*\***\_\_\_**\*\*\*\***
- Connection String: **\*\*\*\***\_\_\_**\*\*\*\***

**Vercel:**

- Project Name: gem-tracker-api
- Deployment URL: **\*\*\*\***\_\_\_**\*\*\*\***
- JWT Secret: **\*\*\*\***\_\_\_**\*\*\*\***

---

## 🆘 Troubleshooting

### Deployment Failed

- Check build logs in Vercel dashboard
- Verify all files are committed and pushed
- Check `vercel.json` is present

### Can't Connect to Database

- Verify MongoDB connection string is correct
- Check password doesn't contain special characters that need encoding
- Ensure IP whitelist includes 0.0.0.0/0
- Test connection string locally first

### API Returns 500 Error

- Check Vercel function logs
- Verify all environment variables are set
- Check MongoDB is accessible

### Need Help?

- Read `DEPLOYMENT_GUIDE.md` for detailed instructions
- Check Vercel logs: Dashboard → Project → Deployments → View Function Logs
- Verify environment variables: Dashboard → Project → Settings → Environment Variables

---

## ✅ Deployment Complete!

Once all steps are marked complete, your API is live! 🎉

**Next Steps:**

- [ ] Share API URL with frontend team
- [ ] Update frontend environment variables
- [ ] Test all API endpoints
- [ ] Monitor deployment logs
- [ ] Set up custom domain (optional)
