import os
import shutil
import json

def move_content(src, dst):
    if not os.path.exists(src):
        print(f"Source {src} does not exist.")
        return
    os.makedirs(dst, exist_ok=True)
    for item in os.listdir(src):
        # Skip system/cache files
        if item in ['node_modules', '.next', '__pycache__', '.venv', '.git']:
            continue
        s = os.path.join(src, item)
        d = os.path.join(dst, item)
        try:
            if os.path.exists(d):
                if os.path.isdir(d):
                    shutil.rmtree(d, ignore_errors=True)
                else:
                    os.remove(d)
            shutil.move(s, d)
            print(f'Moved {s} to {d}')
        except Exception as e:
            print(f'Failed to move {s} to {d}: {e}')

# 1. Flatten Frontend to Root
print('--- Flattening Frontend to Root ---')
move_content('src/frontend', '.')

# 2. Re-standardize Backend in api/
print('--- Moving Backend to api/ ---')
os.makedirs('api', exist_ok=True)
move_content('src/backend', 'api')

# 3. Create Root package.json
print('--- Creating standardized package.json ---')
pkg = {
  "name": "evolution-of-todo",
  "version": "1.0.0",
  "private": True,
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
with open('package.json', 'w', encoding='utf-8') as f:
    json.dump(pkg, f, indent=2)

# 4. Standardize Vercel.json
print('--- Standardizing vercel.json ---')
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
with open('vercel.json', 'w', encoding='utf-8') as f:
    json.dump(v_json, f, indent=2)

# 5. Fix Backend Bridge
print('--- Fixing backend bridge ---')
index_py = """import sys
import os
from pathlib import Path

# Add api folder to path
api_dir = str(Path(__file__).parent)
if api_dir not in sys.path:
    sys.path.append(api_dir)

from main import app
"""
with open('api/index.py', 'w', encoding='utf-8') as f:
    f.write(index_py)

# 6. Final cleanup of src
print('--- Final Cleanup ---')
shutil.rmtree('src', ignore_errors=True)

print('SUCCESS: PROJECT_IS_NOW_FLAT')
