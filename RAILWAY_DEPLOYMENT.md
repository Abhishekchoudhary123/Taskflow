# 🚂 Railway Deployment Guide for TaskFlow

## 📋 Prerequisites

- ✅ GitHub account with your code pushed
- ✅ Railway account (sign up at https://railway.app)
- ✅ MongoDB Atlas account (or use Railway's MongoDB plugin)

---

## 🎯 Deployment Steps

### **Part 1: Deploy Backend on Railway**

#### Step 1: Create Railway Account
1. Go to https://railway.app
2. Click "Login" or "Start a New Project"
3. Sign in with GitHub (recommended)
4. Authorize Railway to access your repositories

#### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository: `Abhishekchoudhary123/Taskflow`
4. Railway will detect your project

#### Step 3: Configure Backend Service
1. Railway will create a service automatically
2. Click on the service to configure it

#### Step 4: Set Root Directory (Important!)
1. Go to **Settings** tab
2. Find **"Root Directory"** or **"Source"**
3. Set it to: `backend`
4. This tells Railway to deploy only the backend folder

#### Step 5: Configure Build & Start Commands
1. In **Settings** → **Deploy**
2. **Build Command**: `npm install`
3. **Start Command**: `npm start`
4. Or leave empty (Railway auto-detects from package.json)

#### Step 6: Add Environment Variables
1. Go to **Variables** tab
2. Click "New Variable" and add these one by one:

```
MONGODB_URI=mongodb+srv://abhishekchoudhary9402:vkCC57cncxgbgHKP@cluster0.49berup.mongodb.net/taskmanager?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=taskflow_super_secret_key_2025_production

PORT=5000

NODE_ENV=production

CLIENT_URL=https://your-frontend-url.vercel.app
```

**Note**: You'll update `CLIENT_URL` after deploying the frontend

#### Step 7: Deploy Backend
1. Click "Deploy" or it will auto-deploy
2. Wait for deployment to complete (2-3 minutes)
3. Check the **Deployments** tab for status
4. Once deployed, you'll see a green checkmark ✅

#### Step 8: Get Backend URL
1. Go to **Settings** tab
2. Find **"Domains"** section
3. Click "Generate Domain"
4. Copy the URL (e.g., `https://taskflow-production.up.railway.app`)
5. **Save this URL** - you'll need it for the frontend!

#### Step 9: Test Backend
1. Open the backend URL in browser
2. Add `/health` to the URL
3. You should see: `{"status":"ok"}`
4. If you see this, backend is working! ✅

---

### **Part 2: Deploy Frontend on Vercel (Recommended)**

#### Why Vercel for Frontend?
- ✅ Free tier is generous
- ✅ Automatic deployments from GitHub
- ✅ Perfect for React/Vite apps
- ✅ Built-in CDN and SSL

#### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up"
3. Sign in with GitHub

#### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Import your GitHub repository: `Taskflow`
3. Vercel will detect it's a Vite project

#### Step 3: Configure Build Settings
1. **Framework Preset**: Vite
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

#### Step 4: Add Environment Variable
1. Go to "Environment Variables" section
2. Add this variable:

```
Name: VITE_API_URL
Value: https://your-backend-url.up.railway.app/api
```

Replace with your actual Railway backend URL from Part 1, Step 8

#### Step 5: Deploy Frontend
1. Click "Deploy"
2. Wait 2-3 minutes for build and deployment
3. You'll get a URL like: `https://taskflow-xyz.vercel.app`

#### Step 6: Update Backend CORS
1. Go back to Railway
2. Go to your backend service → **Variables**
3. Update `CLIENT_URL` variable:
```
CLIENT_URL=https://taskflow-xyz.vercel.app
```
4. Replace with your actual Vercel URL
5. Backend will auto-redeploy

---

### **Part 3: Update Frontend API Configuration**

You need to update the frontend to use the Railway backend URL:

#### Option A: Using Environment Variable (Recommended)
1. The frontend is already configured to use proxy in development
2. For production, update `frontend/src/api/axios.js`:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Rest of the code stays the same
```

#### Option B: Direct URL (Quick Fix)
Update `frontend/src/api/axios.js`:

```javascript
const api = axios.create({
  baseURL: 'https://your-backend-url.up.railway.app/api',
});
```

Then commit and push:
```bash
git add .
git commit -m "Update API URL for production"
git push
```

Vercel will auto-deploy the changes!

---

## 🔧 Alternative: Deploy Frontend on Railway Too

If you want both on Railway:

#### Step 1: Add Frontend Service
1. In your Railway project, click "New Service"
2. Select "GitHub Repo" → Choose same repository
3. Name it "frontend"

#### Step 2: Configure Frontend Service
1. **Root Directory**: `frontend`
2. **Build Command**: `npm run build && npm install -g serve`
3. **Start Command**: `serve -s dist -l $PORT`

#### Step 3: Add Environment Variable
```
VITE_API_URL=https://your-backend-url.up.railway.app/api
```

#### Step 4: Generate Domain
1. Go to Settings → Domains
2. Generate domain for frontend
3. Update backend's `CLIENT_URL` with this new frontend URL

---

## 🗄️ Alternative: Use Railway's MongoDB Plugin

Instead of MongoDB Atlas, you can use Railway's built-in MongoDB:

#### Step 1: Add MongoDB Plugin
1. In your Railway project, click "New"
2. Select "Database" → "Add MongoDB"
3. Railway will create a MongoDB instance

#### Step 2: Get Connection String
1. Click on the MongoDB service
2. Go to "Connect" tab
3. Copy the connection string
4. It looks like: `mongodb://mongo:password@mongodb.railway.internal:27017`

#### Step 3: Update Backend Variable
1. Go to backend service → Variables
2. Update `MONGODB_URI` with the Railway MongoDB URL

---

## ✅ Verification Checklist

After deployment, verify everything works:

### Backend Checks:
- [ ] Backend URL is accessible
- [ ] `/health` endpoint returns `{"status":"ok"}`
- [ ] `/api/auth/login` endpoint exists (returns 400 without credentials)
- [ ] MongoDB connection is successful (check logs)

### Frontend Checks:
- [ ] Frontend URL loads the landing page
- [ ] Can navigate to login/register pages
- [ ] Can register a new account
- [ ] Can login successfully
- [ ] Dashboard loads after login
- [ ] Can create projects (admin)
- [ ] Can create tasks (admin)

### Integration Checks:
- [ ] Frontend can communicate with backend
- [ ] No CORS errors in browser console
- [ ] Authentication works end-to-end
- [ ] Data persists in MongoDB

---

## 🐛 Troubleshooting

### Issue: "Application failed to respond"
**Solution**: 
- Check if `PORT` environment variable is set
- Ensure start command is correct: `npm start`
- Check Railway logs for errors

### Issue: "CORS Error"
**Solution**:
- Verify `CLIENT_URL` in backend matches frontend URL exactly
- No trailing slash in URLs
- Redeploy backend after changing `CLIENT_URL`

### Issue: "Cannot connect to MongoDB"
**Solution**:
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist (allow all: 0.0.0.0/0)
- Ensure MongoDB user has correct permissions

### Issue: "API calls return 404"
**Solution**:
- Check `VITE_API_URL` includes `/api` at the end
- Verify backend routes are working
- Check browser network tab for actual URL being called

### Issue: "Build fails on Railway"
**Solution**:
- Ensure `package.json` has all dependencies
- Check Node version compatibility
- Verify root directory is set correctly

### Issue: "Frontend shows blank page"
**Solution**:
- Check browser console for errors
- Verify build completed successfully
- Check if API URL is correct

---

## 📊 Monitoring & Logs

### View Railway Logs:
1. Go to your service in Railway
2. Click "Deployments" tab
3. Click on latest deployment
4. View "Build Logs" and "Deploy Logs"

### View Vercel Logs:
1. Go to your project in Vercel
2. Click "Deployments"
3. Click on latest deployment
4. View "Build Logs" and "Runtime Logs"

---

## 💰 Cost Estimate

### Railway:
- **Free Tier**: $5 credit/month (enough for small projects)
- **Hobby Plan**: $5/month (500 hours)
- **Pro Plan**: $20/month (unlimited)

### Vercel:
- **Free Tier**: Unlimited personal projects
- **Pro Plan**: $20/month (for teams)

### MongoDB Atlas:
- **Free Tier**: 512MB storage (perfect for testing)
- **Shared**: $9/month (2GB storage)

**Total for Free Tier**: $0/month! 🎉

---

## 🔄 Continuous Deployment

Both Railway and Vercel support automatic deployments:

### Automatic Deployments:
1. Push code to GitHub
2. Railway auto-deploys backend
3. Vercel auto-deploys frontend
4. Changes go live in 2-3 minutes!

### Manual Deployments:
- Railway: Click "Deploy" button
- Vercel: Click "Redeploy" button

---

## 🎯 Quick Reference

### Backend URL Format:
```
https://taskflow-production.up.railway.app
```

### Frontend URL Format (Vercel):
```
https://taskflow-xyz.vercel.app
```

### Environment Variables Summary:

**Backend (Railway):**
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.vercel.app
```

**Frontend (Vercel):**
```
VITE_API_URL=https://your-backend-url.up.railway.app/api
```

---

## 📞 Support

### Railway Support:
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Twitter: @Railway

### Vercel Support:
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord
- Twitter: @vercel

---

## 🎉 Success!

Once deployed, your TaskFlow application will be:
- ✅ Live and accessible worldwide
- ✅ Automatically backed up
- ✅ SSL/HTTPS enabled
- ✅ Auto-scaling ready
- ✅ Continuously deployed from GitHub

**Share your live URL with the world!** 🚀

---

## 📝 Post-Deployment Tasks

1. [ ] Test all features in production
2. [ ] Set up custom domain (optional)
3. [ ] Configure monitoring/alerts
4. [ ] Set up error tracking (Sentry)
5. [ ] Add analytics (Google Analytics)
6. [ ] Update README with live URLs
7. [ ] Share on social media!

---

**Deployment Date**: _____________  
**Backend URL**: _____________  
**Frontend URL**: _____________  
**Status**: 🟢 Live

---

Good luck with your deployment! 🚀
