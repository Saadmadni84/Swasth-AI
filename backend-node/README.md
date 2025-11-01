# Medical Report OCR Backend

Node.js + Express backend for processing medical reports with OCR capabilities.

## 🚀 Features

- **PDF Upload**: Accept medical report PDFs up to 10MB
- **OCR Processing**: Extract text using Tesseract.js
- **Medical Analysis**: Parse patient information and test results
- **Smart Interpretation**: Determine test status (normal/high/low) against reference ranges
- **AI Summary**: Generate health recommendations based on test results

## 📋 Prerequisites

### 1. Node.js
Ensure you have Node.js installed (v14 or higher):
```bash
node --version
```

### 2. Poppler (Required for PDF processing)
Install Poppler for PDF to image conversion:

**macOS:**
```bash
brew install poppler
```

**Ubuntu/Debian:**
```bash
sudo apt-get install poppler-utils
```

**Windows:**
Download from: http://blog.alivate.com.au/poppler-windows/

## 🛠️ Installation

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment:**
```bash
cp .env .env.local  # Optional: create local copy
```

Edit `.env` with your settings:
```env
PORT=5000
FRONTEND_URL=http://localhost:3001
NODE_ENV=development
```

## 🏃 Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server will start on `http://localhost:5000`

## 📡 API Endpoints

### Health Check
```
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Medical OCR Backend is running!"
}
```

### Analyze Medical Report
```
POST /api/analyze
```

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with `file` field containing PDF

**Response:**
```json
{
  "success": true,
  "patientInfo": {
    "name": "John Doe",
    "age": "45",
    "gender": "Male",
    "date": "2024-01-15",
    "patientId": "P123456"
  },
  "testResults": [
    {
      "name": "Glucose",
      "value": "105",
      "unit": "mg/dL",
      "range": "70-100",
      "status": "high"
    }
  ],
  "summary": "Overall health assessment and recommendations..."
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "patientInfo": {},
  "testResults": [],
  "summary": ""
}
```

## 🧪 Testing

### Using cURL
```bash
curl -X POST http://localhost:5000/api/analyze \
  -F "file=@/path/to/medical-report.pdf"
```

### Using Postman
1. Set method to `POST`
2. URL: `http://localhost:5000/api/analyze`
3. Body → form-data
4. Key: `file` (type: File)
5. Value: Select your PDF file

## 📁 Project Structure

```
backend/
├── server.js           # Express server setup
├── package.json        # Dependencies and scripts
├── .env               # Environment configuration
├── routes/
│   └── analyze.js     # Main analysis endpoint
├── utils/
│   ├── pdf.js        # PDF to image conversion
│   ├── ocr.js        # Text extraction with Tesseract
│   └── analysis.js   # Medical report analysis
└── uploads/          # Temporary file storage (auto-created)
```

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 5000 | Server port |
| `FRONTEND_URL` | http://localhost:3001 | Frontend URL for CORS |
| `NODE_ENV` | development | Environment mode |
| `OPENAI_API_KEY` | - | Optional: For enhanced AI summaries |

### File Upload Limits

- **Max file size:** 10MB
- **Allowed formats:** PDF only
- **Storage:** Temporary files auto-deleted after processing

## 📊 Medical Test Reference Ranges

The system recognizes these common tests:

| Test | Normal Range | Unit |
|------|-------------|------|
| Glucose | 70-100 | mg/dL |
| Cholesterol | <200 | mg/dL |
| HDL | >40 | mg/dL |
| LDL | <100 | mg/dL |
| Triglycerides | <150 | mg/dL |
| Hemoglobin | 12-16 | g/dL |
| HbA1c | <5.7 | % |
| Creatinine | 0.6-1.2 | mg/dL |

## 🐛 Troubleshooting

### Poppler not found
```
Error: pdf-poppler requires Poppler
```
**Solution:** Install Poppler (see Prerequisites)

### Port already in use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change `PORT` in `.env` or kill the process using port 5000

### No text extracted from PDF
```
Error: No text could be extracted from the PDF
```
**Possible causes:**
- PDF is image-only (needs OCR, which is handled)
- PDF is corrupted
- PDF is password-protected
- Poppler not installed

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.
