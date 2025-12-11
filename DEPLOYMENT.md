# Deployment Guide

## ⚠️ Important: Environment Variables

**You MUST set actual values for these environment variables - placeholders will NOT work:**

- **`MONGODB_URI`**: Your actual MongoDB connection string (from Atlas or hosting platform)
- **`PORT`**: Port number (e.g., `4000`) or let platform auto-assign
- **`JWT_SECRET`**: Generate using `openssl rand -base64 32` (minimum 32 characters)
- **`VITE_API_URL`**: Your actual deployed backend URL (e.g., `https://your-backend.railway.app/api`)
- **`FRONTEND_URL`**: Your actual deployed frontend URL (for CORS)

See the "Environment Variables" section below for detailed instructions.

---

## Quick Deploy Options

### Option 1: Railway (Easiest - Recommended)
Railway handles both frontend and backend with MongoDB.

**Backend:**
1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. New Project → Deploy from GitHub → Select repo
4. Add MongoDB service (Railway provides free MongoDB)
5. Set environment variables (REQUIRED - use actual values):
   - `MONGODB_URI` = `mongodb+srv://username:password@cluster.mongodb.net/acorn-globus` (get from Railway MongoDB service connection string)
   - `PORT` = Railway auto-assigns this, but you can set it manually (e.g., `4000`)
   - `JWT_SECRET` = Generate a strong random string (e.g., run `openssl rand -base64 32` or use a password generator)
6. Deploy

**Frontend:**
1. In Railway, add another service
2. Root directory: `frontend`
3. Build command: `npm run build`
4. Start command: `npx serve -s dist -l 3000`
5. Set environment variable (REQUIRED - use actual backend URL):
   - `VITE_API_URL` = `https://your-actual-backend-service.railway.app/api` (replace with your actual Railway backend URL)

**Note:** Update `backend/server.js` to use `process.env.PORT` (already done).

---

### Option 2: Render
Similar to Railway, free tier available.

**Backend:**
1. New Web Service → Connect GitHub repo
2. Root directory: `backend`
3. Build: `npm install`
4. Start: `npm start`
5. Set environment variables (REQUIRED - use actual values):
   - `MONGODB_URI` = `mongodb+srv://username:password@cluster.mongodb.net/acorn-globus` (from Render MongoDB addon)
   - `PORT` = `4000` (or let Render assign automatically)
   - `JWT_SECRET` = Generate strong random string (e.g., `openssl rand -base64 32`)
6. Add MongoDB (Render provides MongoDB addon)

**Frontend:**
1. New Static Site → Connect GitHub repo
2. Root directory: `frontend`
3. Build: `npm run build`
4. Publish directory: `dist`
5. Set environment variable (REQUIRED - use actual backend URL):
   - `VITE_API_URL` = `https://your-actual-backend.onrender.com/api` (replace with your actual Render backend URL)

---

### Option 3: Vercel (Frontend) + Railway/Render (Backend)
Best for frontend performance.

**Frontend on Vercel:**
1. Import project → Root directory: `frontend`
2. Build: `npm run build`
3. Output: `dist`
4. Set environment variable (REQUIRED - use actual backend URL):
   - `VITE_API_URL` = `https://your-actual-backend-url.com/api` (replace with your actual deployed backend URL)

**Backend:** Use Railway or Render (see above)

---

### Option 4: Docker (Self-hosted/VPS)
See `docker-compose.yml` and Dockerfiles below.

**Before running:**
1. Create `.env` file in root directory with actual values:
   ```env
   JWT_SECRET=your-actual-generated-secret-key-here
   VITE_API_URL=http://localhost:4000/api
   ```

2. Build and run:
   ```bash
   docker-compose up -d
   ```

**Or manually:**
```bash
# Set environment variables first
export JWT_SECRET=$(openssl rand -base64 32)
export VITE_API_URL=http://localhost:4000/api

# Build and run
cd backend && docker build -t court-booking-backend .
cd ../frontend && docker build -t court-booking-frontend .
docker run -p 4000:4000 -e MONGODB_URI=mongodb://localhost:27017/acorn-globus -e PORT=4000 -e JWT_SECRET=$JWT_SECRET court-booking-backend
docker run -p 3000:80 -e VITE_API_URL=$VITE_API_URL court-booking-frontend
```

---

## Environment Variables

### Backend (.env)
**IMPORTANT:** Replace these with your actual values. Do not use placeholder values.

```env
# MongoDB connection string from Atlas or your MongoDB provider
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/acorn-globus?retryWrites=true&w=majority

# Port number (4000 for local, or let platform assign in production)
PORT=4000

# Generate a strong secret: openssl rand -base64 32
JWT_SECRET=your-actually-generated-secret-key-here-minimum-32-characters
```

**How to get values:**
- `MONGODB_URI`: Get from MongoDB Atlas connection string or your hosting platform's MongoDB service
- `PORT`: Use `4000` for local, or let Railway/Render assign automatically (they set `process.env.PORT`)
- `JWT_SECRET`: Generate using one of these methods:

  **Method 1: Using OpenSSL (Recommended)**
  
  **Windows (PowerShell):**
  ```powershell
  # If you have OpenSSL installed:
  openssl rand -base64 32
  
  # Or using PowerShell:
  -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
  ```
  
  **Windows (Command Prompt):**
  ```cmd
  # If you have OpenSSL installed:
  openssl rand -base64 32
  
  # Or download OpenSSL from: https://slproweb.com/products/Win32OpenSSL.html
  ```
  
  **Mac/Linux:**
  ```bash
  openssl rand -base64 32
  ```
  
  **Method 2: Online Generator**
  - Visit: https://randomkeygen.com/ (use "CodeIgniter Encryption Keys" - 32+ characters)
  - Or: https://www.lastpass.com/features/password-generator (set length to 32+)
  
  **Method 3: Node.js (if you have Node installed)**
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```
  
  Copy the generated string and use it as your `JWT_SECRET` value (minimum 32 characters).

### Frontend (.env)
**IMPORTANT:** Replace with your actual backend URL.

```env
# Your deployed backend URL (e.g., https://court-booking-backend.railway.app/api)
VITE_API_URL=https://your-actual-backend-url.com/api
```

---

## MongoDB Setup

### Option A: MongoDB Atlas (Free)
1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster (free tier) - wait for it to finish provisioning
3. **Database Access** → Create database user:
   - Username: `your-username`
   - Password: Generate secure password (save it!)
   - Database User Privileges: "Atlas admin" or "Read and write to any database"
4. **Network Access** → Add IP Address (CRITICAL STEP):
   - Click "Add IP Address"
   - **For local development:** Click "Add Current IP Address" button (or manually add your IP)
   - **For production/deployment:** Add `0.0.0.0/0` to allow all IPs (or your server's specific IP)
   - Click "Confirm"
5. **Connect** → Choose "Connect your application" → Copy connection string
6. Replace `<password>` and `<dbname>` in connection string:
   ```
   mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/acorn-globus?retryWrites=true&w=majority
   ```
7. Use this full string as your `MONGODB_URI` in `.env` file

**⚠️ Common Error: "IP not whitelisted"**
- If you get this error, go to **Network Access** in Atlas
- Click "Add IP Address" → "Add Current IP Address"
- Wait 1-2 minutes for changes to propagate
- Try connecting again

### Option B: Railway/Render MongoDB Addon
Both platforms provide MongoDB as an addon. Just add it and use the connection string they provide.

---

## Post-Deployment

1. **Seed database:**
   ```bash
   cd backend
   npm run seed
   ```

2. **Create admin user:**
   ```bash
   cd backend
   node scripts/set_admin.js
   ```

3. **Test endpoints:**
   - Frontend: `https://your-frontend-url.com`
   - Backend API: `https://your-backend-url.com/api/courts`

---

## Production Checklist

- [ ] **Set actual `MONGODB_URI`** - Get connection string from MongoDB Atlas or hosting platform's MongoDB service
- [ ] **Set actual `PORT`** - Use platform-assigned port or set manually (e.g., `4000`)
- [ ] **Set actual `JWT_SECRET`** - Generate using `openssl rand -base64 32` (minimum 32 characters)
- [ ] **Set actual `VITE_API_URL`** - Use your deployed backend URL (e.g., `https://your-backend.railway.app/api`)
- [ ] **Set actual `FRONTEND_URL`** - Use your deployed frontend URL for CORS
- [ ] Use MongoDB Atlas or managed MongoDB (not local)
- [ ] Enable CORS only for your frontend domain
- [ ] Test API endpoints
- [ ] Seed initial data
- [ ] Create admin account
- [ ] Set up domain/SSL (most platforms auto-handle SSL)

---

## CORS Configuration

If deploying to different domains, update `backend/server.js`:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

Then set `FRONTEND_URL` environment variable to your frontend domain.

