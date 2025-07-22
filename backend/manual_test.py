#!/usr/bin/env python3
"""
Manual endpoint testing script
Run this while your server is running (uvicorn main:app --reload)
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_endpoints():
    """Test endpoints manually"""
    
    print("🧪 Testing Endpoints Manually")
    print("=" * 50)
    
    # Test 1: Create a user
    print("1. Creating a user...")
    user_data = {
        "username": "testuser123",
        "email": "test123@example.com", 
        "password": "password123",
        "role": "professor"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/users/", json=user_data)
        print(f"   Status: {response.status_code}")
        if response.status_code == 201:
            user = response.json()
            print(f"   Created user ID: {user['user_id']}")
            
            # Test 2: Create a professor
            print("\n2. Creating a professor...")
            prof_data = {
                "user_id": user['user_id'],
                "full_name": "Test Professor",
                "departamento": "Computer Science"
            }
            prof_response = requests.post(f"{BASE_URL}/professores/", json=prof_data)
            print(f"   Status: {prof_response.status_code}")
            if prof_response.status_code == 201:
                professor = prof_response.json()
                print(f"   Created professor ID: {professor['professor_id']}")
                
                # Test 3: Create a disciplina
                print("\n3. Creating a disciplina...")
                disc_data = {
                    "professor_id": professor['professor_id'],
                    "nome_disciplina": "Manual Test Subject",
                    "description": "A manually tested subject"
                }
                disc_response = requests.post(f"{BASE_URL}/disciplinas/", json=disc_data)
                print(f"   Status: {disc_response.status_code}")
                if disc_response.status_code == 201:
                    disciplina = disc_response.json()
                    print(f"   Created disciplina ID: {disciplina['disciplina_id']}")
                    
                    # Test 4: Get all disciplinas
                    print("\n4. Getting all disciplinas...")
                    get_response = requests.get(f"{BASE_URL}/disciplinas/")
                    print(f"   Status: {get_response.status_code}")
                    if get_response.status_code == 200:
                        disciplinas = get_response.json()
                        print(f"   Found {len(disciplinas)} disciplinas")
        else:
            print(f"   Error: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to server.")
        print("   Make sure the server is running with: uvicorn main:app --reload")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_endpoints()
