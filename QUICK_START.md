# 🚀 Quick Start: Deploy to Vercel Now!

Your Gem Tracker API is ready to deploy! Follow these steps:

## ✅ Step 1: MongoDB Atlas Setup (5 minutes)

1. **Go to:** https://www.mongodb.com/cloud/atlas
2. **Sign up/Login** (it's free!)
3. **Create a cluster:**
   - Click "Build a Database"
   - Choose "FREE" (M0 Sandbox)
   - Select a cloud provider and region (closest to you)
   - Click "Create Cluster"
4. **Create database user:**
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Username: `gemtracker`
   - Password: Click "Autogenerate Secure Password" and **SAVE IT**
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"
5. **Whitelist all IPs:**
   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere"
   - Click "Confirm"
6. **Get connection string:**
   - Go to "Database" in left menu
   - Click "Connect" button on your cluster
   - Click "Drivers"
   - Copy the connection string (looks like: `mongodb+srv://gemtracker:<password>@...`)
   - Replace `<password>` with your actual password

**✏️ Write your connection string here:**

```
mongodb+srv://gemtracker:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/gem-tracker
```

---

## 🔐 Step 2: Generate JWT Secret (30 seconds)

Run this command in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**✏️ Write your JWT secret here:**

```
_________________________________________________________________
```

---

## 🌐 Step 3: Deploy to Vercel (5 minutes)

### Option A: Web Interface (Recommended) 👍

1. **Go to:** https://vercel.com/signup
2. **Sign up with GitHub** (easiest option)
3. **Click "Add New" → "Project"**
4. **Import your repository:**
   - Find: `Sandaru-Shashinda/gem_tracker_api`
   - Click "Import"
5. **Configure:**
   - Project Name: `gem-tracker-api`
   - Framework Preset: **Other**
   - Root Directory: `./` (leave as is)
6. **Add Environment Variables** (click dropdown):

   **Variable 1:**
   - Name: `MONGO_URI`
   - Value: [Your MongoDB connection string from Step 1]
   - Environment: Production ✓

   **Variable 2:**
   - Name: `JWT_SECRET`
   - Value: [Your JWT secret from Step 2]
   - Environment: Production ✓

   **Variable 3:**
   - Name: `NODE_ENV`
   - Value: `production`
   - Environment: Production ✓

7. **Click "Deploy"** and wait ~2 minutes ⏱️

8. **Copy your URL** when deployment completes! 🎉
   - Will look like: `https://gem-tracker-api-xxxx.vercel.app`

9. **Add PUBLIC_URL:**
   - Go to "Settings" → "Environment Variables"
   - Add new variable:
     - Name: `PUBLIC_URL`
     - Value: [Your deployment URL]
     - Environment: Production ✓
   - Go to "Deployments" → Click "..." → "Redeploy"

### Option B: CLI (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts, then deploy to production
vercel --prod
```

---

## ✅ Step 4: Test Your Deployment (1 minute)

1. **Open your deployment URL in browser:**

   ```
   https://your-url.vercel.app
   ```

   ✅ Should see: **"Gem Tracker API is running..."**

2. **Test an endpoint:**

   ```
   https://your-url.vercel.app/api/auth/login
   ```

   ✅ Should see an error about missing credentials (this is normal!)

---

## 🎯 What You've Accomplished

✅ Domain hosted on Vercel's global edge network  
✅ Database in MongoDB Atlas with automatic backups  
✅ HTTPS/SSL encryption enabled  
✅ Auto-scaling serverless functions  
✅ Automatic deployments on git push  
✅ Environment variables securely stored

---

## 📝 Save These URLs

**Repository:** https://github.com/Sandaru-Shashinda/gem_tracker_api  
**API URL:** **********\*\***********\_\_\_**********\*\***********  
**Vercel Dashboard:** https://vercel.com/dashboard  
**MongoDB Atlas:** https://cloud.mongodb.com

---

## 🔄 Future Deployments

Every time you push to GitHub, Vercel automatically deploys! 🚀

```bash
git add .
git commit -m "Your changes"
git push origin main
```

---

## 📚 Need More Help?

- **Detailed Guide:** See `DEPLOYMENT_GUIDE.md`
- **Checklist:** See `DEPLOYMENT_CHECKLIST.md`
- **Architecture:** See `ARCHITECTURE.md`
- **Environment Vars:** See `ENV_VARIABLES.md`

---

## 🎉 You're Ready to Deploy!

All files are prepared and pushed to GitHub.  
Just follow the steps above to go live! ✨
