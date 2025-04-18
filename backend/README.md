# Backend – MeetCode

This is the FastAPI backend service for **MeetCode**. It provides authentication, user management, match coordination, and a review system for users.

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/SDSU-CompE-561-Spring-2025/leetcode-study-partner.git
cd leetcode-study-partner/backend
```

### 2. Create a Virtual Environment

This project uses Hatch, which is used to manage virtual environments. If you don't have it installed yet, install it now using:
```bash
pip install hatch
```

### 3. Install dependencies

Use the .venv defined in pyproject.toml to install all required packages using uv:
```bash
hatch env create
```

### 4. Set Up Environment Variables

Create a .env file in the backend/ folder and include the following variables. These are required for database connection and token handling, and the values are temporary for now:
```bash
DATABASE_URL="sqlite:///./sql_app.db"
SECRET_KEY="secret"
SECRET_KEY_ACCESS="access"
SECRET_KEY_REFRESH="refresh"
```

### 5. Run the application
Start a local development server using fastapi dev src/app/main.py:
```bash
hatch run dev
```

### 6. Test the API
Once the server is running, open your browser and visit to see the auto-generated Swagger UI with all available endpoints (auth, data, match, reviews, etc.):
```bash
http://127.0.0.1:8000/docs
```