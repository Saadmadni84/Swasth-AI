from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os
from pathlib import Path

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Production settings
if os.environ.get('FLASK_ENV') == 'production':
    app.config['DEBUG'] = False

# Helper to resolve model path with fallback to models/ml/
def _model_path(filename: str) -> str:
    base_paths = [
        Path(__file__).parent / "models" / filename,
        Path(__file__).parent / "models" / "ml" / filename,
    ]
    for p in base_paths:
        if p.exists():
            return str(p)
    # Last resort: try relative working dir
    alt_paths = [
        Path("models") / filename,
        Path("models") / "ml" / filename,
    ]
    for p in alt_paths:
        if p.exists():
            return str(p)
    raise FileNotFoundError(f"Model file not found for {filename} in {base_paths + alt_paths}")

# Load ML models
diabetes_model = joblib.load(_model_path("diabetes_model.pkl"))
heart_model = joblib.load(_model_path("heart_disease_model.pkl"))
parkinsons_model = joblib.load(_model_path("parkinsons_model.pkl"))

# -------------------------
# Home route
# -------------------------
@app.route("/")
def home():
    return "ML Backend is running 🚀"

# -------------------------
# Diabetes prediction
# -------------------------
@app.route("/predict/diabetes", methods=["POST"])
def predict_diabetes():
    try:
        data = request.get_json()

        # Expected features
        expected_features = [
            "Pregnancies", "Glucose", "BloodPressure", "SkinThickness",
            "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"
        ]

        # Check missing features
        missing = [f for f in expected_features if f not in data]
        if missing:
            return jsonify({"error": f"Missing features: {missing}"}), 400

        # Prepare features in correct order
        features = np.array([[data[f] for f in expected_features]])

        prediction = diabetes_model.predict(features)
        result = "Diabetic" if prediction[0] == 1 else "Not Diabetic"
        return jsonify({"prediction": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------------------------
# Heart disease prediction
# -------------------------
@app.route("/predict/heart", methods=["POST"])
def predict_heart():
    try:
        data = request.get_json()

        # List all 13 features expected by your heart disease model
        expected_features = [
            "age", "sex", "cp", "trestbps", "chol",
            "fbs", "restecg", "thalach", "exang",
            "oldpeak", "slope", "ca", "thal"
        ]

        missing = [f for f in expected_features if f not in data]
        if missing:
            return jsonify({"error": f"Missing features: {missing}"}), 400

        features = np.array([[data[f] for f in expected_features]])
        prediction = heart_model.predict(features)
        result = "Heart Disease" if prediction[0] == 1 else "No Heart Disease"
        return jsonify({"prediction": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------------------------
# Parkinsons prediction
# -------------------------
@app.route("/predict/parkinsons", methods=["POST"])
def predict_parkinsons():
    try:
        data = request.get_json()

        # Features expected by the Parkinsons model (voice-based features)
        # Note: The model may require more features, but we'll accept what the frontend sends
        # and handle missing features gracefully
        expected_features = [
            "fo", "fhi", "flo", "jitter_percent", "shimmer", "nhr", "hnr"
        ]

        # Check if we have at least some features
        provided_features = [f for f in expected_features if f in data]
        if not provided_features:
            return jsonify({"error": "No valid features provided. Expected: " + ", ".join(expected_features)}), 400

        # Try to build features array - use provided values or default to 0
        try:
            # If the model expects more features, we'll need to handle that
            # For now, use what's provided
            feature_values = [float(data.get(f, 0)) for f in expected_features]
            features = np.array([feature_values])
            
            prediction = parkinsons_model.predict(features)
            # Return both string and numeric for compatibility
            result_str = "Parkinsons" if prediction[0] == 1 else "No Parkinsons"
            return jsonify({"prediction": result_str, "prediction_value": int(prediction[0])})
        except ValueError as ve:
            return jsonify({"error": f"Invalid feature values: {str(ve)}"}), 400
        except Exception as model_error:
            # Model might expect different number of features
            return jsonify({"error": f"Model prediction error: {str(model_error)}. Please check model requirements."}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------------------------
# Run app
# -------------------------
if __name__ == "__main__":
    # Use port 5001 to avoid conflict with macOS AirPlay on port 5000
    port = int(os.environ.get('PORT', 5001))
    debug_mode = os.environ.get('FLASK_ENV') != 'production'
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
