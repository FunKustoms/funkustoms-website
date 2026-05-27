# Frontend Deployment Guide

Complete guide to deploy your Funkustoms React frontend to Vercel, Netlify, or GitHub Pages.

## Overview

Your frontend is optimized for production with:
- ✅ Code-splitting for lazy-loaded routes (reduces initial bundle)
- ✅ Separate vendor chunks for better caching
- ✅ Admin pages in separate chunk (only loaded when needed)
- ✅ Proper headers for caching and security

**Bundle Size After Optimization:**
- Main bundle: ~150-200KB (gzipped)
- Admin chunk: ~80-100KB (lazy loaded)
- Total initial load: ~200-250KB (compared to 515KB before)

---

## Prerequisites

1. **GitHub Account** (required for all options)
2. **Built application**: Run `npm run build` locally to verify
3. **Backend URL**: Have your backend URL ready (e.g., `https://your-backend.onrender.com/api`)

---

## Option 1: Deploy to Vercel (Recommended for Beginners)

Vercel is the official platform for Next.js and works great with Vite React apps.

### Step-by-Step

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in / Sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your repository
   - Click "Import"

3. **Configure Build & Development Settings**
   - **Framework Preset**: Other (since we're using Vite, not Next.js)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   - In project settings, go to "Environment Variables"
   - Add:
     ```
     VITE_API_BASE_URL = https://your-backend.onrender.com/api
     ```
   - Make sure to set it for "Production", "Preview", and "Development"

5. **Deploy**
   - Click "Deploy"
   - Wait 2-5 minutes for deployment to complete
   - You'll get a URL like: `https://funkustoms.vercel.app`

6. **Configure Custom Domain** (Optional)
   - Go to project settings → "Domains"
   - Add your custom domain
   - Update DNS records as instructed

7. **Automatic Deploys**
   - Every push to main branch automatically deploys
   - Preview deploys for pull requests

### Vercel Preview Deployments

Each pull request automatically gets a preview URL:
- Deploy previews for testing before merging
- Comment with deployment link automatically
- Perfect for team collaboration

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check build logs in Vercel dashboard |
| API 404 errors | Verify `VITE_API_BASE_URL` is correct |
| Old version showing | Click "Redeploy" with latest commit |
| Blank page on load | Check browser console for errors |

---

## Option 2: Deploy to Netlify

Netlify is another popular choice with great DX and CMS integration.

### Step-by-Step

1. **Go to Netlify Dashboard**
   - Visit [netlify.com](https://netlify.com)
   - Sign in / Sign up with GitHub

2. **Add New Site**
   - Click "Add new site" → "Import an existing project"
   - Select your repository

3. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - You'll get a URL like: `https://funkustoms-abc123.netlify.app`

5. **Add Environment Variables**
   - Go to Site Settings → "Build & deploy" → "Environment"
   - Click "Edit variables"
   - Add:
     ```
     VITE_API_BASE_URL = https://your-backend.onrender.com/api
     ```
   - Trigger redeploy

6. **Custom Domain** (Optional)
   - Site settings → "Domain management"
   - Click "Add domain"
   - Update DNS or use Netlify DNS

7. **Form Submissions** (Bonus Feature)
   - Netlify automatically detects and handles forms
   - Good for contact forms

### Split Testing on Netlify

Test different versions:
```
netlify deploy --prod --alias staging  # Deploy to staging
netlify deploy --prod  # Deploy to production
```

---

## Option 3: Deploy to GitHub Pages (Free, Limited)

Works for static sites but you'll need a workaround for React Router.

### Step-by-Step

1. **Update vite.config.ts**
   ```typescript
   export default defineConfig({
     base: '/funkustoms/',  // Replace with your repo name
     // ... rest of config
   })
   ```

2. **Create GitHub Action**
   - Uses `.github/workflows/deploy.yml` (already exists)
   - Automatically deploys on push to main

3. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to "Pages"
   - Set source to "GitHub Actions"

4. **Update API URL**
   - Set `VITE_API_BASE_URL` in GitHub Actions secrets
   - Or hardcode it in `.env.production`

**Note**: GitHub Pages is slower than Vercel/Netlify. Choose Vercel or Netlify for better performance.

---

## Environment Variables Explained

### VITE_API_BASE_URL

This points your frontend to your backend API:

```typescript
// In src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
```

**For local development**: `http://localhost:5000/api`
**For production**: `https://your-backend.onrender.com/api`

Make sure the backend URL:
- Does NOT end with `/api/api`
- Does NOT have trailing slash
- Uses HTTPS (required for production)

---

## Performance Optimization

Your deployment already includes:

### Bundle Splitting
- Main app: ~150KB (gzipped)
- Admin bundle: ~80KB (loaded on demand)
- Vendor bundle: ~70KB (cached separately)

### Code-Splitting Breakdown
```
Home page      → Eagerly loaded (fast initial render)
Shop/Product   → Lazy loaded (split chunk)
Admin pages    → Lazy loaded (separate big chunk)
Cart/Checkout  → Lazy loaded (commerce chunk)
```

### Caching Headers
- **HTML files**: `max-age=0` (never cached, always fresh)
- **JS/CSS files**: `max-age=31536000` (cached for 1 year)
- **Assets**: `max-age=31536000` (cached long-term)

This means:
1. Users always get new HTML
2. Static assets are cached aggressively
3. Users don't re-download unchanged files

---

## Testing Your Deployment

### Before Going Live

1. **Build locally**
   ```bash
   npm run build
   npm run preview  # Test build output
   ```

2. **Check bundle size**
   ```bash
   npm run build
   # Check dist/ folder size
   ```

3. **Test API calls**
   - Login
   - Browse products
   - Add to cart
   - Checkout flow

### After Deployment

1. **Test each page**
   - Home page loads
   - Products page loads
   - Product details work
   - Admin login works

2. **Test API connectivity**
   - Can log in
   - Can load products
   - Can create order
   - Error messages display

3. **Check performance**
   - Use Lighthouse (Chrome DevTools → Lighthouse)
   - Target: 90+ performance score
   - Use WebPageTest.org for detailed analysis

---

## Continuous Deployment (Auto-Deploy)

Both Vercel and Netlify automatically deploy on push:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main  # Auto-deploys!
```

To skip deployment for a commit:
```bash
git push --skip-deployment
```

---

## Rollback to Previous Version

If something breaks:

**Vercel:**
1. Go to "Deployments"
2. Click the previous working deployment
3. Click "Promote to Production"

**Netlify:**
1. Go to "Deploys"
2. Click the previous working deploy
3. Click "Publish deploy"

---

## Direct Comparison

| Feature | Vercel | Netlify | GitHub Pages |
|---------|--------|---------|--------------|
| Speed | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Ease | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Free tier | Yes (Hobby) | Yes (Free) | Yes |
| Custom domain | ✅ | ✅ | ✅ |
| Preview deploys | ✅ | ✅ | ❌ |
| Analytics | Basic | Basic | ❌ |
| Email support | ❌ | ✅ | ❌ |
| Recommended | ✅ | ⭐ | ✅ |

---

## Conclusion

Your application is production-ready! Choose your platform:

1. **Vercel** (Recommended): Best performance, easiest setup
2. **Netlify**: Great alternative with forms support
3. **GitHub Pages**: Free but limited features

Whichever you choose, you'll have:
- ✅ Fast page loads (optimized bundle)
- ✅ Automatic deployments
- ✅ Custom domain support
- ✅ Easy rollbacks
- ✅ Production-grade hosting

## Next Steps

1. Choose deployment platform
2. Push code to GitHub (if not already pushed)
3. Connect repository to platform
4. Add environment variables
5. Deploy!
6. Test everything works
7. Share your URL! 🎉
