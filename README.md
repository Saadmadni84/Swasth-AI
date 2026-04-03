# 🌿 GramSwasth: Revolutionizing Rural Healthcare

> Note: The repository is now organized as a monorepo with separate frontend (Next.js) and backend (Python/Flask ML) services.

## Monorepo structure

```
.
├── frontend/        # Next.js app (App Router)
│   ├── app/         # Routes and UI
│   ├── components/  # Shared UI components
│   ├── public/      # Static assets
│   └── Dockerfile   # Production container (standalone)
├── backend/         # Python ML API (Flask)
│   ├── app.py       # API entrypoint
│   ├── models/      # ML models (incl. models/ml/*)
│   ├── utils/       # Helpers (symptom extraction, doctor finder)
│   └── Dockerfile   # Backend container
├── backend-node/    # Legacy Node backend (preserved)
└── docker-compose.yml
```

## Quick start (local)

- Frontend (Next.js):
  - cd frontend
  - Install deps: pnpm i (or npm i)
  - Dev: pnpm dev (or npm run dev)

- Backend (Flask):
  - cd backend
  - python -m venv .venv && source .venv/bin/activate
  - pip install -r requirements.txt
  - python app.py (exposes http://localhost:5000)

## Docker (optional)

Run both services via Docker:

```
docker compose up --build
```

This will start:
- backend: http://localhost:5000/
- frontend: http://localhost:3000/ (uses NEXT_PUBLIC_API_URL=http://backend:5000 inside the network)

A comprehensive, secure, and user-friendly health management platform built with Next.js, TypeScript, and Supabase. SwasthAI enables users to manage their personal health information, family health records, medical appointments, and important documents in one centralized, secure location.

## 🌟 Features

### 🔐 Authentication & Security
- **Secure Authentication**: Email/password authentication with Supabase Auth
- **Email Verification**: Required email confirmation for account security
- **Row-Level Security**: Database-level security ensuring users only access their own data
- **Protected Routes**: Middleware-based route protection
- **Session Management**: Automatic session handling with refresh tokens

### 👤 Profile Management
- **Complete Profile Setup**: Personal information, contact details, medical info
- **Profile Photo Upload**: Secure avatar storage with Supabase Storage
- **Medical Information**: Blood group, allergies, emergency contacts
- **Address Management**: Complete address information storage

### 👨‍👩‍👧‍👦 Family Vault
- **Family Member Management**: Add and manage family members' health information
- **Document Storage**: Secure upload and storage of important family documents
- **Document Categories**: Identity, medical, insurance, legal, financial, education, photos
- **File Management**: View, download, and delete documents with proper permissions
- **Emergency Contacts**: Manage emergency contact information for the family

### 🏥 Health Records Management
- **Medical Records**: Store prescriptions, lab reports, diagnoses, vaccinations, surgeries
- **File Attachments**: Upload and attach medical documents to health records
- **Family Health Tracking**: Track health records for all family members
- **Advanced Filtering**: Filter records by type, family member, and date
- **Doctor Information**: Store doctor and hospital information with each record
- Users can input health conditions, symptoms, or queries in any Indian native language (text or audio) and receive responses in the same language
- Powered by AI-driven insights, providing accurate remedies, treatments, and guidance
- Built with aiXplain custom agents, ensuring high accuracy and adaptability for rural healthcare needs

### 👨‍⚕️ Doctor Discovery & Appointment Booking (Swasth Connect)
- Helps users find relevant doctors based on symptoms and health conditions
- Provides a curated list of doctors with details like hospital affiliations, fees, experience, and specialization
- Connects rural users with urban specialists

### 🗺️ Locate Nearest Healthcare Facilities (Swasth Map)
- Uses Google Maps to find nearby hospitals, clinics, and health centers
- Powerful tool to locate the nearest healthcare facilities based on user location and medical needs
- Helps users save time during emergencies

### 📰 Health Education & Awareness (Swasth Pulse)
- Keeps users informed about health-related news, conditions, and updates specific to their area
- Offers expert-curated blogs, articles, and news to promote health literacy and preventive care

### 📊 Health Insights Dashboard (Swasth View)
- Interactive visualizations showing urban-rural health disparities in India
- Charts and graphs for different health metrics including:
  - Urban vs rural healthcare access comparison
  - Common health conditions prevalence
  - Life expectancy trends over time
  - Child mortality rates and improvements
- Provides key takeaways and insights to drive informed healthcare decisions
- Responsive design that works across all device sizes

### 🧠 Mental Health Smartwatch Dashboard
- **Real-time Data Monitoring**: Simulated smartwatch data updated every 10 seconds
- **Key Health Metrics**: Track heart rate (60-140 bpm), stress levels (1-10), sleep hours (3-9h), and daily steps (1000-10000)
- **Mental Health Score**: AI-calculated wellness score (0-10) based on:
  - Stress levels > 7 → -2 points
  - Sleep < 6 hours → -2 points
  - Heart rate > 120 bpm → -3 points
  - Bonus points for optimal metrics
- **Status Categories**:
  - 🟢 Healthy (Score ≥ 8)
  - 🟡 Moderate (Score 5-7)
  - 🔴 Stressed (Score < 5)
- **Personalized Recommendations**: AI-driven health advice including:
  - Stress management techniques
  - Sleep optimization tips
  - Heart rate regulation guidance
  - Activity level recommendations
- **Interactive Visualizations**: Live trend charts with mental health score and stress level tracking
- **Elegant UI**: SwasthAI color palette (#003049, #669bbc, #780000, #c1121f, #fdf0d5) with Framer Motion animations
- **Glowing Effects**: Hover effects on cards, smooth transitions, and animated health indicators

## 🚀 Future Updates

### 📊 AI-powered Demand Forecasting of Medicines
- Predicts the demand for medicines in specific areas, ensuring better supply chain management
- Helps pharmacies stock essential drugs based on demand trends

### 🔮 Disease Outbreak Prediction
- Uses historical data to predict potential disease outbreaks in particular regions
- Helps authorities take preventive action before diseases spread

## 💻 Technology Stack

GramSwasth is built using modern, scalable technologies:

- **Frontend**: React, Next.js, TypeScript, Framer, Vercel
- **Backend**: Flask, JavaScript, Python
- **AI/ML**: aiXplain custom agents, Google Maps integration

## 🛠️ Setup and Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/gram-aarogya.git
cd gram-aarogya
```

2. Set up environment variables in a `.env` file:
```
TEAM_API_KEY=your_team_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
DOC_MODEL_ID=your_doc_model_id
SUMM_MODEL_ID=your_summ_model_id
NEWS_MODEL_ID=your_news_model_id
AGENT_MODEL_ID=your_agent_model_id
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Run the application
```bash
python backend.py
```

## 🌐 API Endpoints

### Health Assistant
```
POST /ask
```
Body:
```json
{
  "question": "What are the symptoms of dengue?"
}
```

### Doctor Discovery
```
POST /doctors
```
Body:
```json
{
  "condition": "diabetes",
  "location": "Mumbai"
}
```

### Health Centers
```
POST /health-centers
```
Body:
```json
{
  "latitude": 19.0760,
  "longitude": 72.8777
}
```

### Health News
```
POST /news
```
Body:
```json
{
  "language": "hindi"
}
```

## ⚠️ Challenges & Known Issues

- **Internet Connectivity**: Rural areas may face challenges with consistent internet access
- **Digital Literacy**: Some users may require training to navigate the app effectively
- **Data Privacy**: Ensuring user data security and compliance with healthcare regulations
- **Language Accuracy**: Achieving 100% accuracy in translations for all dialects is an ongoing challenge
- **Real-Time Updates**: Keeping healthcare facility information up-to-date in real-time

## 🙏 Acknowledgments

- aiXplain for AI model support & custom model creation
- Google Maps API for location services

---

> **Because everyone deserves good health—anytime, anywhere.**

## 👤 Author

For any questions or issues, please open an issue on GitHub: [@Saadmadni84](https://github.com/Saadmadni84)

---

<p align="center">
  Made with ❤️ and lots of ☕
</p>
