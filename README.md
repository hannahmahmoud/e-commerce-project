# Cloud Kitchen — Full Stack

Backend: Node.js + Express + MongoDB (port 4000)
Frontend: React + Vite (port 5173)

## First time setup

### 1. Backend
```
cd backend
npm install
npm start
```
Should print:
✅ MongoDB connected successfully
✅ Backend running on http://localhost:4000

### 2. Frontend (new terminal)
```
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## Seed the database (optional — adds sample data)
```
cd backend
node seed.js
```
Creates: 4 categories, 7 subcategories, 8 brands, 12 products
Admin account: admin@cloudkitchen.com / admin1234
User account:  user@cloudkitchen.com  / user1234

## Create admin account manually
```
cd backend
node makeadmin.js
```
