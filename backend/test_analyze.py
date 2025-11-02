#!/usr/bin/env python3
"""
Test script for the /analyze endpoint
Run this after starting the Flask backend and n8n
"""

import requests
import json
from urllib.parse import quote

BASE_URL = "http://localhost:5001"

def test_analyze_with_url():
    """Test analyzing a file from URL"""
    print("\n🧪 Test 1: Analyze file from URL")
    print("=" * 50)
    
    # Example: Using a GitHub raw URL (you can replace with your own)
    test_url = "https://raw.githubusercontent.com/example/symptoms.txt"
    
    # For testing, you might want to create a test file first
    # or use an existing public URL
    
    try:
        response = requests.get(
            f"{BASE_URL}/analyze",
            params={"file_url": test_url},
            timeout=15
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✅ Test passed!")
            return True
        else:
            print("❌ Test failed!")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_analyze_missing_url():
    """Test error handling for missing file_url"""
    print("\n🧪 Test 2: Missing file_url parameter")
    print("=" * 50)
    
    try:
        response = requests.get(f"{BASE_URL}/analyze", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 400:
            print("✅ Error handling works correctly!")
            return True
        else:
            print("❌ Unexpected response")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_analyze_text():
    """Test direct text analysis"""
    print("\n🧪 Test 3: Direct text analysis")
    print("=" * 50)
    
    test_symptoms = """
    I have been experiencing:
    - Headache for 2 days
    - Fatigue and weakness
    - Slight nausea
    - Dizziness when standing up
    """
    
    try:
        response = requests.post(
            f"{BASE_URL}/analyze/text",
            json={
                "text": test_symptoms,
                "use_n8n": True
            },
            headers={"Content-Type": "application/json"},
            timeout=30  # n8n might take time
        )
        
        print(f"Status Code: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if response.status_code == 200 and "prediction" in result:
            print("✅ Test passed!")
            print(f"\n📝 Generated Remedy Preview:")
            print(result["prediction"][:200] + "...")
            return True
        else:
            print("❌ Test failed!")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_analyze_text_without_n8n():
    """Test with placeholder (n8n disabled)"""
    print("\n🧪 Test 4: Text analysis with placeholder (n8n disabled)")
    print("=" * 50)
    
    test_symptoms = "I have a headache and feel tired."
    
    try:
        response = requests.post(
            f"{BASE_URL}/analyze/text",
            json={
                "text": test_symptoms,
                "use_n8n": False
            },
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if response.status_code == 200 and result.get("source") == "placeholder":
            print("✅ Test passed!")
            return True
        else:
            print("❌ Test failed!")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def main():
    print("\n🚀 Testing SwasthAI /analyze Endpoint")
    print("=" * 50)
    print("Make sure:")
    print("  1. Flask backend is running on http://localhost:5001")
    print("  2. n8n workflow is active and accessible")
    print("  3. n8n webhook path is: /webhook/chat/swasth-ai")
    print("=" * 50)
    
    results = []
    
    # Run tests
    results.append(("Missing URL", test_analyze_missing_url()))
    results.append(("Direct Text (n8n)", test_analyze_text()))
    results.append(("Direct Text (placeholder)", test_analyze_text_without_n8n()))
    # Note: URL test might fail if no test file available
    # results.append(("File URL", test_analyze_with_url()))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Summary")
    print("=" * 50)
    
    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    passed_count = sum(1 for _, p in results if p)
    total_count = len(results)
    
    print(f"\nTotal: {passed_count}/{total_count} tests passed")
    
    if passed_count == total_count:
        print("🎉 All tests passed!")
    else:
        print("⚠️  Some tests failed. Check your setup.")


if __name__ == "__main__":
    main()

