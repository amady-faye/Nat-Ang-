import os

replacements = {
    "from database": "from database",
    "from models": "from models",
    "from auth": "from auth",
    "from security": "from security",
    "import auth, documents, reading, admin": "import auth, documents, reading, admin"
}

for root, _, files in os.walk("."):
    if "node_modules" in root or "mnt" in root:
        continue
    for file in files:
        if file.endswith(".py"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            
            new_content = content
            for old, new in replacements.items():
                new_content = new_content.replace(old, new)
                
            if new_content != content:
                print(f"Updated {path}")
                with open(path, "w", encoding="utf-8") as f:
                    f.write(new_content)
