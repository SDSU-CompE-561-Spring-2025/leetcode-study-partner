# 📚 Meetcode

This app creates an Omegle-like experience where users can study LeetCode problems together! 👯‍♂️💻

---

## 📑 Table of Contents
- [Dependencies](#-dependencies)
- [Running Back End](#-running-back-end)
- [Running Front End](#-running-front-end)
- [HTTPS Configuration](#-https-configuration)

---

## 🔧 Dependencies

- 🐳 [Docker](https://www.docker.com/products/docker-desktop/)
- 📦 [Node.js & NPM](https://nodejs.org/)
- 🐍 [Python 3.13](https://www.python.org/downloads/)

---

## 🖥️ Running Back End

### 📁 Navigate to the backend directory

```bash
cd backend
```

### 🐘 Start Postgres

```bash
docker compose up -d
```

### Shutdown docker image

```bash
docker compose down -v
```

### 🚀 Start FastAPI

```bash
hatch shell
hatch run dev_webrtc <- if u want video call to work needs https
hatch run dev <- if you dont care
```

### 🔒 Start FastAPI with HTTPS

For secure WebSocket connections (WSS), use the SSL certificates in the certs folder:

```bash
uvicorn app.main:app --ssl-keyfile=./certs/key.pem --ssl-certfile=./certs/cert.pem --host 0.0.0.0 --port 8000
# or
hatch run dev_webrtc
```

---

## 🎨 Running Front End

### 📁 Navigate to the frontend directory

```bash
cd frontend
```

### 📦 Install dependencies

```bash
npm install
```

### 🧪 Start development server

```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npm run dev
```

---

## 🔒 HTTPS Configuration

When using HTTPS on the backend with self-signed certificates, you need to disable Node.js TLS certificate verification for the frontend to connect properly:

### Running Frontend with TLS Verification Disabled

```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npm run dev
```

This is necessary when:
1. Using secure WebSocket connections (WSS)
2. Making HTTPS API calls to the backend
3. Using self-signed certificates in development

⚠️ **Note**: Disabling TLS certificate verification should only be done in development. For production, use properly signed certificates.

---
