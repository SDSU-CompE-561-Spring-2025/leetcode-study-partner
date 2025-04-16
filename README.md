
# 📚 Meetcode

This app creates an Omegle-like experience where users can study LeetCode problems together! 👯‍♂️💻

---

## 📑 Table of Contents
- [Dependencies](#-dependencies)
- [Running Back End](#-running-back-end)
- [Running Front End](#-running-front-end)

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
docker-compose up -d
```

### Shutdown docker image

```bash
docker-compose down -v
```

### 🚀 Start FastAPI

```bash
hatch shell
hatch run dev
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
npm run dev
```

---
