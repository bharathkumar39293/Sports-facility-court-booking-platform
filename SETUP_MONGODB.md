# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Cloud - Recommended for Quick Start)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account and cluster
3. Get your connection string (template only, no real creds): `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority`
4. Create `backend/.env` file with your own values (do not commit):
   ```
   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority
   PORT=4000
   ```

## Option 2: Local MongoDB Installation (Windows)

### Install MongoDB Community Edition

1. Download from: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install as a Windows Service (recommended)

### Start MongoDB Service

```powershell
# Check if service exists
Get-Service -Name MongoDB

# Start the service (if installed)
Start-Service -Name MongoDB

# Or start manually
mongod --dbpath "C:\data\db"
```

### Create .env file

Create `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/acorn-globus
PORT=4000
```

## Option 3: Docker (If you have Docker installed)

```powershell
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

Then use: `mongodb://localhost:27017/acorn-globus` in your `.env`

## After Setup

Once MongoDB is running, seed the database:

```powershell
cd backend
npm run seed
```

Then start the server:

```powershell
npm run dev
```

