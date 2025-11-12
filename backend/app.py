from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os
import requests
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

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

# Load ML models with error handling
diabetes_model = None
heart_model = None
parkinsons_model = None

try:
    logger.info("Loading ML models...")
    diabetes_model = joblib.load(_model_path("diabetes_model.pkl"))
    logger.info("✓ Diabetes model loaded successfully")
    heart_model = joblib.load(_model_path("heart_disease_model.pkl"))
    logger.info("✓ Heart disease model loaded successfully")
    parkinsons_model = joblib.load(_model_path("parkinsons_model.pkl"))
    logger.info("✓ Parkinsons model loaded successfully")
except Exception as e:
    logger.warning(f"⚠️  Warning: Could not load ML models: {e}")
    logger.warning("ML prediction endpoints will return error messages")

# -------------------------
# Medical Text Analysis Functions
# -------------------------

def analyze_medical_text(text: str) -> str:
    """
    Placeholder ML function for medical text analysis.
    This can be replaced with actual LLM integration or model inference.
    
    Args:
        text: Medical text content (symptoms, reports, chat input)
        
    Returns:
        Analysis result as string
    """
    # Basic placeholder response
    excerpt = text[:100] if len(text) > 100 else text
    return f"AI medical analysis: Patient shows possible symptoms related to {excerpt}... Please consult with a healthcare professional for proper diagnosis."


def call_n8n_workflow(message: str, n8n_url: str = None) -> str:
    """
    Call the n8n Swasth AI workflow to get home remedy suggestions.
    
    Args:
        message: User's message/symptoms
        n8n_url: Base URL for n8n (defaults to localhost:5678)
        
    Returns:
        AI-generated response from n8n workflow
    """
    if not n8n_url:
        n8n_url = os.environ.get('N8N_URL', 'http://localhost:5678')
    
    # n8n webhook path - can be configured via env var
    webhook_path = os.environ.get('N8N_WEBHOOK_PATH', 'chat/swasth-ai')
    webhook_url = f"{n8n_url}/webhook/{webhook_path}"
    
    logger.info(f"Calling n8n workflow at: {webhook_url}")
    logger.info(f"Payload: {{'message': '{message}'}}")
    
    try:
        response = requests.post(
            webhook_url,
            json={"message": message},
            timeout=60,  # Increased timeout for Ollama processing
            headers={"Content-Type": "application/json"}
        )
        
        logger.info(f"n8n response status: {response.status_code}")
        logger.info(f"n8n response headers: {dict(response.headers)}")
        
        response.raise_for_status()
        
        # n8n returns the response in the body (as per the workflow)
        # The workflow sends response as JSON with structure based on "Send Response" node
        # First check raw response
        raw_text = response.text
        logger.info(f"n8n raw response (first 500 chars): {raw_text[:500]}")
        logger.info(f"n8n raw response length: {len(raw_text)}")
        
        try:
            result = response.json()
            logger.info(f"n8n JSON response: {result}")
            
            # Try different possible response structures from n8n workflow
            # Based on the workflow: Code node outputs finalResponse, Send Response sends it
            if isinstance(result, dict):
                # Check for common n8n response formats
                if 'finalResponse' in result:
                    logger.info(f"Found 'finalResponse': {result['finalResponse'][:100]}...")
                    return result['finalResponse']
                elif 'reply' in result:
                    logger.info(f"Found 'reply': {result['reply'][:100]}...")
                    return result['reply']
                elif 'response' in result:
                    logger.info(f"Found 'response': {result['response'][:100]}...")
                    return result['response']
                elif 'text' in result:
                    logger.info(f"Found 'text': {result['text'][:100]}...")
                    return result['text']
                elif 'data' in result:
                    logger.info(f"Found 'data': {result['data'][:100]}...")
                    return result['data']
                elif 'output' in result:
                    logger.info(f"Found 'output': {result['output'][:100]}...")
                    return result['output']
                elif 'message' in result:
                    logger.info(f"Found 'message': {result['message'][:100]}...")
                    return result['message']
                # If response is the entire dict, try to stringify intelligently
                elif len(result) == 1:
                    value = str(list(result.values())[0])
                    logger.info(f"Single value response: {value[:100]}...")
                    return value
                else:
                    # Log all keys for debugging
                    logger.warning(f"Unknown response structure. Keys: {list(result.keys())}")
                    logger.warning(f"Full response: {result}")
                    # Try to extract any text-like values
                    for key in ['body', 'data', 'content', 'result']:
                        if key in result and isinstance(result[key], str) and result[key].strip():
                            return result[key]
                    return str(result)
            else:
                logger.info(f"Non-dict response: {str(result)[:100]}...")
                return str(result)
        except ValueError as ve:
            # If not JSON, return as text
            logger.warning(f"n8n response is not valid JSON: {ve}")
            logger.info(f"Response as text: {raw_text[:500]}...")
            
            # Check if it's empty
            if not raw_text or not raw_text.strip():
                logger.error("n8n returned empty text response")
                return analyze_medical_text(message)
            
            # Try to extract meaningful content
            return raw_text.strip()
        
    except requests.exceptions.Timeout:
        logger.error(f"n8n workflow timeout after 60 seconds")
        return analyze_medical_text(message)
    except requests.exceptions.RequestException as e:
        # Fallback to placeholder if n8n is unavailable
        logger.error(f"n8n workflow unavailable: {str(e)}")
        logger.info("Falling back to placeholder function")
        return analyze_medical_text(message)

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
        if diabetes_model is None:
            return jsonify({"error": "Diabetes model not loaded. Please check server logs."}), 503
        
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
        if heart_model is None:
            return jsonify({"error": "Heart disease model not loaded. Please check server logs."}), 503
        
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
        if parkinsons_model is None:
            return jsonify({"error": "Parkinsons model not loaded. Please check server logs."}), 503
        
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
# Medical text analysis endpoint
# -------------------------
@app.route("/analyze", methods=["GET"])
def analyze():
    """
    Analyze medical text from a URL.
    
    Query Parameters:
        file_url (str): URL to a text file containing patient symptoms/reports
        
    Returns:
        JSON response with analysis results
    """
    file_url = request.args.get("file_url")
    
    # Validate file_url parameter
    if not file_url:
        return jsonify({
            "error": "Missing 'file_url' parameter",
            "status": "error"
        }), 400
    
    # Validate URL format
    if not (file_url.startswith("http://") or file_url.startswith("https://")):
        return jsonify({
            "error": "Invalid URL format. Must start with http:// or https://",
            "status": "error"
        }), 400
    
    try:
        # Download the text file with timeout
        download_timeout = int(os.environ.get('DOWNLOAD_TIMEOUT', 10))
        response = requests.get(file_url, timeout=download_timeout)
        response.raise_for_status()  # Raises exception for bad status codes
        
        # Read file contents
        text = response.text.strip()
        
        # Validate file is not empty
        if not text:
            return jsonify({
                "error": "Empty file content",
                "file_url": file_url,
                "status": "error"
            }), 400
        
        # Check if we should use n8n workflow or placeholder
        use_n8n = os.environ.get('USE_N8N', 'true').lower() == 'true'
        
        if use_n8n:
            # Call n8n workflow for AI-powered analysis
            prediction = call_n8n_workflow(text)
        else:
            # Use placeholder ML function
            prediction = analyze_medical_text(text)
        
        # Prepare response
        return jsonify({
            "file_url": file_url,
            "input_excerpt": text[:200],  # First 200 characters
            "prediction": prediction,
            "status": "success",
            "source": "n8n" if use_n8n else "placeholder"
        })
        
    except requests.exceptions.Timeout:
        return jsonify({
            "error": "Download timeout - file URL took too long to respond",
            "file_url": file_url,
            "status": "error"
        }), 408
        
    except requests.exceptions.RequestException as e:
        return jsonify({
            "error": f"Failed to download file: {str(e)}",
            "file_url": file_url,
            "status": "error"
        }), 400
        
    except Exception as e:
        return jsonify({
            "error": f"Internal server error: {str(e)}",
            "file_url": file_url,
            "status": "error"
        }), 500

# -------------------------
# Direct chat endpoint (alternative to file_url)
# -------------------------
@app.route("/analyze/text", methods=["POST"])
def analyze_text():
    """
    Analyze medical text directly (alternative to file_url method).
    
    Request Body:
        {
            "text": "patient symptoms or medical text",
            "use_n8n": true  // optional, defaults to true
        }
        
    Returns:
        JSON response with analysis results
    """
    try:
        data = request.get_json()
        logger.info(f"Received /analyze/text request: {data}")
        
        if not data:
            logger.error("Missing request body")
            return jsonify({
                "error": "Missing request body",
                "status": "error"
            }), 400
        
        text = data.get("text", "").strip()
        
        if not text:
            logger.error("Empty text field")
            return jsonify({
                "error": "Missing or empty 'text' field",
                "status": "error"
            }), 400
        
        logger.info(f"Processing text: {text[:100]}...")
        
        # Check if n8n should be used
        use_n8n = data.get("use_n8n", os.environ.get('USE_N8N', 'true').lower() == 'true')
        logger.info(f"Using n8n: {use_n8n}")
        
        if use_n8n:
            logger.info("Calling n8n workflow...")
            prediction = call_n8n_workflow(text)
            logger.info(f"n8n returned prediction length: {len(prediction) if prediction else 0}")
            
            # If n8n returns empty, fallback to placeholder
            if not prediction or not prediction.strip():
                logger.warning("n8n returned empty response, using fallback")
                prediction = analyze_medical_text(text)
        else:
            logger.info("Using placeholder function")
            prediction = analyze_medical_text(text)
        
        logger.info(f"Final prediction preview: {prediction[:200] if prediction else 'EMPTY'}...")
        
        return jsonify({
            "input_excerpt": text[:200],
            "prediction": prediction if prediction else "Error: No response from AI service",
            "status": "success",
            "source": "n8n" if use_n8n else "placeholder"
        })
        
    except Exception as e:
        logger.error(f"Error in analyze_text: {str(e)}", exc_info=True)
        return jsonify({
            "error": f"Internal server error: {str(e)}",
            "status": "error"
        }), 500

# -------------------------
# Run app
# -------------------------
if __name__ == "__main__":
    # Use port 5001 to avoid conflict with macOS AirPlay on port 5000
    port = int(os.environ.get('PORT', 5001))
    debug_mode = os.environ.get('FLASK_ENV') != 'production'
    app.run(debug=debug_mode, host='0.0.0.0', port=port, use_reloader=False)
