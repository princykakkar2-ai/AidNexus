# AidNexus 🤝

AidNexus is a digital platform designed to crowdsource societal challenges, enable citizen grievance registration, and facilitate collaborative problem-solving through academic institutions (student teams) and industry/NGO sponsorships.

---

## 🚀 Key Features

- **Citizen Reporting**: Geolocation-tagged civic complaints with media evidence upload.
- **AI Classification Hub**: Machine learning-based automatic department categorization, priority estimation, summarization, and duplicate detection.
- **Academic Innovation Panel**: Workspace for student teams to discover geolocated challenges, assign teams, and track project milestones.
- **Sponsorship Portal**: Industry partners and NGOs can offer resources, technology support, or funding.
- **Expert Review Portal**: Academic mentors and industry specialists review submitted student solutions and post feedback.

---

## 🛠️ Technology Stack

### Frontend
- **React** (v19)
- **Vite** & **TailwindCSS** (v4)
- **React Router DOM** & **Axios**

### Backend
- **Node.js** & **Express**
- **Mongoose** (MongoDB Object Modeling)
- **Multer** (File evidence uploading)
- **In-memory Database Fallback** (Automatically activates if local MongoDB is offline)

### AI Services
- **Python** & **FastAPI**

---

## 📂 Folder Structure

```text
AidNexus/
├── Frontend/           # React Frontend Application
│   ├── src/
│   │   ├── components/ # Shared UI Layouts (Navbar, ProblemCard, etc.)
│   │   ├── pages/      # Expert, Admin, Citizen, and Student Dashboards
│   │   ├── services/   # Axios API integration client
│   │   └── App.jsx     # App routing table
│   └── package.json
│
├── backend/            # Express Backend REST API Server
│   ├── config/         # MongoDB connection config
│   ├── controllers/    # Route controllers (Problem, Project, Feedback)
│   ├── models/         # Schema definitions with offline DB Proxies
│   ├── routes/         # REST API routers
│   ├── server.js       # Main server runner (ES Modules)
│   └── package.json
│
└── ai-services/        # Python FastAPI AI Analytics Hub
    ├── app/
    │   ├── routes/     # Fast API routing endpoints
    │   └── services/   # Classification, priority, duplicate detection, summary scripts
    └── requirements.txt
```

---

## 🔧 Run Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (running locally on port `27017` or configured via `.env`)

### 2. Backend Setup
1. Open a terminal in the `backend/` folder:
   ```bash
   cd backend
   npm install
   ```
2. Create/verify `.env` parameters in `backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/sih26043
   CLIENT_URL=http://localhost:5173
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *Note: If MongoDB is offline, the backend will automatically initialize in Fallback Mode using an in-memory database.*

### 3. Frontend Setup
1. Open a terminal in the `Frontend/` folder:
   ```bash
   cd Frontend
   npm install
   ```
2. Start the Vite dev server:
   ```bash
   npm run dev
   ```
3. Access the web app at `http://localhost:5173/`.

### 4. AI Services Setup (Optional)
1. Open a terminal in `ai-services/`:
   ```bash
   pip install -r requirements.txt
   uvicorn app.main:app --port 8000 --reload
   ```
