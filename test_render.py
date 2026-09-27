import urllib.request
import json
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

url = "https://nat-ang.onrender.com/api/auth/login"
data = json.dumps({"email": "formateur@cfa.fr", "password": "password123"}).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        print("SUCCESS:", response.getcode())
        print(response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("ERROR:", e.code)
    print(e.read().decode('utf-8'))
except Exception as e:
    print("EXCEPTION:", str(e))
