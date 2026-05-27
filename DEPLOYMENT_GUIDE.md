# Production Deployment Guide

This guide will help you deploy your Funkustoms application to production using Render or Railway.

## Overview

Your application consists of two parts:
- **Frontend**: React + TypeScript + Vite (deployed to static hosting)
- **Backend**: Node.js + Express + Firebase (deployed to serverless/container platform)

## Environment Variables Required

### Backend Environment Variables

These need to be set on your hosting platform:

```
PORT=5000
FIREBASE_PROJECT_ID=funkustom
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-m5zaz@funkustom.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...your-key...\n-----END PRIVATE KEY-----\n
JWT_SECRET=your-secure-random-string
NODE_ENV=production
```

⚠️ **NEVER commit these to Git. Use platform environment variables instead.**

---

## Option 1: Deploy to Render (Recommended)

Render offers free tier options and is beginner-friendly.

### For Backend (Node.js Server)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub account

2. **Connect Your Repository**
   - In Render dashboard, click "New +"
   - Select "Web Service"
   - Connect your GitHub repository

3. **Configure Service**
   - **Name**: `funkustoms-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Instance Type**: Free (or Paid for better performance)

4. **Add Environment Variables**
   - Go to "Environment" tab
   - Add all environment variables listed above
   - For `FIREBASE_PRIVATE_KEY`, paste the full private key with proper escaping

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy when you push to GitHub

6. **Get Backend URL**
   - Once deployed, you'll get a URL like: `https://funkustoms-backend.onrender.com`
   - Update your frontend to use this URL

### For Frontend (React App)

1. **Build the App**
   ```bash
   npm run build
   ```

2. **Deploy to Render**
   - Create another service as Static Site
   - Connect GitHub repo
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

3. **Configure API Endpoint**
   - Create `.env.production` file:
   ```
   VITE_API_URL=https://funkustoms-backend.onrender.com
   ```
   - Update frontend API calls to use this environment variable

---

## Option 2: Deploy to Railway

Railway is another great option with a generous free tier.

### For Backend

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository

3. **Configure**
   - Set working directory to `server`
   - Add environment variables in "Variables" tab
   - Raw editor format:
   ```
   PORT=5000
   FIREBASE_PROJECT_ID=funkustom
   FIREBASE_CLIENT_EMAIL=your-email
   FIREBASE_PRIVATE_KEY="your-key"
   JWT_SECRET=your-secret
   NODE_ENV=production
   ```

4. **Deploy**
   - Railway auto-deploys on push to main branch
   - Get your API URL from Railway dashboard

### For Frontend

1. **Build & Deploy**
   - Create new Railway service
   - Deploy `dist` folder
   - Or deploy from GitHub with build command: `npm run build`

---

## Option 3: Deploy to Heroku

> Note: Heroku free tier was discontinued. Consider Render or Railway instead.

If you still want to use Heroku (paid):
- Use [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- Follow similar environment variable setup as above

---

## Updating Firestore Security Rules

1. **Open Firebase Console**
   - Go to [console.firebase.google.com](https://console.firebase.google.com)
   - Select your project

2. **Deploy Rules**
   - Go to "Firestore Database" → "Rules" tab
   - Replace test rules with production rules:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Your rules from firestore.rules file
     }
   }
   ```

3. **Or Use Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase deploy --only firestore:rules
   ```

---

## Update Frontend API Configuration

Update your frontend to use production API URL:

**File**: `src/services/api.ts`
```typescript
const API_URL = process.env.VITE_API_URL || 'http://localhost:5000';
// Use API_URL for all axios calls
```

---

## Database Scaling (Production)

If you expect high traffic:

1. **Enable Firestore scalability**
   - Go to Firestore settings
   - Increase read/write capacity

2. **Add indexes** (Firestore will suggest them)
   - As you query, Firestore suggests composite indexes
   - Add them in "Composite Indexes" tab

3. **Enable CDN** for static assets
   - Use Render or Railway CDN features

---

## Environment Variable Checklist

Before deploying, ensure you have:

- [ ] `FIREBASE_PROJECT_ID` - from Firebase console
- [ ] `FIREBASE_CLIENT_EMAIL` - from service account JSON
- [ ] `FIREBASE_PRIVATE_KEY` - from service account JSON (with proper escaping)
- [ ] `JWT_SECRET` - strong random string (use generator if needed)
- [ ] `NODE_ENV` - set to `production`
- [ ] `PORT` - set to `5000` (or your hosting platform's port)

---

## Troubleshooting

### Backend not starting
- Check all environment variables are set correctly
- Check Firebase credentials format
- View logs in hosting platform dashboard

### Frontend can't connect to API
- Ensure backend URL is correct in frontend `.env.production`
- Check CORS settings on backend
- Verify backend is running

### Firestore permission errors
- Update security rules in Firebase console
- Check user authentication is working
- Verify user roles are set correctly

---

## Next Steps

1. Choose your deployment platform (Render or Railway recommended)
2. Set up repositories on GitHub
3. Deploy backend first, get the URL
4. Update frontend to use backend URL
5. Deploy frontend
6. Update Firestore security rules
7. Test the complete application

Need help? Check platform-specific documentation:
- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Firebase Docs](https://firebase.google.com/docs)
