# MongoDB Connection Troubleshooting

## Your IP is Whitelisted ✅
You have both your IP and `0.0.0.0/0` whitelisted, so the issue is likely with your connection string.

## Common Issues & Fixes

### 1. Missing or Incorrect .env File

**Check:**
- Does `backend/.env` file exist?
- Is `MONGODB_URI` set correctly?

**Fix:**
1. Create `backend/.env` file (copy from `backend/.env.example`)
2. Get connection string from MongoDB Atlas:
   - Go to Atlas → Your Cluster → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
3. Replace placeholders:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```
   Replace:
   - `<username>` with your database username
   - `<password>` with your database password
   - `<dbname>` with `acorn-globus` (or your preferred database name)

### 2. Password Contains Special Characters

If your password has special characters like `@`, `#`, `$`, `%`, `&`, `+`, `/`, `=`, `?`, you need to URL encode them:

| Character | URL Encoded |
|-----------|-------------|
| `@` | `%40` |
| `#` | `%23` |
| `$` | `%24` |
| `%` | `%25` |
| `&` | `%26` |
| `+` | `%2B` |
| `/` | `%2F` |
| `=` | `%3D` |
| `?` | `%3F` |

**Example:**
- Password: `myP@ss#word`
- Encoded: `myP%40ss%23word`
- Connection string: `mongodb+srv://user:myP%40ss%23word@cluster.mongodb.net/acorn-globus`

### 3. Wrong Connection String Format

**✅ Correct (Atlas):**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/acorn-globus?retryWrites=true&w=majority
```

**❌ Wrong:**
```
mongodb://username:password@cluster0.xxxxx.mongodb.net/acorn-globus  (missing +srv)
mongodb+srv://cluster0.xxxxx.mongodb.net/acorn-globus  (missing username:password)
```

### 4. Database User Doesn't Exist

**Check:**
1. Go to Atlas → Database Access
2. Verify your database user exists
3. User should have "Atlas admin" or "Read and write to any database" privileges

**Fix:**
1. Create new database user if needed
2. Use the username/password you created
3. Update `MONGODB_URI` in `.env`

### 5. Connection String Not Loaded

**Check if dotenv is working:**
Add this temporarily to `backend/server.js` (before `connectDB()`):
```javascript
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'NOT SET');
```

**Fix:**
- Make sure `.env` file is in `backend/` directory (same level as `server.js`)
- Make sure `.env` file doesn't have quotes around values:
  - ❌ `MONGODB_URI="mongodb+srv://..."`
  - ✅ `MONGODB_URI=mongodb+srv://...`

## Quick Test

1. **Verify .env file exists:**
   ```bash
   cd backend
   ls .env  # or dir .env on Windows
   ```

2. **Check connection string format:**
   ```bash
   # On Windows PowerShell (don't show full password):
   Get-Content .env | Select-String "MONGODB_URI"
   ```

3. **Test connection manually:**
   ```bash
   # Install mongosh if needed: https://www.mongodb.com/try/download/shell
   mongosh "your-connection-string-here"
   ```

## Example .env File

```env
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/acorn-globus?retryWrites=true&w=majority
PORT=4000
JWT_SECRET=your-generated-secret-here
FRONTEND_URL=http://localhost:3000
```

## Still Not Working?

1. **Check MongoDB Atlas cluster status:**
   - Make sure cluster is running (not paused)
   - Free tier clusters pause after inactivity

2. **Try connecting with mongosh:**
   ```bash
   mongosh "your-connection-string"
   ```
   If this works, the issue is with your Node.js code, not Atlas.

3. **Check for typos:**
   - Username/password case-sensitive
   - No extra spaces in connection string
   - Database name matches exactly

4. **Wait a few minutes:**
   - Sometimes changes take 1-2 minutes to propagate

