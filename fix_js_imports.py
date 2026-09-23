import os
import re

for root, _, files in os.walk("."):
    if "node_modules" in root or "mnt" in root:
        continue
    for file in files:
        if file.endswith((".js", ".jsx")):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Replace path prefixes
            new_content = content
            new_content = re.sub(r'from\s+[\'"]\.\.?/(?:pages|contexts|components|utils|services)/([^\'"]+)[\'"]', r"from './\1'", new_content)
            
            if new_content != content:
                print(f"Updated {path}")
                with open(path, "w", encoding="utf-8") as f:
                    f.write(new_content)
