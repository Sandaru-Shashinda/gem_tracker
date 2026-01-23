---
description: How to deploy the Gem Tracker application to Vercel
---

This project contains both a frontend (Vite) and a backend (Node/Express). Both can be deployed to Vercel.

### Prerequisites

- [Vercel account](https://vercel.com)
- [Vercel CLI](https://vercel.com/download) installed locally: `npm install -g vercel`

### Deployment Steps

#### 1. Deploy the Backend

1. Navigate to the backend directory: `cd gem-tracker-api`
2. Run `vercel` and follow the prompts.
3. When prompted for environment variables, add:
   - `MONGO_URI`: Your MongoDB connection string (e.g., from MongoDB Atlas)
   - `JWT_SECRET`: A secure random string
   - `PUBLIC_URL`: The URL provided by Vercel after deployment
4. Once deployed, note the production URL of your backend.

#### 2. Deploy the Frontend

1. Navigate to the frontend directory: `cd gem-tracker`
2. Run `vercel` and follow the prompts.
3. When prompted for environment variables, add:
   - `VITE_API_BASE_URL`: The production URL of your backend followed by `/api` (e.g., `https://your-api.vercel.app/api`)
4. Once deployed, your frontend will be live!

### Alternative: GitHub Integration (Recommended)

1. Project is already in Git. Ensure all changes are committed and pushed:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click "Add New" -> "Project".
3. Import your GitHub repository.
4. **For the Backend**:
   - Set "Root Directory" to `gem-tracker-api`.
   - Set Framework Preset to "Other" (it will use the `vercel.json` provided).
   - Add environment variables (`MONGO_URI`, `JWT_SECRET`).
5. **For the Frontend**:
   - Set "Root Directory" to `gem-tracker`.
   - Set Framework Preset to "Vite".
   - Add environment variables (`VITE_API_BASE_URL`).
