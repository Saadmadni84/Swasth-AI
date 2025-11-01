import os
import requests
import re
import ast
from dotenv import load_dotenv

load_dotenv()
TEAM_API_KEY = os.getenv("TEAM_API_KEY")
os.environ["TEAM_API_KEY"] = TEAM_API_KEY


from flask import Flask, request, jsonify
from flask_cors import CORS
from langdetect import detect
from aixplain.factories import ModelFactory, AgentFactory

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

doc_model = ModelFactory.get(os.getenv("DOC_MODEL_ID"))
summ_model = ModelFactory.get(os.getenv("SUMM_MODEL_ID"))
news_model = ModelFactory.get(os.getenv("NEWS_MODEL_ID"))
main_agent = AgentFactory.get(os.getenv("AGENT_MODEL_ID"))

app = Flask(__name__)
CORS(app, origins=["*"])  # Configure for production domains later

@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "message": "SwasthAI Backend API is running"})

def remove_markdown(text):
    text = re.sub(r'\*\*.*?\*\*', '', text)
    text = re.sub(r'[\*\-] ', '', text)
    text = re.sub(r'[#\*_\[\]()]', '', text)
    text = re.sub(r'\n+', '\n', text).strip()
    return text

def format_text(text):
    sections = text.split("\n")
    return "\n\n".join(section.strip() for section in sections if section.strip())

def clean_and_format_response(raw_response):
    if "data=" in raw_response:
        raw_response = raw_response.split("data=")[-1].strip()
    raw_response = raw_response.strip("()'")
    try:
        raw_response = ast.literal_eval(f"'''{raw_response}'''")
    except Exception:
        pass
    match = re.search(r"https?://\S+\nSource:.*?\nDate: .*?\n\n", raw_response, re.DOTALL)
    if match:
        articles_part = raw_response[:match.end()].strip()
        summary_part = raw_response[match.end():].strip()
    else:
        return raw_response.strip()
    formatted_articles = re.sub(r"\n{3,}", "\n\n", articles_part)
    formatted_summary = re.sub(r"\n{3,}", "\n\n", summary_part)
    return f"{formatted_articles}\n\n{'-'*100}\n\n{formatted_summary}"

def get_nearest_health_centers(latitude, longitude):
    url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={latitude},{longitude}&radius=5000&type=hospital&keyword=public%20health%20center&key={GOOGLE_MAPS_API_KEY}"
    response = requests.get(url)
    results = response.json().get("results", [])
    if not results:
        return {"error": "No health centers found nearby"}
    return [
        {
            "name": place["name"],
            "address": place.get("vicinity", "No address available"),
            "latitude": place["geometry"]["location"]["lat"],
            "longitude": place["geometry"]["location"]["lng"]
        }
        for place in results[:5]
    ]

def get_route(start_lat, start_lon, end_lat, end_lon):
    url = f"https://maps.googleapis.com/maps/api/directions/json?origin={start_lat},{start_lon}&destination={end_lat},{end_lon}&mode=driving&key={GOOGLE_MAPS_API_KEY}"
    response = requests.get(url)
    data = response.json()
    if "routes" not in data or not data["routes"]:
        return {"error": "No route found"}
    return {"route_polyline": data["routes"][0]["overview_polyline"]["points"]}

@app.route("/ask", methods=["POST"])
def ask():
    try:
        data = request.json
        question = data.get("question", "")
        if not question:
            return jsonify({"error": "No question provided"}), 400
        output_language = detect(question)
        formatted_query = f"{question} Response in {output_language}"
        agent_response = main_agent.run(formatted_query)
        formatted_response = agent_response["data"]["output"]
        form_response = remove_markdown(formatted_response)
        agent_answer = format_text(form_response)
        safe_response = agent_answer.replace("\n", " ").replace('"', '\\"').replace("'", "\\'")
        summ = summ_model.run({"question": question, "response": f"{safe_response}", "language": output_language})["data"]
        corrected_text = summ.encode('latin1').decode('utf-8')
        corr_text = remove_markdown(corrected_text)
        summary = format_text(corr_text)
        return jsonify({"response": agent_answer, "summary": summary})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/doctors", methods=["POST"])
def find_doctors():
    try:
        data = request.json
        condition = data.get("condition", "")
        location = data.get("location", "")
        if not condition or not location:
            return jsonify({"error": "Condition and location required"}), 400
        doctors = doc_model.run({"condition": condition, "location": location})
        return jsonify({"doctors": doctors.data.encode('latin1').decode('utf-8')})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/health-centers", methods=["POST"])
def find_health_centers():
    try:
        data = request.json
        latitude = data.get("latitude")
        longitude = data.get("longitude")
        if not latitude or not longitude:
            return jsonify({"error": "Latitude and longitude are required"}), 400
        health_centers = get_nearest_health_centers(latitude, longitude)
        if "error" in health_centers:
            return jsonify(health_centers), 400
        first_center = health_centers[0]
        route = get_route(latitude, longitude, first_center["latitude"], first_center["longitude"])
        return jsonify({"nearest_health_centers": health_centers, "route": route})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/news", methods=["POST"])
def get_news():
    try:
        data = request.json
        language = data.get("language", "")
        if not language:
            return jsonify({"error": "Language selection is required"}), 400
        news = news_model.run({"language": language})
        return jsonify({"news": clean_and_format_response(str(news))})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
