# ML Backend Deployment Guide 🚀

## 🆓 100% FREE Deployment Options

All options below are **completely free** - no credit card required!

---

## Option 1: Render.com ⭐ RECOMMENDED

### Why Render?
- ✅ **100% FREE** (no credit card needed)
- ✅ 750 free hours/month (enough for 24/7)
- ✅ Native Python/FastAPI support
- ✅ Auto-deploy from GitHub
- ✅ Free HTTPS/SSL included
- ✅ Zero configuration needed

### How the Free Tier Works
- Your backend runs **completely free**
- Sleeps after 15 minutes of no requests
- Wakes up automatically on first request (~30 seconds)
- **Perfect for this project!**

### Step-by-Step Deployment

#### 1. Create Render Account (FREE)

1. Go to https://render.com
2. Click **"Get Started for Free"**
3. Sign up with your **GitHub account** (same one with CryptoManiac)
4. Authorize Render to access your repositories
5. **No credit card required!**

#### 2. Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Select your **CryptoManiac** repository
3. Fill in these settings:

```
Name: cryptomaniac-ml-backend
Region: Oregon (or closest to you)
Branch: main
Root Directory: ml-backend
Runtime: Python 3
Instance Type: FREE
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

#### 3. Environment Variables (Optional)

Click **"Advanced"** and add:

```bash
PYTHON_VERSION=3.11
```

**That's it!** No other variables needed for basic functionality.

#### 5. Deploy!

1. Click **"Create Web Service"**
2. Render will:
   - Clone your repo
   - Install dependencies
   - Start the server
   - Give you a URL like: `https://cryptomaniac-ml-backend.onrender.com`

---

## Option 2: Koyeb 🚀 (Better Always-On)

### Why Koyeb?
- ✅ **100% FREE** (no credit card)
- ✅ Stays awake longer (fewer cold starts)
- ✅ Better WebSocket support
- ✅ Auto-deploy from GitHub
- ✅ Free SSL included

### Quick Deploy

1. Go to https://koyeb.com
2. Sign up with GitHub (FREE, no credit card)
3. Click **"Create App"** → **"Deploy from GitHub"**
4. Select **CryptoManiac** repository
5. Configure:
   ```
   Name: cryptomaniac-ml-backend
   Branch: main
   Root: ml-backend
   Build command: pip install -r requirements.txt
   Run command: uvicorn app.main:app --host 0.0.0.0 --port 8000
   Port: 8000
   Instance type: Free (Nano)
   ```
6. Click **"Deploy"**

---

## Which One Should You Choose?

| Feature | Render.com | Koyeb |
|---------|------------|-------|
| **Cost** | FREE | FREE |
| **Ease of Use** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Cold Starts** | ~30 sec | ~20 sec |
| **Sleep After** | 15 min | Less frequent |
| **WebSocket** | ✅ Good | ✅ Better |
| **Popularity** | Very Popular | Growing |

**Recommendation:** Start with **Render** (easier), switch to **Koyeb** if you need better always-on performance.

---

## After Deployment (Both Platforms)

### 1. Get Your Backend URL

After deployment completes, you'll get a URL like:
- Render: `https://cryptomaniac-ml-backend.onrender.com`
- Koyeb: `https://cryptomaniac-ml-backend-yourapp.koyeb.app`

### 2. Test Your Backend

Visit: `https://your-backend-url/docs`

You should see interactive API documentation with all these endpoints:
- `/health` - Health check
- `/api/v1/predict/{symbol}` - Price predictions
- `/api/v1/signals/{symbol}` - Trading signals
- `/api/v1/alerts/{symbol}` - Market alerts
- `/ws/{symbol}` - WebSocket real-time streaming

### 3. Update Frontend (Netlify)

1. Go to **Netlify Dashboard** → Your Site
2. Click **Site Configuration** → **Environment Variables**
3. Update these variables:
   ```
   REACT_APP_ML_API_URL = https://your-backend-url
   REACT_APP_WS_URL = wss://your-backend-url
   ```
4. Click **"Save"**
5. Go to **Deploys** → **Trigger Deploy** → **Deploy site**

### 4. Test Your Live App! 🎉

After Netlify redeploys (2-3 minutes), visit your site:
- **Live Price Ticker** should show real streaming prices
- **AI Prediction Card** should show actual ML predictions
- **Whale Watch** should show real blockchain data
- No more "using fallback data" messages!

---

## 💡 Pro Tips for Free Tier

### Keep Backend Awake (Optional)

Use **UptimeRobot** (also free!) to ping your backend every 5 minutes:

1. Go to https://uptimerobot.com (FREE)
2. Create account
3. Add new monitor:
   - Type: HTTP(s)
   - URL: `https://your-backend-url/health`
   - Interval: 5 minutes
4. Your backend will never sleep! ✅

### Monitor Your Backend

Both platforms provide:
- Real-time logs
- Deployment history
- Performance metrics
- Error tracking

Check the logs if anything goes wrong!

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
