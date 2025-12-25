import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";

const getDatabase = () => {
    const url = process.env.DATABASE_URL;
    if (!url || url.length === 0) {
        // Build-time fallback to prevent BetterAuthError during static generation
        return {
            provider: "sqlite",
            url: "auth_build.db",
        };
    }
    return url.startsWith("postgres")
        ? { provider: "postgresql", url }
        : { provider: "sqlite", url: url.replace("sqlite:///", "") };
};

export const auth = betterAuth({
    database: getDatabase(),
    emailAndPassword: {
        enabled: true
    },
    plugins: [
        jwt({
            jwt: {
                // This secret must match BETTER_AUTH_SECRET in FastAPI backend
                issuer: "todo-evolution",
                expiresIn: "7d"
            }
        })
    ]
});
