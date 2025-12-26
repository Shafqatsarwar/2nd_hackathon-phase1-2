import os
import json

def write_file(path, content):
    full_path = os.path.join(os.getcwd(), path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)

root_pkg = {
  "name": "2nd-hackathon-shafqat",
  "version": "1.0.0",
  "scripts": {
    "dev": "npm --prefix src/frontend run dev",
    "build": "npm --prefix src/frontend run build",
    "start": "npm --prefix src/frontend run start"
  },
  "dependencies": {
    "next": "15.1.2",
    "react": "19.0.0",
    "react-dom": "19.0.0"
  }
}

fe_pkg = {
  "name": "todo-frontend",
  "version": "0.1.0",
  "private": True,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "autoprefixer": "10.4.20",
    "better-auth": "1.1.8",
    "better-sqlite3": "12.5.0",
    "lucide-react": "0.469.0",
    "next": "15.1.2",
    "pg": "8.13.1",
    "react": "19.0.0",
    "react-dom": "19.0.0"
  },
  "devDependencies": {
    "@types/node": "20",
    "@types/react": "19",
    "@types/react-dom": "19",
    "postcss": "8.5.6",
    "tailwindcss": "3.4.19",
    "typescript": "5"
  }
}

auth_ts = """import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";

const getDatabaseConfig = () => {
    const isBuild = process.env.NEXT_PHASE === 'phase-production-build' || 
                   (!process.env.DATABASE_URL && process.env.NODE_ENV === 'production');

    if (isBuild || !process.env.DATABASE_URL) {
        return { provider: "sqlite", url: ":memory:" };
    }

    const url = process.env.DATABASE_URL;
    return url.startsWith("postgres")
        ? { provider: "postgresql", url }
        : { provider: "sqlite", url: url.replace("sqlite:///", "") };
};

export const auth = betterAuth({
    database: getDatabaseConfig(),
    emailAndPassword: { enabled: true },
    plugins: [jwt({ jwt: { issuer: "todo-evolution", expiresIn: "7d" } })]
});
"""

write_file('package.json', json.dumps(root_pkg, indent=2))
write_file('src/frontend/package.json', json.dumps(fe_pkg, indent=2))
write_file('src/frontend/lib/auth.ts', auth_ts)
write_file('src/frontend/auth_v3.ts', auth_ts)

# Clean up lockfiles
for root, dirs, files in os.walk('.'):
    for f in files:
        if f == 'package-lock.json':
            try:
                os.remove(os.path.join(root, f))
            except:
                pass
    if 'node_modules' in dirs:
        # Shallow delete of node_modules in known spots
        if root in ['.', os.path.join('.', 'src', 'frontend')]:
             import shutil
             try:
                 shutil.rmtree(os.path.join(root, 'node_modules'), ignore_errors=True)
             except:
                 pass

print("MONOREPO_FIX_COMPLETE")
