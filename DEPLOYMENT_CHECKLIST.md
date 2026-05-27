# Deployment Checklist

Use this checklist to ensure everything is ready before deploying to production.

## Pre-Deployment ✅

### Security & Environment
- [ ] Firebase credentials are in `.env.firebase.json` (NOT in `.env` or committed to Git)
- [ ] All sensitive files are in `.gitignore` (`.env`, `.env.firebase.json`, etc.)
- [ ] JWT_SECRET is a strong random string (changed from default)
- [ ] `NODE_ENV` is set to `production`
- [ ] Repository is pushed to GitHub

### Firebase Configuration
- [ ] Firestore Database is created
- [ ] Security rules are updated from test mode to production rules
- [ ] Indexes are created (Firestore will suggest if needed)
- [ ] Authentication is enabled

### Frontend Build
- [ ] Run `npm run build` and verify `dist` folder is created
- [ ] No build errors or warnings
- [ ] Bundle size is reasonable (~500KB is acceptable, but optimize if larger)
- [ ] `.env.production` has correct `VITE_API_BASE_URL`

### Backend Configuration
- [ ] `server/.env` has all required variables
- [ ] Firebase credentials are correct (tested with running `npm start`)
- [ ] Server starts without errors
- [ ] Health check endpoint responds: `http://localhost:5000/api/health`
- [ ] All routes are tested locally

## Deployment Steps

### Option A: Deploy to Render (Recommended)

**Backend:**
- [ ] Create Render account and connect GitHub
- [ ] Create new Web Service
- [ ] Set build command: `cd server && npm install`
- [ ] Set start command: `cd server && npm start`
- [ ] Add environment variables:
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY`
  - `JWT_SECRET`
  - `NODE_ENV=production`
- [ ] Deploy and wait for build to complete
- [ ] Test backend URL (e.g., `https://your-backend.onrender.com/api/health`)
- [ ] Copy backend URL

**Frontend:**
- [ ] Create new Static Site service
- [ ] Set build command: `npm run build`
- [ ] Set publish directory: `dist`
- [ ] Add environment variable: `VITE_API_BASE_URL=https://your-backend.onrender.com/api`
- [ ] Deploy and wait for build to complete
- [ ] Test frontend URL and verify it can connect to backend

### Option B: Deploy to Railway

**Backend:**
- [ ] Create Railway account and connect GitHub
- [ ] Create new Project from GitHub repo
- [ ] Set working directory: `server`
- [ ] Add environment variables (same as above)
- [ ] Deploy (auto-deploys on push)
- [ ] Get backend URL from Railway dashboard
- [ ] Test health check endpoint

**Frontend:**
- [ ] Create new service for frontend
- [ ] Build and deploy `dist` folder
- [ ] Add `VITE_API_BASE_URL` environment variable
- [ ] Deploy

## Post-Deployment Testing

### API Endpoints
- [ ] Health check: `GET /api/health` returns 200
- [ ] User registration: `POST /api/auth/register` works
- [ ] User login: `POST /api/auth/login` works
- [ ] Get products: `GET /api/products` returns products
- [ ] Create order: `POST /api/orders` works (authenticated)

### Frontend Features
- [ ] Login page loads
- [ ] Can log in with test credentials
- [ ] Dashboard displays
- [ ] Can browse products
- [ ] Can add to cart
- [ ] Can proceed to checkout

### Database
- [ ] New users are created in Firestore
- [ ] Products are retrievable
- [ ] Orders are saved
- [ ] User permissions work correctly

## Firestore Security Rules Deployment

- [ ] Security rules file (`firestore.rules`) is updated
- [ ] Go to Firebase Console → Firestore → Rules
- [ ] Replace test rules with production rules from `firestore.rules`
- [ ] Click "Publish"
- [ ] Verify rules are deployed (shows "Rules deployed" message)

## Monitoring & Maintenance

After deployment, set up monitoring:

- [ ] Set up error tracking (Firebase Cloud Logging)
- [ ] Monitor API usage in Firebase Console
- [ ] Set up uptime monitoring (UptimeRobot.com)
- [ ] Create backup schedule for Firestore (in Firebase Console)
- [ ] Monitor bundle size (should stay < 1MB gzipped)

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Backend won't start | Check Firebase credentials in environment variables |
| Frontend can't connect to API | Verify `VITE_API_BASE_URL` in .env.production |
| CORS errors | Ensure CORS is enabled on backend in `server.js` |
| Firestore permission errors | Update security rules and verify user authentication |
| Old version still showing | Clear browser cache or use hard refresh (Ctrl+Shift+R) |

## Rollback Plan

If something goes wrong:
1. Keep your previous working version on a separate branch
2. Revert changes in your hosting platform
3. Check logs for error details
4. Fix issue locally and re-deploy

## Deployment Complete! 🎉

Your application is now live. Share your URL and enjoy!

For ongoing maintenance:
- [ ] Set up GitHub Actions for CI/CD (optional but recommended)
- [ ] Monitor Firebase usage and costs
- [ ] Regular database backups
- [ ] Update dependencies periodically
