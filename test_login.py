import urllib.request
import json

data = json.dumps({"email": "formateur@cfa.fr", "password": "password123"}).encode('utf-8')
req = urllib.request.Request("https://nat-ang.onrender.com/api/auth/login", data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        print(response.getcode())
        print(response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(e.code)
    print(e.read().decode('utf-8'))
