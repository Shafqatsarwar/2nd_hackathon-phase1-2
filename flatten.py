import os
import shutil
import json

def move_all(src_dir, dst_dir):
    if not os.path.exists(src_dir):
        print(f"Source {src_dir} does not exist.")
        return
    for item in os.listdir(src_dir):
        s = os.path.join(src_dir, item)
        d = os.path.join(dst_dir, item)
        if item in ['node_modules', '.next', '__pycache__', '.git', '.venv']:
            continue
        try:
            if os.path.exists(d):
                if os.path.isdir(d):
                    shutil.rmtree(d)
                else:
                    os.remove(d)
            # Use copy and delete because move might fail across partitions or if busy
            if os.path.isdir(s):
                shutil.copytree(s, d)
                shutil.rmtree(s)
            else:
                shutil.copy2(s, d)
                os.remove(s)
            print(f"Relocated {s} to {d}")
        except Exception as e:
            print(f"Error relocating {s} to {d}: {e}")

# 1. Move Frontend to Root
print("Flattening Frontend...")
move_all('src/frontend', '.')

# 2. Move Backend to api
print("Moving Backend to api...")
os.makedirs('api', exist_ok=True)
move_all('src/backend', 'api')

# 3. Update package.json
print("Updating package.json...")
pkg_path = 'package.json'
new_pkg = {
  "name": "evolution-of-todo",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "15.1.2",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "better-auth": "1.1.8",
    "better-sqlite3": "12.5.0",
    "pg": "8.13.1",
    "lucide-react": "0.469.0",
    "autoprefixer": "10.4.20",
    "postcss": "8.5.6",
    "tailwindcss": "3.4.19"
  },
  "devDependencies": {
    "@types/node": "20",
    "@types/react": "19",
    "@types/react-dom": "19",
    "typescript": "5"
  }
}
with open(pkg_path, 'w') as f:
    json.dump(new_pkg, f, indent=2)

# 4. Update vercel.json
print("Updating vercel.json...")
v_json = {
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/index.py" },
    { "source": "/docs", "destination": "/api/index.py" },
    { "source": "/openapi.json", "destination": "/api/index.py" }
  ],
  "env": { "PYTHONPATH": "api" }
}
with open('vercel.json', 'w') as f:
    json.dump(v_json, f, indent=2)

# 5. Fix api/index.py
print("Fixing api/index.py...")
index_py = """import sys
import os
from pathlib import Path

api_dir = str(Path(__file__).parent)
if api_dir not in sys.path:
    sys.path.append(api_dir)

from main import app
"""
with open('api/index.py', 'w') as f:
    f.write(index_py)

print("Flattening complete!")
