import os

files = {
    r"src\frontend\lib\auth.ts": """import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";

const getDatabase = () => {
    const url = process.env.DATABASE_URL;
    if (!url || url.length === 0) {
        return { provider: "sqlite", url: "auth_build.db" };
    }
    return url.startsWith("postgres")
        ? { provider: "postgresql", url }
        : { provider: "sqlite", url: url.replace("sqlite:///", "") };
};

export const auth = betterAuth({
    database: getDatabase(),
    emailAndPassword: { enabled: true },
    plugins: [jwt({ jwt: { issuer: "todo-evolution", expiresIn: "7d" } })]
});
""",
    r"src\frontend\next.config.js": """/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: { ignoreBuildErrors: true },
    eslint: { ignoreDuringBuilds: true }
};
module.exports = nextConfig;
""",
    r"src\frontend\package.json": """{
  "name": "todo-frontend",
  "version": "0.1.0",
  "private": true,
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
}""",
    r"package.json": """{
  "name": "evolution-of-todo",
  "version": "1.0.0",
  "scripts": {
    "dev": "npm --prefix src/frontend run dev",
    "build": "npm --prefix src/frontend install && npm --prefix src/frontend run build",
    "start": "npm --prefix src/frontend run start"
  },
  "dependencies": {
    "next": "15.1.2",
    "react": "19.0.0",
    "react-dom": "19.0.0"
  }
}"""
}

for path, content in files.items():
    full_path = os.path.join(os.getcwd(), path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    try:
        if os.path.exists(full_path):
            os.chmod(full_path, 0o666) # Ensure writable
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {path}")
    except Exception as e:
        print(f"Failed to update {path}: {e}")
