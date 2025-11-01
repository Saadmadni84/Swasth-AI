import os
import json
import datetime
import time
import schedule
from pathlib import Path
from flask import Flask, jsonify, request
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
DATA_DIR = Path(os.path.dirname(os.path.abspath(__file__))) / "data"
FAMILY_DATA_FILE = DATA_DIR / "family_members.json"
NOTIFICATIONS_FILE = DATA_DIR / "notifications.json"

# Create data directory if it doesn't exist
DATA_DIR.mkdir(exist_ok=True)

# Initialize data files if they don't exist
if not FAMILY_DATA_FILE.exists():
    with open(FAMILY_DATA_FILE, "w") as f:
        json.dump([], f)

if not NOTIFICATIONS_FILE.exists():
    with open(NOTIFICATIONS_FILE, "w") as f:
        json.dump([], f)

# Email configuration
EMAIL_SENDER = os.getenv("EMAIL_SENDER", "")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "")
EMAIL_RECIPIENT = os.getenv("EMAIL_RECIPIENT", "")

# Helper functions
def load_data(file_path):
    """Load data from a JSON file"""
    with open(file_path, "r") as f:
        return json.load(f)

def save_data(data, file_path):
    """Save data to a JSON file"""
    with open(file_path, "w") as f:
        json.dump(data, f, indent=2)

def send_email_notification(subject, message):
    """Send an email notification"""
    if not EMAIL_SENDER or not EMAIL_PASSWORD or not EMAIL_RECIPIENT:
        print("Email configuration is incomplete. Skipping email notification.")
        return False
    
    try:
        msg = MIMEMultipart()
        msg["From"] = EMAIL_SENDER
        msg["To"] = EMAIL_RECIPIENT
        msg["Subject"] = subject
        
        msg.attach(MIMEText(message, "plain"))
        
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(EMAIL_SENDER, EMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
        
        print(f"Email notification sent: {subject}")
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

def check_upcoming_events():
    """Check for upcoming health events and send notifications"""
    family_members = load_data(FAMILY_DATA_FILE)
    notifications = load_data(NOTIFICATIONS_FILE)
    today = datetime.datetime.now().date()
    
    for member in family_members:
        if "upcomingEvents" in member and member["upcomingEvents"]:
            for event in member["upcomingEvents"]:
                event_date = datetime.datetime.strptime(event["date"], "%Y-%m-%d").date()
                days_until = (event_date - today).days
                
                # Check if event is coming up in the next 7 days
                if 0 <= days_until <= 7:
                    notification_id = f"{member['id']}_{event['title']}_{event['date']}"
                    
                    # Check if we've already sent a notification for this event
                    if not any(n["id"] == notification_id for n in notifications):
                        # Create notification
                        notification = {
                            "id": notification_id,
                            "memberId": member["id"],
                            "memberName": member["name"],
                            "eventTitle": event["title"],
                            "eventDate": event["date"],
                            "daysUntil": days_until,
                            "notifiedAt": datetime.datetime.now().isoformat(),
                            "status": "pending"
                        }
                        
                        # Send email notification
                        subject = f"Health Reminder: {event['title']} for {member['name']}"
                        message = f"""Hello,

This is a reminder that {member['name']} has {event['title']} scheduled in {days_until} days on {event['date']}.

Please make sure to prepare accordingly.

Best regards,
SwasThAI Health Assistant
"""
                        
                        if send_email_notification(subject, message):
                            notification["status"] = "sent"
                        
                        notifications.append(notification)
                        save_data(notifications, NOTIFICATIONS_FILE)
                        print(f"Notification created for {member['name']}'s {event['title']}")

# API Routes
@app.route("/api/family-members", methods=["GET"])
def get_family_members():
    """Get all family members"""
    family_members = load_data(FAMILY_DATA_FILE)
    return jsonify(family_members)

@app.route("/api/family-members", methods=["POST"])
def add_family_member():
    """Add a new family member"""
    family_members = load_data(FAMILY_DATA_FILE)
    new_member = request.json
    
    # Ensure the new member has an ID
    if "id" not in new_member:
        new_member["id"] = str(int(time.time() * 1000))
    
    family_members.append(new_member)
    save_data(family_members, FAMILY_DATA_FILE)
    
    return jsonify(new_member), 201

@app.route("/api/family-members/<member_id>", methods=["PUT"])
def update_family_member(member_id):
    """Update a family member"""
    family_members = load_data(FAMILY_DATA_FILE)
    updated_member = request.json
    
    for i, member in enumerate(family_members):
        if member["id"] == member_id:
            family_members[i] = updated_member
            save_data(family_members, FAMILY_DATA_FILE)
            return jsonify(updated_member)
    
    return jsonify({"error": "Family member not found"}), 404

@app.route("/api/family-members/<member_id>", methods=["DELETE"])
def delete_family_member(member_id):
    """Delete a family member"""
    family_members = load_data(FAMILY_DATA_FILE)
    
    for i, member in enumerate(family_members):
        if member["id"] == member_id:
            del family_members[i]
            save_data(family_members, FAMILY_DATA_FILE)
            return jsonify({"message": "Family member deleted"})
    
    return jsonify({"error": "Family member not found"}), 404

@app.route("/api/notifications", methods=["GET"])
def get_notifications():
    """Get all notifications"""
    notifications = load_data(NOTIFICATIONS_FILE)
    return jsonify(notifications)

# Schedule the notification check to run every day at 8:00 AM
def start_scheduler():
    schedule.every().day.at("08:00").do(check_upcoming_events)
    
    while True:
        schedule.run_pending()
        time.sleep(60)  # Sleep for 1 minute between checks

if __name__ == "__main__":
    # Start the scheduler in a separate thread
    import threading
    scheduler_thread = threading.Thread(target=start_scheduler)
    scheduler_thread.daemon = True
    scheduler_thread.start()
    
    # Start the Flask app
    app.run(host="0.0.0.0", port=5000, debug=True)