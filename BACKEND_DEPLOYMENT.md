# Backend Deployment Guide

Complete guide to deploy your Funkustoms Express.js backend to production platforms.

## Overview

Your backend includes:
- ✅ Express.js REST API
- ✅ Firebase Firestore database
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Environment variable management
- ✅ Proper PORT handling for hosting platforms

---

## Prerequisites

1. **GitHub Repository** (required for most platforms)
2. **Firebase Credentials** (already configured in `.env.firebase.json`)
3. **Backend tested locally** (verified with `npm start` in `server/` folder)
4. **API Documentation** (endpoints are ready)

---

## Environment Variables Required

The following must be set on your hosting platform:

```
PORT=5000
FIREBASE_PROJECT_ID=funkustom
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-m5zaz@funkustom.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...full-key...\n-----END PRIVATE KEY-----\n
JWT_SECRET=your-strong-random-secret-key
NODE_ENV=production
```

⚠️ **NEVER commit these to Git**. Set them in platform settings only.

---

## Option 1: Deploy to Render (Recommended)

Render is beginner-friendly with a free tier and automatic GitHub integration.

### Step-by-Step

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub
   - Authorize Render to access your repositories

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Select your GitHub repository
   - Render auto-detects the repo

3. **Configure Service**
   - **Name**: `funkustoms-backend`
   - **Environment**: `Node`
   - **Region**: Select closest to your users
   - **Branch**: `main`
   - **Build Command**: 
     ```bash
     cd server && npm install
     ```
   - **Start Command**: 
     ```bash
     cd server && npm start
     ```
   - **Instance Type**: Select "Free" or paid for better performance

4. **Add Environment Variables**
   - Scroll down to "Environment"
   - Click "Add Environment Variable"
   - Add all variables from the list above
   - For `FIREBASE_PRIVATE_KEY`: Copy the exact key (with `\n` for newlines)

5. **Deploy**
   - Click "Create Web Service"
   - Render builds and deploys automatically
   - Takes 2-5 minutes

6. **Get Your Backend URL**
   - Once deployed (Status: Live), you get URL like:
     ```
     https://funkustoms-backend.onrender.com
     ```
   - Use this as `VITE_API_BASE_URL` on frontend

### Important Notes

- **Free tier**: Service spins down after 15 minutes of inactivity (cold start ~30s)
- **Paid tier**: Always running, faster response times
- **Auto-redeploy**: Updates when you push to GitHub

### Testing

Once deployed:
```bash
curl https://funkustoms-backend.onrender.com/api/health
# Should return: {"status":"Server running"}
```

---

## Option 2: Deploy to Railway

Railway has generous free tier and simple UI.

### Step-by-Step

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Configure**
   - Railway auto-detects Node.js
   - Set working directory: `server`
   - Click "Deploy"

4. **Add Environment Variables**
   - Go to "Variables" tab
   - Click "Raw Editor"
   - Paste:
     ```
     PORT=5000
     FIREBASE_PROJECT_ID=funkustom
     FIREBASE_CLIENT_EMAIL=firebase-adminsdk-m5zaz@funkustom.iam.gserviceaccount.com
     FIREBASE_PRIVATE_KEY="your-private-key"
     JWT_SECRET=your-secret
     NODE_ENV=production
     ```

5. **Get Backend URL**
   - Railway automatically generates a domain
   - Visible in "Deploy" section
   - URL format: `https://project-name-production.railway.app`

### Auto-Deploy

Railway watches main branch and auto-deploys on push.

---

## Option 3: Deploy to Heroku

Heroku's free tier is discontinued, but it's still an option if you want to pay.

### Prerequisites

- Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- Heroku account

### Step-by-Step

1. **Initialize Heroku**
   ```bash
   heroku login
   heroku create funkustoms-backend
   ```

2. **Set Environment Variables**
   ```bash
   heroku config:set PORT=5000
   heroku config:set FIREBASE_PROJECT_ID=funkustom
   heroku config:set FIREBASE_CLIENT_EMAIL=your-email
   heroku config:set FIREBASE_PRIVATE_KEY="your-key"
   heroku config:set JWT_SECRET="your-secret"
   heroku config:set NODE_ENV=production
   ```

3. **Create Procfile in server/ directory**
   ```
   web: node server.js
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **Get URL**
   ```bash
   heroku open  # Opens your app's URL
   ```

---

## Option 4: Deploy to AWS (Advanced)

For production-grade deployment with more control.

### Option A: EC2

1. **Launch EC2 Instance**
   - Amazon Linux 2 or Ubuntu
   - Open ports: 80, 443, 5000

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone Repository**
   ```bash
   git clone your-repo
   cd your-repo/server
   npm install
   ```

4. **Set Environment Variables**
   ```bash
   export FIREBASE_PROJECT_ID=funkustom
   export FIREBASE_CLIENT_EMAIL=...
   export FIREBASE_PRIVATE_KEY=...
   export JWT_SECRET=...
   export NODE_ENV=production
   ```

5. **Start with PM2** (process manager)
   ```bash
   npm install pm2 -g
   pm2 start server.js
   pm2 save  # Restart on reboot
   ```

6. **Set Up Nginx as Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
       }
   }
   ```

### Option B: Lambda + API Gateway

Advanced serverless option (not recommended for continuous processes).

---

## Performance Optimization

### Suggested Settings

1. **Node.js Version**: 20.x (latest LTS)
2. **Memory**: 512MB minimum (can be increased)
3. **CPU**: Varies by platform (Render: 0.5 CPU on free tier)
4. **Timeout**: 30 seconds (adjust if needed)

### Monitoring

Most platforms provide:
- ✅ Real-time logs
- ✅ Error tracking
- ✅ Uptime monitoring
- ✅ Deployment history

---

## Database (Firebase/Firestore)

Your backend uses Firebase Firestore, which is:
- ✅ Hosted by Google
- ✅ No deployment needed
- ✅ Automatic scaling
- ✅ Real-time sync

**No database deployment needed!** Firebase handles everything.

---

## API Endpoints Guide

Your backend exposes these REST endpoints:

### Authentication
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/admin/users
```

### Products
```
GET    /api/products
POST   /api/products (admin only)
PUT    /api/products/:id (admin only)
DELETE /api/products/:id (admin only)
```

### Orders
```
GET    /api/orders
POST   /api/orders
PUT    /api/orders/:id (admin only)
DELETE /api/orders/:id (admin only)
```

### Customizations
```
GET    /api/customizations
POST   /api/customizations
PUT    /api/customizations/:id
DELETE /api/customizations/:id (admin only)
```

### Health Check
```
GET /api/health
```

All endpoints (except health check and register/login) require `Authorization: Bearer <token>` header.

---

## Testing Your Backend

### Locally First
```bash
cd server
npm install
npm start
# Should see: ✓ Firebase initialized for project: funkustom
#           ✓ Server running on port 5000
```

### Test Health Endpoint
```bash
curl http://localhost:5000/api/health
# Response: {"status":"Server running"}
```

### After Deployment

```bash
# Test health check
curl https://your-backend-url.com/api/health

# Test user registration
curl -X POST https://your-backend-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# Test products
curl https://your-backend-url.com/api/products
```

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Build fails | Missing dependencies | Check `server/package.json` |
| Firebase error | Invalid credentials | Verify `.env.firebase.json` in server/ |
| 502 Bad Gateway | Server crashed | Check logs for errors |
| 503 Service Unavailable | Cold start (free tier) | Wait 30s, try again |
| API returns 500 | Database error | Check Firestore rules and permissions |
| CORS errors | Frontend uses different domain | Backend CORS is enabled, check URL |

### View Logs

**Render**: Dashboard → Logs tab
**Railway**: Application → Logs
**Heroku**: `heroku logs --tail`

---

## Security Best Practices

✅ **Done in your setup:**
- Environment variables not in code
- Firebase credentials in separate file
- JWT authentication
- CORS configured
- Role-based access control

⚠️ **For production:**
- [ ] Enable HTTPS (auto on all platforms)
- [ ] Set security headers (CORS, CSP)
- [ ] Rate limiting (add middleware if needed)
- [ ] Input validation (already in routes)
- [ ] Error monitoring (setup Sentry, etc.)

---

## Monitoring & Maintenance

After deployment:

1. **Monitor Errors**
   - Check logs regularly
   - Set up error alerts

2. **Monitor Performance**
   - Response times
   - Database queries
   - Error rates

3. **Update Dependencies**
   ```bash
   npm outdated
   npm update
   git push  # Auto-deploys
   ```

4. **Backup Database**
   - Firebase auto-backs up
   - Can also export/import manually

---

## Rollback

If something breaks:

**Render**:
1. Dashboard → Deployments
2. Click previous working deployment
3. Click "Redeploy"

**Railway**:
1. Deployments tab
2. Select previous successful deployment
3. Click Redeploy

**Heroku**:
```bash
heroku releases
heroku rollback v123  # v number from above
```

---

## Cost Estimate

| Platform | Free Tier | Hobby Tier | Production |
|----------|-----------|-----------|-----------|
| Render | ✅ (cold starts) | $7/mo | $25+/mo |
| Railway | ✅ Limited | Pay as you go | Variable |
| Heroku | ❌ | $5-50/mo | $50+/mo |
| AWS EC2 | ✅ (1 year) | $5-20/mo | $20-100/mo |

**Firebase**: Already configured, minimal cost (free tier generous)

---

## Comparison

| Feature | Render | Railway | Heroku | AWS |
|---------|--------|---------|--------|-----|
| Ease | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| Free tier | ✅ | ✅ | ❌ | ✅ |
| Auto-deploy | ✅ | ✅ | ✅ | ❌ |
| Logs | ✅ | ✅ | ✅ | ✅ |
| Scaling | Auto | Auto | Auto | Manual |
| Uptime | 99.9% | 99.9% | 99.95% | 99.99% |
| Recommended | ✅ | ✅ | ⭐ | Not for beginners |

---

## Deployment Checklist

- [ ] Backend runs locally without errors
- [ ] All environment variables are set
- [ ] Firebase credentials verified
- [ ] Health endpoint responds
- [ ] Platform created and configured
- [ ] Build command set correctly
- [ ] Start command set correctly
- [ ] Environment variables added to platform
- [ ] Deployment complete
- [ ] Backend URL accessible
- [ ] Health endpoint test passes
- [ ] API tests pass
- [ ] Frontend connected to backend
- [ ] Error logging setup
- [ ] Monitoring enabled

---

## Next Steps

1. Choose deployment platform (Render recommended)
2. Follow platform-specific guide above
3. Test all endpoints
4. Monitor logs for errors
5. Update frontend with backend URL
6. Deploy frontend
7. Test complete integration
8. Go live! 🚀

## Support

- **Render Docs**: https://render.com/docs
- **Railway Docs**: https://docs.railway.app
- **Node.js Best Practices**: https://nodejs.org/en/docs/guides/
- **Firebase Docs**: https://firebase.google.com/docs
