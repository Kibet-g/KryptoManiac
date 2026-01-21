# ML Backend Deployment Guide 🚀

## Option 1: Render.com (Recommended - Free & Easy)

### Why Render?
- ✅ Free tier available (750 hours/month)
- ✅ Native Python/FastAPI support
- ✅ Auto-deploy from GitHub
- ✅ Free HTTPS/SSL
- ✅ Zero config needed

### Step-by-Step Deployment

#### 1. Prepare Your Code

The backend is already configured with:
- `requirements.txt` - All dependencies listed
- `Dockerfile` - Container configuration
- FastAPI app structure

#### 2. Create Render Account

1. Go to https://render.com
2. Sign up with GitHub (use the same account where CryptoManiac is hosted)
3. Authorize Render to access your repositories

#### 3. Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your **CryptoManiac** repository
3. Configure the service:

```
Name: cryptomaniac-ml-backend
Region: Choose closest to your users
Branch: main
Root Directory: ml-backend
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

#### 4. Set Environment Variables

In Render dashboard, add these environment variables:

```bash
# Required
PYTHON_VERSION=3.11
ALLOWED_ORIGINS=https://kryptomaniaac.netlify.app

# Optional (if you have a Binance affiliate ID)
BINANCE_AFFILIATE_ID=your_affiliate_id_here
```

#### 5. Deploy!

1. Click **"Create Web Service"**
2. Render will:
   - Clone your repo
   - Install dependencies
   - Start the server
   - Give you a URL like: `https://cryptomaniac-ml-backend.onrender.com`

⏱️ First deployment takes ~5-10 minutes

#### 6. Update Frontend

Once deployed, update your Netlify environment variables:

1. Go to Netlify Dashboard → Your Site → Site Configuration → Environment Variables
2. Update:
   ```
   REACT_APP_ML_API_URL=https://cryptomaniac-ml-backend.onrender.com
   REACT_APP_WS_URL=wss://cryptomaniac-ml-backend.onrender.com
   ```
3. Trigger a redeploy

#### 7. Test Your Backend

Visit: `https://cryptomaniac-ml-backend.onrender.com/docs`

You should see the interactive Swagger API documentation!

### Important Notes

⚠️ **Free Tier Limitations:**
- Service spins down after 15 minutes of inactivity
- First request after idle takes ~30 seconds to wake up
- 750 hours/month free (enough for moderate usage)

💡 **To keep it always active:** Upgrade to paid tier ($7/month) or use a service like [UptimeRobot](https://uptimerobot.com/) to ping your API every 10 minutes.

---

## Option 2: Railway.app (Alternative)

### Pros:
- $5 free credit/month
- Faster cold starts
- Better for WebSocket connections

### Quick Deploy:

1. Go to https://railway.app
2. Sign in with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select **CryptoManiac** repository
5. Set root directory to `ml-backend`
6. Railway auto-detects Python and deploys!

Add environment variables in Railway dashboard, similar to Render.

---

## Option 3: Fly.io (Advanced)

Good for global distribution, but requires CLI setup.

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Deploy (from ml-backend folder)
cd ml-backend
fly launch
```

---

## Troubleshooting

### Build Fails
- Check Python version is 3.9+ in Render settings
- Ensure `requirements.txt` is in `ml-backend/` folder

### CORS Errors
- Verify `ALLOWED_ORIGINS` environment variable includes your Netlify URL
- Check FastAPI CORS middleware in `app/main.py`

### WebSocket Not Working
- Ensure `REACT_APP_WS_URL` uses `wss://` (not `ws://`)
- Free tier on some platforms may not support WebSockets

---

## Next Steps After Deployment

1. ✅ Test all API endpoints via `/docs`
2. ✅ Update Netlify environment variables
3. ✅ Redeploy frontend
4. ✅ Test live price ticker and AI predictions on your site
5. 🎉 Your full-stack app is live!

---

**Need Help?** Check the logs in your Render/Railway dashboard if anything goes wrong.
