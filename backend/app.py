from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Production settings
if os.environ.get('FLASK_ENV') == 'production':
    app.config['DEBUG'] = False

# Load ML models
diabetes_model = joblib.load("models/diabetes_model.pkl")
heart_model = joblib.load("models/heart_disease_model.pkl")
parkinsons_model = joblib.load("models/parkinsons_model.pkl")

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

        # Replace these with the actual features your Parkinsons model expects
        expected_features = [
            "feature1", "feature2", "feature3"  # Add all features
        ]

        missing = [f for f in expected_features if f not in data]
        if missing:
            return jsonify({"error": f"Missing features: {missing}"}), 400

        features = np.array([[data[f] for f in expected_features]])
        prediction = parkinsons_model.predict(features)
        result = "Parkinsons" if prediction[0] == 1 else "No Parkinsons"
        return jsonify({"prediction": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------------------------
# Run app
# -------------------------
if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_ENV') != 'production'
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
