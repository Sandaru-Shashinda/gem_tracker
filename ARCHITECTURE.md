# 🏗️ Deployment Architecture

## Current Setup (Local Development)

```
┌─────────────────────────────────────────────────────────┐
│                   Your Computer                         │
│                                                          │
│  ┌──────────────┐         ┌──────────────┐             │
│  │   Frontend   │────────▶│   Backend    │             │
│  │  (Vite App)  │         │ (Express API) │             │
│  │ Port: 5173   │         │  Port: 5000   │             │
│  └──────────────┘         └───────┬───────┘             │
│                                   │                      │
│                                   ▼                      │
│                          ┌─────────────────┐            │
│                          │    MongoDB      │            │
│                          │   (localhost)   │            │
│                          └─────────────────┘            │
└─────────────────────────────────────────────────────────┘
```

## Production Setup (After Deployment)

```
┌──────────────────────────────────────────────────────────────────┐
│                         Internet                                 │
│                                                                   │
│  ┌────────────┐                                                  │
│  │   Users    │                                                  │
│  └─────┬──────┘                                                  │
│        │                                                          │
│        │                                                          │
├────────┼──────────────────────────────────────────────────────────┤
│        │                    Vercel                                │
│        │                                                          │
│        ▼                                                          │
│  ┌──────────────────┐                                            │
│  │    Frontend      │                                            │
│  │   (Vite Build)   │                                            │
│  │                  │                                            │
│  │ your-app.vercel  │                                            │
│  │     .app         │                                            │
│  └────────┬─────────┘                                            │
│           │                                                       │
│           │ API Calls                                            │
│           ▼                                                       │
│  ┌──────────────────┐                                            │
│  │    Backend       │                                            │
│  │  (Serverless)    │◀────── Environment Variables              │
│  │                  │         • MONGO_URI                        │
│  │ gem-tracker-api  │         • JWT_SECRET                       │
│  │ .vercel.app      │         • NODE_ENV                         │
│  └────────┬─────────┘         • PUBLIC_URL                       │
│           │                                                       │
└───────────┼───────────────────────────────────────────────────────┘
            │
            │ Database Connection
            ▼
   ┌─────────────────┐
   │  MongoDB Atlas  │
   │    (Cloud)      │
   │                 │
   │  • Cluster      │
   │  • Replica Set  │
   │  • Automatic    │
   │    Backups      │
   └─────────────────┘
```

## Deployment Flow

```
┌─────────────┐
│  Developer  │
└──────┬──────┘
       │
       │ 1. git push origin main
       ▼
┌──────────────┐
│   GitHub     │
│  Repository  │
└──────┬───────┘
       │
       │ 2. Webhook trigger
       ▼
┌──────────────┐
│   Vercel     │
│   Platform   │
│              │
│  ┌────────┐  │
│  │  Build │  │────── 3. npm install
│  └────┬───┘  │────── 4. Bundle code
│       │      │────── 5. Deploy to edge network
│       ▼      │
│  ┌────────┐  │
│  │ Deploy │  │────── 6. Live on production URL
│  └────────┘  │
└──────────────┘
       │
       │ 7. Ready to serve requests
       ▼
┌──────────────┐
│   End Users  │
└──────────────┘
```

## Key Components

### 1. Frontend (Vite)

- **Location:** Vercel Edge Network
- **Build:** Static files + client-side JavaScript
- **Environment:** `VITE_API_BASE_URL`

### 2. Backend (Express API)

- **Location:** Vercel Serverless Functions
- **Runtime:** Node.js
- **Auto-scaling:** Yes (handles traffic spikes automatically)
- **Environment Variables:**
  - `MONGO_URI` - Database connection
  - `JWT_SECRET` - Token signing
  - `NODE_ENV` - production
  - `PUBLIC_URL` - API base URL

### 3. Database (MongoDB Atlas)

- **Location:** Cloud (AWS/GCP/Azure)
- **Type:** Managed MongoDB cluster
- **Features:**
  - Automatic backups
  - High availability
  - Scalable storage
  - Global distribution

## Benefits of This Architecture

✅ **Serverless** - No server management required
✅ **Scalable** - Auto-scales with traffic
✅ **Fast** - Edge network for low latency
✅ **Reliable** - 99.99% uptime SLA
✅ **Secure** - HTTPS by default, environment variables encrypted
✅ **Cost-effective** - Pay only for what you use (free tier available)

## Security Features

🔒 **HTTPS/TLS** - All traffic encrypted
🔒 **Environment Variables** - Securely stored and encrypted
🔒 **JWT Authentication** - Token-based auth
🔒 **CORS** - Configured for frontend domain
🔒 **IP Whitelisting** - MongoDB Atlas access control
🔒 **DDoS Protection** - Built into Vercel

## Monitoring & Maintenance

📊 **Logs** - Available in Vercel dashboard
📊 **Analytics** - Request metrics and performance
📊 **Alerts** - Email notifications for issues
📊 **Deployments** - Version history and rollback
